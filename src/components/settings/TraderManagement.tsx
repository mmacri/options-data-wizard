
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui-components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Trash2, UserPlus } from "lucide-react";
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
import useLocalStorage from "@/hooks/useLocalStorage";
import { Trade } from "@/components/ui-components/DataTableTypes";

export function TraderManagement() {
  const { toast } = useToast();
  const [trades, setTrades] = useLocalStorage<Trade[]>("trades", []);
  const [newTraderName, setNewTraderName] = useState("");
  const [confirmDeleteTrader, setConfirmDeleteTrader] = useState<string | null>(null);
  const [renameTrader, setRenameTrader] = useState<{original: string, new: string} | null>(null);
  
  // Extract unique trader names
  const uniqueTraders = Array.from(new Set(trades.map(trade => trade.traderName || "Unknown"))).filter(name => name !== "Unknown");
  
  const handleAddTrader = () => {
    if (!newTraderName.trim()) {
      toast({
        title: "Error",
        description: "Trader name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (uniqueTraders.includes(newTraderName)) {
      toast({
        title: "Error",
        description: "A trader with this name already exists",
        variant: "destructive"
      });
      return;
    }
    
    // Create a sample trade for the new trader
    const newTrade: Trade = {
      id: crypto.randomUUID(),
      tradeId: `T${Math.floor(Math.random() * 10000)}`,
      traderName: newTraderName,
      underlyingSymbol: "SAMPLE",
      optionType: "Call",
      entryDate: new Date().toISOString().split('T')[0],
      entryPrice: 0,
      quantity: 0,
      totalPremium: 0,
      profitLoss: 0,
      status: "Pending",
      notes: "This is a placeholder trade. You can delete it.",
      totalInvested: 0,
      roi: 0
    };
    
    setTrades([...trades, newTrade]);
    setNewTraderName("");
    
    toast({
      title: "Trader added",
      description: `${newTraderName} has been added as a trader.`
    });
  };
  
  const handleDeleteTrader = (traderName: string) => {
    // Filter out all trades for the specified trader
    const updatedTrades = trades.filter(trade => trade.traderName !== traderName);
    setTrades(updatedTrades);
    setConfirmDeleteTrader(null);
    
    toast({
      title: "Trader deleted",
      description: `${traderName} and all associated trades have been deleted.`
    });
  };
  
  const handleRenameTrader = () => {
    if (!renameTrader || !renameTrader.new.trim()) {
      toast({
        title: "Error",
        description: "New trader name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (uniqueTraders.includes(renameTrader.new) && renameTrader.original !== renameTrader.new) {
      toast({
        title: "Error",
        description: "A trader with this name already exists",
        variant: "destructive"
      });
      return;
    }
    
    // Update all trades for the specified trader
    const updatedTrades = trades.map(trade => {
      if (trade.traderName === renameTrader.original) {
        return { ...trade, traderName: renameTrader.new };
      }
      return trade;
    });
    
    setTrades(updatedTrades);
    setRenameTrader(null);
    
    toast({
      title: "Trader renamed",
      description: `${renameTrader.original} has been renamed to ${renameTrader.new}.`
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trader Management</CardTitle>
        <CardDescription>Add, rename, or delete traders in your system.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Label htmlFor="newTraderName">Add New Trader</Label>
            <Input
              id="newTraderName"
              value={newTraderName}
              onChange={(e) => setNewTraderName(e.target.value)}
              placeholder="Enter trader name"
              className="mt-1"
            />
          </div>
          <Button onClick={handleAddTrader} className="flex gap-2">
            <UserPlus className="h-4 w-4" />
            Add Trader
          </Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Existing Traders</h3>
          {uniqueTraders.length > 0 ? (
            <div className="grid gap-3">
              {uniqueTraders.map((trader) => (
                <div key={trader} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                    <span>{trader}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setRenameTrader({original: trader, new: trader})}
                    >
                      Rename
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setConfirmDeleteTrader(trader)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No traders have been added yet.</p>
          )}
        </div>
      </CardContent>
      
      {/* Delete confirmation dialog */}
      <Dialog open={confirmDeleteTrader !== null} onOpenChange={(open) => !open && setConfirmDeleteTrader(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {confirmDeleteTrader}? This will permanently remove all trades associated with this trader.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteTrader(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => confirmDeleteTrader && handleDeleteTrader(confirmDeleteTrader)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rename dialog */}
      <Dialog open={renameTrader !== null} onOpenChange={(open) => !open && setRenameTrader(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Trader</DialogTitle>
            <DialogDescription>
              Enter a new name for {renameTrader?.original}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="newName">New Name</Label>
            <Input 
              id="newName" 
              value={renameTrader?.new || ''} 
              onChange={(e) => renameTrader && setRenameTrader({...renameTrader, new: e.target.value})}
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameTrader(null)}>
              Cancel
            </Button>
            <Button onClick={handleRenameTrader}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
