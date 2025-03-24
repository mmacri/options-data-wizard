
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import { Trade } from "./DataTable";

interface TradeModalProps {
  trade?: Trade;
  isOpen: boolean;
  onClose: () => void;
  onSave: (trade: Trade) => void;
  isEditMode?: boolean;
}

export function TradeModal({ 
  trade, 
  isOpen, 
  onClose, 
  onSave,
  isEditMode = false
}: TradeModalProps) {
  const [formData, setFormData] = useState<Trade>({
    id: "",
    tradeId: "",
    underlyingSymbol: "",
    optionType: "Call",
    entryDate: new Date().toISOString().split('T')[0],
    entryPrice: 0,
    quantity: 0,
    totalPremium: 0,
    profitLoss: 0,
    status: "Open",
  });

  useEffect(() => {
    if (trade) {
      setFormData({
        ...trade,
        entryDate: new Date(trade.entryDate).toISOString().split('T')[0],
        exitDate: trade.exitDate ? new Date(trade.exitDate).toISOString().split('T')[0] : undefined
      });
    } else {
      // Generate a random trade ID for new trades
      setFormData({
        id: crypto.randomUUID(),
        tradeId: `T${Math.floor(Math.random() * 10000)}`,
        underlyingSymbol: "",
        optionType: "Call",
        entryDate: new Date().toISOString().split('T')[0],
        entryPrice: 0,
        quantity: 0,
        totalPremium: 0,
        profitLoss: 0,
        status: "Open",
      });
    }
  }, [trade, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData({ 
        ...formData, 
        [name]: parseFloat(value) || 0 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-card rounded-lg shadow-lg animate-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card/95 backdrop-blur-sm p-6">
          <div className="flex flex-col">
            <h2 className="text-xl font-medium">
              {isEditMode ? "Edit Trade" : trade ? "View Trade" : "Add New Trade"}
            </h2>
            {trade && (
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-muted-foreground">{trade.underlyingSymbol}</span>
                <StatusBadge status={trade.status} />
              </div>
            )}
          </div>
          <button 
            onClick={onClose}
            className="btn-icon hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="tradeId">
                Trade ID
              </label>
              <input
                id="tradeId"
                name="tradeId"
                value={formData.tradeId}
                onChange={handleChange}
                disabled={!isEditMode}
                className={cn(
                  "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  !isEditMode && "opacity-70"
                )}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="underlyingSymbol">
                Symbol
              </label>
              <input
                id="underlyingSymbol"
                name="underlyingSymbol"
                value={formData.underlyingSymbol}
                onChange={handleChange}
                disabled={!isEditMode}
                className={cn(
                  "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  !isEditMode && "opacity-70"
                )}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="optionType">
                Option Type
              </label>
              <select
                id="optionType"
                name="optionType"
                value={formData.optionType}
                onChange={handleChange}
                disabled={!isEditMode}
                className={cn(
                  "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  !isEditMode && "opacity-70"
                )}
              >
                <option value="Call">Call</option>
                <option value="Put">Put</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={!isEditMode}
                className={cn(
                  "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  !isEditMode && "opacity-70"
                )}
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="entryDate">
                Entry Date
              </label>
              <input
                id="entryDate"
                name="entryDate"
                type="date"
                value={formData.entryDate}
                onChange={handleChange}
                disabled={!isEditMode}
                className={cn(
                  "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  !isEditMode && "opacity-70"
                )}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="exitDate">
                Exit Date
              </label>
              <input
                id="exitDate"
                name="exitDate"
                type="date"
                value={formData.exitDate || ""}
                onChange={handleChange}
                disabled={!isEditMode}
                className={cn(
                  "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  !isEditMode && "opacity-70"
                )}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="entryPrice">
                Entry Price
              </label>
              <input
                id="entryPrice"
                name="entryPrice"
                type="number"
                step="0.01"
                value={formData.entryPrice}
                onChange={handleChange}
                disabled={!isEditMode}
                className={cn(
                  "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  !isEditMode && "opacity-70"
                )}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="exitPrice">
                Exit Price
              </label>
              <input
                id="exitPrice"
                name="exitPrice"
                type="number"
                step="0.01"
                value={formData.exitPrice || ""}
                onChange={handleChange}
                disabled={!isEditMode}
                className={cn(
                  "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  !isEditMode && "opacity-70"
                )}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="quantity">
                Quantity
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                disabled={!isEditMode}
                className={cn(
                  "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  !isEditMode && "opacity-70"
                )}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="totalPremium">
                Total Premium
              </label>
              <input
                id="totalPremium"
                name="totalPremium"
                type="number"
                step="0.01"
                value={formData.totalPremium}
                onChange={handleChange}
                disabled={!isEditMode}
                className={cn(
                  "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  !isEditMode && "opacity-70"
                )}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="profitLoss">
                Profit/Loss
              </label>
              <input
                id="profitLoss"
                name="profitLoss"
                type="number"
                step="0.01"
                value={formData.profitLoss}
                onChange={handleChange}
                disabled={!isEditMode}
                className={cn(
                  "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  !isEditMode && "opacity-70"
                )}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              disabled={!isEditMode}
              rows={4}
              className={cn(
                "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                !isEditMode && "opacity-70"
              )}
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </button>
            {isEditMode && (
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
