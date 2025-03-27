
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui-components/Card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OptionType } from "@/types/settings";

interface TradingSettingsProps {
  defaultTrader: string;
  defaultSymbol: string;
  defaultQuantity: number;
  defaultOptionType: OptionType;
  onDefaultTraderChange: (value: string) => void;
  onDefaultSymbolChange: (value: string) => void;
  onDefaultQuantityChange: (value: number) => void;
  onDefaultOptionTypeChange: (value: OptionType) => void;
}

export function TradingSettings({
  defaultTrader,
  defaultSymbol,
  defaultQuantity,
  defaultOptionType,
  onDefaultTraderChange,
  onDefaultSymbolChange,
  onDefaultQuantityChange,
  onDefaultOptionTypeChange
}: TradingSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Defaults</CardTitle>
        <CardDescription>Set your preferred defaults for new trades.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="default-trader">Default Trader</Label>
          <Input 
            id="default-trader" 
            placeholder="Trader Name" 
            value={defaultTrader}
            onChange={(e) => onDefaultTraderChange(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="default-symbol">Default Symbol</Label>
          <Input 
            id="default-symbol" 
            placeholder="Symbol (e.g., SPY)" 
            value={defaultSymbol}
            onChange={(e) => onDefaultSymbolChange(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="default-quantity">Default Quantity</Label>
          <Input 
            id="default-quantity" 
            type="number"
            placeholder="Quantity" 
            value={defaultQuantity}
            onChange={(e) => onDefaultQuantityChange(Number(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="default-option-type">Default Option Type</Label>
          <Select
            value={defaultOptionType}
            onValueChange={(value) => onDefaultOptionTypeChange(value as OptionType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="put">Put</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
