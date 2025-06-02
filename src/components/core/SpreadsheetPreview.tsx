
'use client';

import { cn } from '@/lib/utils';

interface SpreadsheetPreviewProps {
  formula: string;
  rows?: number;
  cols?: number;
}

const SpreadsheetPreview = ({
  formula,
  rows = 5,
  cols = 4,
}: SpreadsheetPreviewProps) => {
  const columnHeaders = Array.from({ length: cols }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const rowHeaders = Array.from({ length: rows }, (_, i) => i + 1);

  return (
    <div className="p-4 bg-card border border-border rounded-lg shadow-md overflow-hidden">
      {/* Formula Bar */}
      <div className="mb-3 flex items-center">
        <div className="px-2 py-1.5 border border-input bg-muted/50 rounded-l-md text-xs font-medium text-muted-foreground">
          fx
        </div>
        <div className="flex-grow px-3 py-1.5 border-t border-b border-r border-input rounded-r-md bg-background text-sm font-code text-accent overflow-x-auto whitespace-nowrap">
          {formula}
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-input">
          <thead>
            <tr>
              <th className="p-1.5 border border-input bg-muted/70 w-10 min-w-[2.5rem]"></th> {/* Corner cell */}
              {columnHeaders.map((header) => (
                <th
                  key={header}
                  className="p-1.5 border border-input bg-muted/70 text-xs font-semibold text-muted-foreground min-w-[4rem] sm:min-w-[5rem]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowHeaders.map((rowNum) => (
              <tr key={rowNum}>
                <td className="p-1.5 border border-input bg-muted/70 text-xs font-semibold text-muted-foreground text-center w-10 min-w-[2.5rem]">
                  {rowNum}
                </td>
                {columnHeaders.map((colLetter, colIndex) => {
                  const cellId = `${colLetter}${rowNum}`;
                  const isFormulaCell = rowNum === 1 && colIndex === 0; // A1
                  return (
                    <td
                      key={cellId}
                      className={cn(
                        'p-1.5 border border-input h-8 min-w-[4rem] sm:min-w-[5rem] text-sm',
                        isFormulaCell ? 'bg-primary/10 border-2 border-primary/50 font-code text-primary overflow-hidden whitespace-nowrap' : 'bg-background'
                      )}
                      title={isFormulaCell ? formula : cellId}
                    >
                      {isFormulaCell ? <span className="truncate block">{formula}</span> : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <p className="mt-3 text-xs text-muted-foreground text-center">
        Conceptual preview. The formula is shown in cell A1.
      </p>
    </div>
  );
};

export default SpreadsheetPreview;
