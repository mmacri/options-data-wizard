
import { Download, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trade } from "./DataTableTypes";
import { ExportFormatDialog } from "@/components/trade-manager/ExportFormatDialog";
import { exportTrades } from "@/utils/exportUtils";
import useLocalStorage from "@/hooks/useLocalStorage";

interface TraderExportMenuProps {
  uniqueTraders: string[];
  data: Trade[];
}

export function TraderExportMenu({ uniqueTraders, data }: TraderExportMenuProps) {
  const { toast } = useToast();
  const [settings] = useLocalStorage("userSettings", {
    exportSettings: {
      defaultFormat: "csv" as const,
      includeMetadata: true,
      includeCharts: false,
      includeSummary: true,
    }
  });

  const handleExportTrader = async (
    trader: string, 
    format: 'csv' | 'excel' | 'pdf' | 'json' = settings.exportSettings?.defaultFormat || 'csv',
    options = { 
      includeMetadata: settings.exportSettings?.includeMetadata || true, 
      includeCharts: settings.exportSettings?.includeCharts || false, 
      includeSummary: settings.exportSettings?.includeSummary || true 
    }
  ) => {
    try {
      // Filter data for the specific trader
      const traderData = data.filter(trade => trade.traderName === trader);
      
      // Export the data using our utility
      await exportTrades(traderData, format, trader, options);
      
      toast({
        title: "Export successful",
        description: `${trader}'s trades have been exported as ${format.toUpperCase()}.`
      });
    } catch (err) {
      console.error('Export error:', err);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center rounded-md border border-input bg-background h-10 px-4 py-2 text-sm font-medium">
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Trader Actions</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export by Trader</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {uniqueTraders.map((trader) => (
          <DropdownMenuItem 
            key={trader}
            className="cursor-pointer p-0"
          >
            <ExportFormatDialog 
              onExport={(format, options) => handleExportTrader(trader, format, options)}
              trigger={
                <button className="flex w-full items-center px-2 py-1.5 text-sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export {trader}'s Trades
                </button>
              }
              traderName={trader}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
