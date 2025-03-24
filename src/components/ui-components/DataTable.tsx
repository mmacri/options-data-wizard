
import { useState, useEffect } from "react";
import { Edit, Trash, Search } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

export type OptionType = "Call" | "Put" | "Bull Call Spread" | "Bear Put Spread" | "Covered Call" | "Iron Condor" | "Butterfly";

export type Trade = {
  id: string;
  tradeId: string;
  underlyingSymbol: string;
  optionType: OptionType;
  entryDate: string;
  entryPrice: number;
  exitDate?: string;
  exitPrice?: number;
  quantity: number;
  totalPremium: number;
  profitLoss: number;
  status: "Open" | "Closed" | "Pending";
  notes?: string;
  totalInvested?: number; // Added for tracking total money invested
  roi?: number; // Return on investment percentage
};

// Helper function to calculate ROI
export const calculateROI = (profitLoss: number, totalInvested: number): number => {
  if (!totalInvested || totalInvested === 0) return 0;
  return (profitLoss / totalInvested) * 100;
};

interface DataTableProps {
  data: Trade[];
  onView: (trade: Trade) => void;
  onEdit: (trade: Trade) => void;
  onDelete: (trade: Trade) => void;
  className?: string;
}

export function DataTable({ data, onView, onEdit, onDelete, className }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<Trade[]>(data);
  const [sortColumn, setSortColumn] = useState<keyof Trade | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Total invested across all open trades
  const totalInvestedAcrossOpenTrades = data
    .filter(trade => trade.status === "Open")
    .reduce((sum, trade) => sum + (trade.totalInvested || 0), 0);

  // Total profit/loss across all trades
  const totalProfitLoss = data.reduce((sum, trade) => sum + trade.profitLoss, 0);

  useEffect(() => {
    if (!data) return;
    
    let result = [...data];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.tradeId.toLowerCase().includes(term) ||
        item.underlyingSymbol.toLowerCase().includes(term) ||
        item.optionType.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term) ||
        (item.notes && item.notes.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortDirection === 'asc' 
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        
        if (valueA === undefined || valueA === null) return sortDirection === 'asc' ? -1 : 1;
        if (valueB === undefined || valueB === null) return sortDirection === 'asc' ? 1 : -1;
        
        return sortDirection === 'asc' 
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      });
    }
    
    setFilteredData(result);
  }, [data, searchTerm, sortColumn, sortDirection]);

  const handleSort = (column: keyof Trade) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: keyof Trade) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        
        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/30 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Total Currently Invested</h3>
            <p className="text-xl font-semibold">{formatCurrency(totalInvestedAcrossOpenTrades)}</p>
          </div>
          <div className={cn(
            "p-4 rounded-md",
            totalProfitLoss > 0 ? "bg-success/20" : totalProfitLoss < 0 ? "bg-destructive/20" : "bg-muted/30"
          )}>
            <h3 className="text-sm font-medium mb-2">Total Profit/Loss</h3>
            <p className={cn(
              "text-xl font-semibold",
              totalProfitLoss > 0 ? "text-success" : totalProfitLoss < 0 ? "text-destructive" : ""
            )}>
              {formatCurrency(totalProfitLoss)}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th 
                className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('tradeId')}
              >
                Trade ID {getSortIcon('tradeId')}
              </th>
              <th 
                className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('underlyingSymbol')}
              >
                Symbol {getSortIcon('underlyingSymbol')}
              </th>
              <th 
                className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('optionType')}
              >
                Type {getSortIcon('optionType')}
              </th>
              <th 
                className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('entryDate')}
              >
                Entry Date {getSortIcon('entryDate')}
              </th>
              <th 
                className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('totalInvested')}
              >
                Invested {getSortIcon('totalInvested')}
              </th>
              <th 
                className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('profitLoss')}
              >
                P/L {getSortIcon('profitLoss')}
              </th>
              <th 
                className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('roi')}
              >
                ROI % {getSortIcon('roi')}
              </th>
              <th 
                className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('status')}
              >
                Status {getSortIcon('status')}
              </th>
              <th className="h-12 px-4 text-right align-middle font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((trade, index) => (
                <tr 
                  key={trade.id} 
                  className={cn(
                    "border-b transition-colors hover:bg-muted/50", 
                    index % 2 === 0 ? "bg-white dark:bg-card" : "bg-muted/20"
                  )}
                  onClick={() => onView(trade)}
                >
                  <td className="p-4 align-middle font-medium">
                    {trade.tradeId}
                  </td>
                  <td className="p-4 align-middle">
                    {trade.underlyingSymbol}
                  </td>
                  <td className="p-4 align-middle">
                    {trade.optionType}
                  </td>
                  <td className="p-4 align-middle">
                    {new Date(trade.entryDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 align-middle">
                    {formatCurrency(trade.totalInvested || 0)}
                  </td>
                  <td className={cn(
                    "p-4 align-middle font-medium",
                    trade.profitLoss > 0 ? "text-success" : trade.profitLoss < 0 ? "text-destructive" : ""
                  )}>
                    {formatCurrency(trade.profitLoss)}
                  </td>
                  <td className={cn(
                    "p-4 align-middle font-medium",
                    (trade.roi || 0) > 0 ? "text-success" : (trade.roi || 0) < 0 ? "text-destructive" : ""
                  )}>
                    {trade.roi?.toFixed(2) || "0.00"}%
                  </td>
                  <td className="p-4 align-middle">
                    <StatusBadge status={trade.status} />
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(trade);
                        }}
                        className="btn-icon bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(trade);
                        }}
                        className="btn-icon bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-4 text-center text-muted-foreground">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
