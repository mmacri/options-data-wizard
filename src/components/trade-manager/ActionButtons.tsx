
import { Plus, Upload, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionButtonsProps {
  uniqueTraders: string[];
  onAddTrade: () => void;
  onImportOpen: () => void;
  onImportForTrader: (trader: string) => void;
  onExportAll: () => void;
  onExportForTrader: (trader: string) => void;
}

export const ActionButtons = ({
  uniqueTraders,
  onAddTrade,
  onImportOpen,
  onImportForTrader,
  onExportAll,
  onExportForTrader
}: ActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onImportOpen}>
            Import All Trades
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Import for Trader</DropdownMenuLabel>
          {uniqueTraders.map(trader => (
            <DropdownMenuItem 
              key={`import-${trader}`}
              onClick={() => onImportForTrader(trader)}
            >
              {trader}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onExportAll}>
            Export All Trades
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Export by Trader</DropdownMenuLabel>
          {uniqueTraders.map(trader => (
            <DropdownMenuItem 
              key={`export-${trader}`}
              onClick={() => onExportForTrader(trader)}
            >
              {trader}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <button
        onClick={onAddTrade}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New Trade
      </button>
    </div>
  );
};
