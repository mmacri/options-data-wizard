
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import { Trade, OptionType, calculateROI } from "./DataTable";

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
    totalInvested: 0,
    roi: 0,
    traderName: "", // Added trader name field
  });

  // Auto-calculate total invested and ROI based on other fields
  useEffect(() => {
    // This is a simplified calculation - in reality, different option strategies 
    // would have different investment calculations
    const totalInvested = formData.entryPrice * formData.quantity;
    const roi = calculateROI(formData.profitLoss, totalInvested);
    
    setFormData(prev => ({
      ...prev,
      totalInvested,
      roi
    }));
  }, [formData.entryPrice, formData.quantity, formData.profitLoss]);

  useEffect(() => {
    if (trade) {
      // If editing an existing trade, use its values
      setFormData({
        ...trade,
        entryDate: new Date(trade.entryDate).toISOString().split('T')[0],
        exitDate: trade.exitDate ? new Date(trade.exitDate).toISOString().split('T')[0] : undefined,
        // Ensure the financial calculations are updated
        totalInvested: trade.totalInvested || trade.entryPrice * trade.quantity,
        roi: trade.roi || calculateROI(trade.profitLoss, trade.totalInvested || trade.entryPrice * trade.quantity),
        traderName: trade.traderName || "" // Set trader name
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
        totalInvested: 0,
        roi: 0,
        traderName: "" // Initialize trader name
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

  const optionTypes: OptionType[] = [
    "Call", 
    "Put", 
    "Bull Call Spread", 
    "Bear Put Spread", 
    "Covered Call", 
    "Iron Condor", 
    "Butterfly"
  ];

  if (!isOpen) return null;

  // Helper to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

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
            {/* Trader Name field - NEW */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="traderName">
                Trader Name
              </label>
              <input
                id="traderName"
                name="traderName"
                value={formData.traderName || ""}
                onChange={handleChange}
                disabled={!isEditMode}
                placeholder="Enter trader name"
                className={cn(
                  "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  !isEditMode && "opacity-70"
                )}
              />
            </div>
            
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
                {optionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="totalInvested">
                Total Invested
              </label>
              <input
                id="totalInvested"
                name="totalInvested"
                type="number"
                step="0.01"
                value={formData.totalInvested}
                onChange={handleChange}
                disabled={!isEditMode}
                className={cn(
                  "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  !isEditMode && "opacity-70"
                )}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="roi">
                ROI (%)
              </label>
              <div className="flex items-center">
                <input
                  id="roi"
                  name="roi"
                  type="number"
                  step="0.01"
                  value={formData.roi?.toFixed(2) || "0.00"}
                  disabled={true}
                  className="w-full h-10 rounded-md border border-input bg-muted px-3 py-2 text-sm opacity-70"
                />
                <span className="ml-2 text-sm text-muted-foreground">Auto-calculated</span>
              </div>
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
          
          {/* Financial Summary Section */}
          {!isEditMode && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-3">Financial Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted/30 rounded-md">
                  <div className="text-sm text-muted-foreground">Total Invested</div>
                  <div className="text-lg font-medium">{formatCurrency(formData.totalInvested || 0)}</div>
                </div>
                <div className={cn(
                  "p-3 rounded-md",
                  formData.profitLoss > 0 ? "bg-success/20" : formData.profitLoss < 0 ? "bg-destructive/20" : "bg-muted/30"
                )}>
                  <div className="text-sm text-muted-foreground">Profit/Loss</div>
                  <div className={cn(
                    "text-lg font-medium",
                    formData.profitLoss > 0 ? "text-success" : formData.profitLoss < 0 ? "text-destructive" : ""
                  )}>
                    {formatCurrency(formData.profitLoss)}
                  </div>
                </div>
                <div className={cn(
                  "p-3 rounded-md",
                  (formData.roi || 0) > 0 ? "bg-success/20" : (formData.roi || 0) < 0 ? "bg-destructive/20" : "bg-muted/30"
                )}>
                  <div className="text-sm text-muted-foreground">ROI</div>
                  <div className={cn(
                    "text-lg font-medium",
                    (formData.roi || 0) > 0 ? "text-success" : (formData.roi || 0) < 0 ? "text-destructive" : ""
                  )}>
                    {formData.roi?.toFixed(2) || "0.00"}%
                  </div>
                </div>
              </div>
            </div>
          )}
          
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
