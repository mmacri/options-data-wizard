
import { Edit, Trash } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import { Trade } from "./DataTableTypes";

interface DataTableRowProps {
  trade: Trade;
  index: number;
  onView: (trade: Trade) => void;
  onEdit: (trade: Trade) => void;
  onDelete: (trade: Trade) => void;
}

export function DataTableRow({ trade, index, onView, onEdit, onDelete }: DataTableRowProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
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
        {trade.traderName || "Unknown"}
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
            aria-label={`Edit trade ${trade.tradeId}`}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(trade);
            }}
            className="btn-icon bg-destructive text-destructive-foreground hover:bg-destructive/90"
            aria-label={`Delete trade ${trade.tradeId}`}
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
