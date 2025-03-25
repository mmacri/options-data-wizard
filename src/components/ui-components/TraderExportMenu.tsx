
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
import { exportTradesCSV } from "@/utils/csvUtils";
import { Trade } from "./DataTableTypes";

interface TraderExportMenuProps {
  uniqueTraders: string[];
  data: Trade[];
}

export function TraderExportMenu({ uniqueTraders, data }: TraderExportMenuProps) {
  const { toast } = useToast();

  const handleExportTraderCSV = (trader: string) => {
    try {
      // Export only the specific trader's data
      const csvData = exportTradesCSV(data, trader);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${trader.replace(/\s+/g, '_')}_trades_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: `${trader}'s trades have been exported to CSV.`
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
            onClick={() => handleExportTraderCSV(trader)}
            className="cursor-pointer"
          >
            <Download className="mr-2 h-4 w-4" />
            Export {trader}'s Trades
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
