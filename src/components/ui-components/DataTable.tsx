
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DataTableFilter } from "./DataTableFilter";
import { FinancialSummary } from "./FinancialSummary";
import { TraderExportMenu } from "./TraderExportMenu";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableRow } from "./DataTableRow";
import { DataTablePagination } from "./DataTablePagination";
import { Trade } from "./DataTableTypes";

// Re-export types and helpers from DataTableTypes to maintain backward compatibility
export * from "./DataTableTypes";

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
  const [traderFilter, setTraderFilter] = useState<string>("all");
  const itemsPerPage = 10;

  // Get unique trader names for the filter
  const uniqueTraders = Array.from(new Set(data.map(trade => trade.traderName || "Unknown")));

  // Total invested across all open trades
  const totalInvestedAcrossOpenTrades = filteredData
    .filter(trade => trade.status === "Open")
    .reduce((sum, trade) => sum + (trade.totalInvested || 0), 0);

  // Total profit/loss across all trades
  const totalProfitLoss = filteredData.reduce((sum, trade) => sum + trade.profitLoss, 0);

  useEffect(() => {
    if (!data) return;
    
    let result = [...data];
    
    // Apply trader filter
    if (traderFilter !== "all") {
      result = result.filter(item => item.traderName === traderFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.tradeId.toLowerCase().includes(term) ||
        item.underlyingSymbol.toLowerCase().includes(term) ||
        item.optionType.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term) ||
        (item.traderName && item.traderName.toLowerCase().includes(term)) ||
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
  }, [data, searchTerm, sortColumn, sortDirection, traderFilter]);

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

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <DataTableFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            traderFilter={traderFilter}
            setTraderFilter={setTraderFilter}
            uniqueTraders={uniqueTraders}
          />
          
          {/* Trader Export Menu */}
          <TraderExportMenu 
            uniqueTraders={uniqueTraders}
            data={data}
          />
        </div>
        
        {/* Financial Summary */}
        <FinancialSummary
          totalInvestedAcrossOpenTrades={totalInvestedAcrossOpenTrades}
          totalProfitLoss={totalProfitLoss}
        />
      </div>

      <div className="overflow-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <DataTableHeader 
            handleSort={handleSort}
            getSortIcon={getSortIcon}
          />
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((trade, index) => (
                <DataTableRow
                  key={trade.id}
                  trade={trade}
                  index={index}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={10} className="p-4 text-center text-muted-foreground">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
