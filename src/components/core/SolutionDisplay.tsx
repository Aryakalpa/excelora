
'use client';

import type { GenerateExcelSolutionOutput } from '@/ai/flows/generate-excel-solution';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CopyButton from './CopyButton';
import { Button } from '@/components/ui/button';
import { Download, FileText, Brain, Lightbulb, Wand2, Table2 } from 'lucide-react'; // Added Table2 icon
import exceljs from 'exceljs';
import SpreadsheetPreview from './SpreadsheetPreview'; // Import the new component

interface SolutionDisplayProps {
  solution: GenerateExcelSolutionOutput;
  problemDescription: string;
}

export default function SolutionDisplay({ solution, problemDescription }: SolutionDisplayProps) {
  const { stepByStepGuide, formula, explanation } = solution;

  const handleDownloadExcel = async () => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Excelora Solution');

    const htmlToPlainText = (html: string | null): string => {
      if (!html) return '';
      let text = html;
      text = text.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      text = text.replace(/<style[^>]*>([\S\s]*?)<\/style>/gmi, '');
      text = text.replace(/<li>/gi, '\n  • '); 
      text = text.replace(/<\/(p|div|h[1-6]|blockquote|pre|ul|ol)>/gi, '\n'); 
      text = text.replace(/<(br|hr)\s*\/?>/gi, '\n');
      text = text.replace(/<[^>]+>/g, ' '); 
      text = text.replace(/&nbsp;/g, ' ')
                 .replace(/&amp;/g, '&')
                 .replace(/&lt;/g, '<')
                 .replace(/&gt;/g, '>')
                 .replace(/&quot;/g, '"')
                 .replace(/&#39;/g, "'");
      text = text.split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');
      text = text.replace(/\n\s*\n/g, '\n\n').trim(); 
      return text;
    };
    
    const titleFont: Partial<exceljs.Font> = { name: 'Inter', size: 16, bold: true, family: 2, color: { argb: 'FF4F46E5' } }; // Primary color
    const sectionHeaderFont: Partial<exceljs.Font> = { name: 'Inter', size: 12, bold: true, family: 2, color: { argb: 'FF111827' } }; // Foreground color
    const textFont: Partial<exceljs.Font> = { name: 'Inter', size: 11, family: 2 };
    const formulaFont: Partial<exceljs.Font> = { name: 'JetBrains Mono', size: 11, family: 4, color: { argb: 'FF22D3EE' } }; // Accent color for formula text

    const sectionLabelFill: exceljs.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } }; // Muted color
    const formulaLabelFill: exceljs.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCEEF9' } }; // Light accent

    worksheet.mergeCells('A1:D1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Excelora AI Solution';
    titleCell.font = titleFont;
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 30;
    
    let currentRow = 2; 

    const addSection = (label: string, content: string | null, contentFontToUse: Partial<exceljs.Font>, labelFillToUse: exceljs.Fill, isFormulaContent: boolean = false) => {
      if (content === null || content === undefined || content.trim() === "") return;
      
      currentRow++; 
      worksheet.getRow(currentRow).height = 8; 
      currentRow++;

      const labelCell = worksheet.getCell(`A${currentRow}`);
      labelCell.value = label;
      labelCell.font = sectionHeaderFont;
      labelCell.fill = labelFillToUse;
      labelCell.alignment = { vertical: 'top', wrapText: true, indent: 0.5 };
      labelCell.border = {
        top: { style: 'thin', color: {argb: 'FFD1D5DB'} }, bottom: { style: 'thin', color: {argb: 'FFD1D5DB'} },
        left: { style: 'thin', color: {argb: 'FFD1D5DB'} }, right: { style: 'thin', color: {argb: 'FFD1D5DB'} }
      };

      worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
      const contentCell = worksheet.getCell(`B${currentRow}`);
      contentCell.value = content;
      contentCell.font = contentFontToUse;
      contentCell.alignment = { wrapText: !isFormulaContent, vertical: 'top', indent: 0.5 };
      contentCell.border = {
        top: { style: 'thin', color: {argb: 'FFD1D5DB'} }, bottom: { style: 'thin', color: {argb: 'FFD1D5DB'} },
        left: { style: 'thin', color: {argb: 'FFD1D5DB'} }, right: { style: 'thin', color: {argb: 'FFD1D5DB'} }
      };
      
      const numLines = content.split('\n').length;
      const charPerLineEstimate = isFormulaContent ? 120 : 70; // Allow more chars per line for non-wrapping formula
      const wrapLinesEstimate = isFormulaContent ? 0 : Math.floor(content.replace(/\n/g, '').length / charPerLineEstimate);
      const totalLinesEstimate = Math.max(1, numLines + wrapLinesEstimate); 
      worksheet.getRow(currentRow).height = Math.max(20, totalLinesEstimate * 15 + 5); // Add a bit of padding
    };

    addSection('Problem Description:', problemDescription, textFont, sectionLabelFill);
    
    if (formula) {
      addSection('Generated Formula:', formula, formulaFont, formulaLabelFill, true);
    }
    
    const plainTextGuide = htmlToPlainText(stepByStepGuide);
    if (plainTextGuide) {
      addSection('Step-by-Step Guide:', plainTextGuide, textFont, sectionLabelFill);
    }
    
    const plainTextExplanation = htmlToPlainText(explanation);
    if (plainTextExplanation) {
      addSection('Explanation:', plainTextExplanation, textFont, sectionLabelFill);
    }

    worksheet.getColumn('A').width = 25; 
    worksheet.getColumn('B').width = 35;
    worksheet.getColumn('C').width = 35;
    worksheet.getColumn('D').width = 35;
    
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    const safeProblemDesc = problemDescription.substring(0,30).replace(/[^a-zA-Z0-9_ ]/g, '').replace(/\s+/g, '_');
    link.download = `Excelora_Solution_${safeProblemDesc || 'details'}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full card-interactive card-with-excel-grid mt-8 border-border group">
      <CardHeader className="pb-4">
        <CardTitle className="font-headline text-2xl flex items-center text-primary">
          <Wand2 className="mr-3 h-7 w-7" /> AI Generated Solution
        </CardTitle>
        <CardDescription className="text-md text-secondary">
          Here's the breakdown for your Excel problem: <span className="font-semibold text-foreground">{problemDescription}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['formula', 'guide']} className="w-full space-y-3">
          {formula && (
            <AccordionItem value="preview" className="group accordion-item-tech">
              <AccordionTrigger className="accordion-trigger-tech text-lg">
                <div className="flex items-center">
                  <Table2 className="mr-2 h-5 w-5" /> Conceptual Preview
                </div>
              </AccordionTrigger>
              <AccordionContent className="accordion-content-tech">
                <SpreadsheetPreview formula={formula} />
              </AccordionContent>
            </AccordionItem>
          )}

          {formula && (
            <AccordionItem value="formula" className="group accordion-item-tech">
              <AccordionTrigger className="accordion-trigger-tech text-lg">
                <div className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" /> Excel Formula
                </div>
              </AccordionTrigger>
              <AccordionContent className="accordion-content-tech">
                <pre className="p-4 bg-muted dark:bg-muted/50 rounded-md overflow-x-auto font-code text-sm border border-input text-foreground">
                  <code>{formula}</code>
                </pre>
                <CopyButton textToCopy={formula} buttonText="Copy Formula" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow" />
              </AccordionContent>
            </AccordionItem>
          )}

          {stepByStepGuide && (
            <AccordionItem value="guide" className="group accordion-item-tech">
              <AccordionTrigger className="accordion-trigger-tech text-lg">
                <div className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" /> Step-by-Step Guide
                </div>
              </AccordionTrigger>
              <AccordionContent className="accordion-content-tech prose-excelora text-foreground">
                <div dangerouslySetInnerHTML={{ __html: stepByStepGuide }} />
              </AccordionContent>
            </AccordionItem>
          )}

          {explanation && (
            <AccordionItem value="explanation" className="group accordion-item-tech">
              <AccordionTrigger className="accordion-trigger-tech text-lg">
                <div className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5" /> How it Works
                </div>
              </AccordionTrigger>
              <AccordionContent className="accordion-content-tech prose-excelora text-foreground">
                <div dangerouslySetInnerHTML={{ __html: explanation }} />
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
        {(formula || stepByStepGuide || explanation) && (
            <div className="mt-6 flex flex-col sm:flex-row justify-end items-center gap-2">
            <Button onClick={handleDownloadExcel} variant="outline" className="shadow-sm hover:shadow-md hover:border-accent transition-colors">
                <Download className="mr-2 h-4 w-4" /> Download .xlsx Example
            </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
