
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui-components/Card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, DatabaseBackup, Calendar, FileArchive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangeSelector } from "@/components/ui-components/DateRangeSelector";
import { DateRange } from "react-day-picker";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Checkbox } from "@/components/ui/checkbox";

export function DataManagement() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clearType, setClearType] = useState<"all" | "trader" | "dateRange">("all");
  const [selectedTrader, setSelectedTrader] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [confirmInput, setConfirmInput] = useState("");
  
  // Checkboxes for data types to clear
  const [clearTrades, setClearTrades] = useState(true);
  const [clearSummary, setClearSummary] = useState(true);
  const [clearPositions, setClearPositions] = useState(true);
  const [clearMetrics, setClearMetrics] = useState(true);
  
  const [trades, setTrades] = useLocalStorage<any[]>("trades", []);
  const [tradeSummary, setTradeSummary] = useLocalStorage<any[]>("tradeSummary", []);
  const [openPositions, setOpenPositions] = useLocalStorage<any[]>("openPositions", []);
  const [performanceMetrics, setPerformanceMetrics] = useLocalStorage<any[]>("performanceMetrics", []);
  
  // Extract unique trader names
  const uniqueTraders = Array.from(new Set(trades.map(trade => trade.traderName || "Unknown"))).filter(name => name !== "Unknown");
  
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setClearType("all");
    setSelectedTrader("");
    setDateRange(undefined);
    setConfirmInput("");
  };
  
  const handleClearData = () => {
    if (confirmInput !== "DELETE") {
      toast({
        title: "Confirmation failed",
        description: "Please type DELETE to confirm data deletion.",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare filters based on selected clear type
    const filterByTrader = (item: any) => 
      clearType !== "trader" || item.traderName !== selectedTrader;
      
    const filterByDateRange = (item: any) => {
      if (clearType !== "dateRange" || !dateRange?.from) return true;
      
      const itemDate = new Date(item.entryDate);
      let shouldKeep = true;
      
      if (dateRange.from) {
        shouldKeep = itemDate < dateRange.from;
        
        if (dateRange.to) {
          shouldKeep = shouldKeep || itemDate > dateRange.to;
        }
      }
      
      return shouldKeep;
    };
    
    // Apply filters and update storage
    if (clearTrades) {
      const updatedTrades = clearType === "all" 
        ? [] 
        : trades.filter(item => filterByTrader(item) && filterByDateRange(item));
      setTrades(updatedTrades);
    }
    
    if (clearSummary) {
      const updatedSummary = clearType === "all" 
        ? [] 
        : tradeSummary.filter(item => filterByTrader(item) && filterByDateRange(item));
      setTradeSummary(updatedSummary);
    }
    
    if (clearPositions) {
      const updatedPositions = clearType === "all" 
        ? [] 
        : openPositions.filter(item => filterByTrader(item) && filterByDateRange(item));
      setOpenPositions(updatedPositions);
    }
    
    if (clearMetrics) {
      const updatedMetrics = clearType === "all" 
        ? [] 
        : performanceMetrics.filter(item => filterByTrader(item));
      setPerformanceMetrics(updatedMetrics);
    }
    
    setIsDialogOpen(false);
    
    toast({
      title: "Data cleared",
      description: clearType === "all" 
        ? "All data has been cleared." 
        : clearType === "trader" 
          ? `Data for ${selectedTrader} has been cleared.` 
          : "Data within the specified date range has been cleared."
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>Manage your trade data, including clearing data based on various criteria.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Clear Data</h3>
          <p className="text-sm text-muted-foreground">
            Remove data from the system based on specific criteria. This action cannot be undone.
          </p>
          <Button 
            variant="destructive" 
            onClick={handleOpenDialog}
            className="mt-2 flex gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Data
          </Button>
        </div>
        
        <div className="space-y-2 pt-4 border-t">
          <h3 className="text-sm font-medium">Data Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <p className="text-sm font-medium">Total Trades</p>
              <p className="text-2xl font-bold">{trades.length}</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="text-sm font-medium">Total Traders</p>
              <p className="text-2xl font-bold">{uniqueTraders.length}</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="text-sm font-medium">Open Positions</p>
              <p className="text-2xl font-bold">{openPositions.length}</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="text-sm font-medium">Data Size</p>
              <p className="text-2xl font-bold">
                {Math.round((
                  JSON.stringify(trades).length +
                  JSON.stringify(tradeSummary).length +
                  JSON.stringify(openPositions).length +
                  JSON.stringify(performanceMetrics).length
                ) / 1024)} KB
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Clear data dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Clear Data</DialogTitle>
            <DialogDescription>
              Select the criteria for clearing data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Clear Type</Label>
              <Select 
                value={clearType} 
                onValueChange={(value: "all" | "trader" | "dateRange") => setClearType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select clear type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Data</SelectItem>
                  <SelectItem value="trader">By Trader</SelectItem>
                  <SelectItem value="dateRange">By Date Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {clearType === "trader" && (
              <div className="space-y-2">
                <Label>Select Trader</Label>
                <Select 
                  value={selectedTrader} 
                  onValueChange={setSelectedTrader}
                  disabled={uniqueTraders.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trader" />
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
            
            {clearType === "dateRange" && (
              <div className="space-y-2">
                <Label>Select Date Range</Label>
                <DateRangeSelector 
                  dateRange={dateRange}
                  onChange={setDateRange}
                />
              </div>
            )}
            
            <div className="space-y-4 pt-4 border-t">
              <Label>Data to Clear</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="clearTrades" 
                    checked={clearTrades} 
                    onCheckedChange={(checked) => setClearTrades(checked === true)}
                  />
                  <label 
                    htmlFor="clearTrades" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Trades
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="clearSummary" 
                    checked={clearSummary} 
                    onCheckedChange={(checked) => setClearSummary(checked === true)}
                  />
                  <label 
                    htmlFor="clearSummary" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Trade Summary
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="clearPositions" 
                    checked={clearPositions} 
                    onCheckedChange={(checked) => setClearPositions(checked === true)}
                  />
                  <label 
                    htmlFor="clearPositions" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Open Positions
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="clearMetrics" 
                    checked={clearMetrics} 
                    onCheckedChange={(checked) => setClearMetrics(checked === true)}
                  />
                  <label 
                    htmlFor="clearMetrics" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Performance Metrics
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="confirmDelete">Type DELETE to confirm</Label>
              <input
                id="confirmDelete"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="DELETE"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleClearData}
              disabled={
                (clearType === "trader" && !selectedTrader) ||
                (clearType === "dateRange" && !dateRange?.from) ||
                confirmInput !== "DELETE" ||
                !(clearTrades || clearSummary || clearPositions || clearMetrics)
              }
            >
              Clear Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
