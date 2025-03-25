
import { KeyboardEventHandler } from "react";
import { Trade } from "./DataTableTypes";

interface DataTableHeaderProps {
  handleSort: (column: keyof Trade) => void;
  getSortIcon: (column: keyof Trade) => string | null;
}

export function DataTableHeader({ handleSort, getSortIcon }: DataTableHeaderProps) {
  const handleKeyDown = (column: keyof Trade): KeyboardEventHandler<HTMLTableCellElement> => {
    return (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSort(column);
      }
    };
  };

  return (
    <thead className="border-b bg-muted/50">
      <tr>
        <th 
          className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
          onClick={() => handleSort('tradeId')}
          onKeyDown={handleKeyDown('tradeId')}
          tabIndex={0}
          role="button"
          aria-label="Sort by Trade ID"
        >
          Trade ID {getSortIcon('tradeId')}
        </th>
        <th 
          className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
          onClick={() => handleSort('traderName')}
          onKeyDown={handleKeyDown('traderName')}
          tabIndex={0}
          role="button"
          aria-label="Sort by Trader"
        >
          Trader {getSortIcon('traderName')}
        </th>
        <th 
          className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
          onClick={() => handleSort('underlyingSymbol')}
          onKeyDown={handleKeyDown('underlyingSymbol')}
          tabIndex={0}
          role="button"
          aria-label="Sort by Symbol"
        >
          Symbol {getSortIcon('underlyingSymbol')}
        </th>
        <th 
          className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
          onClick={() => handleSort('optionType')}
          onKeyDown={handleKeyDown('optionType')}
          tabIndex={0}
          role="button"
          aria-label="Sort by Type"
        >
          Type {getSortIcon('optionType')}
        </th>
        <th 
          className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
          onClick={() => handleSort('entryDate')}
          onKeyDown={handleKeyDown('entryDate')}
          tabIndex={0}
          role="button"
          aria-label="Sort by Entry Date"
        >
          Entry Date {getSortIcon('entryDate')}
        </th>
        <th 
          className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
          onClick={() => handleSort('totalInvested')}
          onKeyDown={handleKeyDown('totalInvested')}
          tabIndex={0}
          role="button"
          aria-label="Sort by Invested"
        >
          Invested {getSortIcon('totalInvested')}
        </th>
        <th 
          className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
          onClick={() => handleSort('profitLoss')}
          onKeyDown={handleKeyDown('profitLoss')}
          tabIndex={0}
          role="button"
          aria-label="Sort by P/L"
        >
          P/L {getSortIcon('profitLoss')}
        </th>
        <th 
          className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
          onClick={() => handleSort('roi')}
          onKeyDown={handleKeyDown('roi')}
          tabIndex={0}
          role="button"
          aria-label="Sort by ROI"
        >
          ROI % {getSortIcon('roi')}
        </th>
        <th 
          className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
          onClick={() => handleSort('status')}
          onKeyDown={handleKeyDown('status')}
          tabIndex={0}
          role="button"
          aria-label="Sort by Status"
        >
          Status {getSortIcon('status')}
        </th>
        <th className="h-12 px-4 text-right align-middle font-medium">
          Actions
        </th>
      </tr>
    </thead>
  );
}
