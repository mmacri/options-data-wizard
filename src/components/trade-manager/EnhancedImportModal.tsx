
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserCircle, X, Calendar } from "lucide-react";
import { ImportTemplateHelper } from "./ImportTemplateHelper";
import { DateRange } from "react-day-picker";
import { DateRangeSelector } from "@/components/ui-components/DateRangeSelector";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trade } from "@/components/ui-components/DataTableTypes";
import { importTradesCSV } from "@/utils/csvUtils";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EnhancedImportModalProps {
  isOpen: boolean;
  uniqueTraders: string[];
  existingTrades: Trade[];
  onClose: () => void;
  onImportComplete: (newTrades: Trade[]) => void;
}

export function EnhancedImportModal({
  isOpen,
  uniqueTraders,
  existingTrades,
  onClose,
  onImportComplete
}: EnhancedImportModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"csv" | "specific">("csv");
  
  // CSV import state
  const [csvImportText, setCsvImportText] = useState("");
  const [selectedTraderImport, setSelectedTraderImport] = useState<string | null>(null);
  
  // Specific import state
  const [specificTrader, setSpecificTrader] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [importOptions, setImportOptions] = useState({
    includePending: true,
    includeOpen: true,
    includeClosed: true
  });
  
  const handleCsvImport = () => {
    try {
      if (!csvImportText.trim()) {
        toast({
          title: "Import failed",
          description: "No CSV data provided.",
          variant: "destructive"
        });
        return;
      }
      
      const importedTrades = importTradesCSV(csvImportText, selectedTraderImport || undefined);
      onImportComplete(importedTrades);
      
      toast({
        title: "Import successful",
        description: `${importedTrades.length} trades have been imported.`
      });
      
      resetForm();
    } catch (err) {
      console.error('Import error:', err);
      toast({
        title: "Import failed",
        description: "There was an error importing your data. Please check the CSV format.",
        variant: "destructive"
      });
    }
  };
  
  const handleSpecificImport = () => {
    try {
      if (!specificTrader) {
        toast({
          title: "Import failed",
          description: "Please select a trader to import from.",
          variant: "destructive"
        });
        return;
      }
      
      // Filter trades based on selected criteria
      let filteredTrades = existingTrades.filter(trade => {
        // Filter by trader
        if (trade.traderName !== specificTrader) return false;
        
        // Filter by status
        if (
          (trade.status === "Pending" && !importOptions.includePending) ||
          (trade.status === "Open" && !importOptions.includeOpen) ||
          (trade.status === "Closed" && !importOptions.includeClosed)
        ) {
          return false;
        }
        
        // Filter by date range if specified
        if (dateRange?.from) {
          const tradeDate = new Date(trade.entryDate);
          if (tradeDate < dateRange.from) return false;
          
          if (dateRange.to && tradeDate > dateRange.to) return false;
        }
        
        return true;
      });
      
      // Generate new IDs for the imported trades to avoid conflicts
      const newTrades = filteredTrades.map(trade => ({
        ...trade,
        id: crypto.randomUUID(),
        tradeId: `${trade.tradeId}-copy`
      }));
      
      if (newTrades.length === 0) {
        toast({
          title: "No trades found",
          description: "No trades match the selected criteria.",
          variant: "destructive"
        });
        return;
      }
      
      onImportComplete(newTrades);
      
      toast({
        title: "Import successful",
        description: `${newTrades.length} trades have been imported.`
      });
      
      resetForm();
    } catch (err) {
      console.error('Import error:', err);
      toast({
        title: "Import failed",
        description: "There was an error importing the selected trades.",
        variant: "destructive"
      });
    }
  };
  
  const resetForm = () => {
    setCsvImportText("");
    setSelectedTraderImport(null);
    setSpecificTrader("");
    setDateRange(undefined);
    setImportOptions({
      includePending: true,
      includeOpen: true,
      includeClosed: true
    });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetForm()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Trades</DialogTitle>
          <DialogDescription>
            Import trades from CSV or from specific traders and time periods.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "csv" | "specific")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="csv">CSV Import</TabsTrigger>
            <TabsTrigger value="specific">Specific Import</TabsTrigger>
          </TabsList>
          
          <TabsContent value="csv" className="space-y-4 pt-4">
            <ImportTemplateHelper />
            
            {selectedTraderImport && (
              <div className="mt-2 flex items-center p-2 bg-secondary rounded-md">
                <span className="text-primary font-medium">
                  Importing for trader: {selectedTraderImport}
                </span>
                <Button variant="ghost" size="icon" className="h-5 w-5 ml-2" onClick={() => setSelectedTraderImport(null)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {!selectedTraderImport && uniqueTraders.length > 0 && (
              <div className="space-y-2">
                <Label>Assign to Trader (Optional)</Label>
                <Select onValueChange={setSelectedTraderImport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trader (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueTraders.map(trader => (
                      <SelectItem key={trader} value={trader}>
                        {trader}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="csvImport">CSV Data</Label>
              <Textarea
                id="csvImport"
                placeholder="Paste your CSV data here..."
                className="font-mono text-xs h-40"
                value={csvImportText}
                onChange={(e) => setCsvImportText(e.target.value)}
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleCsvImport} disabled={!csvImportText.trim()}>
                Import
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="specific" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Select Trader</Label>
              <Select value={specificTrader} onValueChange={setSpecificTrader}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a trader" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueTraders.map(trader => (
                    <SelectItem key={trader} value={trader}>
                      {trader}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range (Optional)
              </Label>
              <DateRangeSelector 
                dateRange={dateRange}
                onChange={setDateRange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Include Trade Status</Label>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includePending"
                    checked={importOptions.includePending}
                    onChange={() => setImportOptions({
                      ...importOptions,
                      includePending: !importOptions.includePending
                    })}
                  />
                  <label htmlFor="includePending">Pending Trades</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeOpen"
                    checked={importOptions.includeOpen}
                    onChange={() => setImportOptions({
                      ...importOptions,
                      includeOpen: !importOptions.includeOpen
                    })}
                  />
                  <label htmlFor="includeOpen">Open Trades</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeClosed"
                    checked={importOptions.includeClosed}
                    onChange={() => setImportOptions({
                      ...importOptions,
                      includeClosed: !importOptions.includeClosed
                    })}
                  />
                  <label htmlFor="includeClosed">Closed Trades</label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button 
                onClick={handleSpecificImport} 
                disabled={!specificTrader || (!importOptions.includePending && !importOptions.includeOpen && !importOptions.includeClosed)}
              >
                Import
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
