
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui-components/Card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoiMethod } from "@/types/settings";

interface CalculationSettingsProps {
  roiMethod: RoiMethod;
  includeFees: boolean;
  defaultFeeAmount: number;
  usePercentageInstead: boolean;
  onRoiMethodChange: (value: RoiMethod) => void;
  onIncludeFeesChange: (checked: boolean) => void;
  onDefaultFeeAmountChange: (value: number) => void;
  onUsePercentageInsteadChange: (checked: boolean) => void;
}

export function CalculationSettings({
  roiMethod,
  includeFees,
  defaultFeeAmount,
  usePercentageInstead,
  onRoiMethodChange,
  onIncludeFeesChange,
  onDefaultFeeAmountChange,
  onUsePercentageInsteadChange
}: CalculationSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculation Settings</CardTitle>
        <CardDescription>Configure how profit and loss are calculated.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="roi-method">ROI Method</Label>
          <Select
            value={roiMethod}
            onValueChange={(value) => onRoiMethodChange(value as RoiMethod)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ROI method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="annualized">Annualized</SelectItem>
              <SelectItem value="realizedOnly">Realized Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between rounded-md border p-4">
          <div className="space-y-1 leading-none">
            <Label htmlFor="include-fees">Include Fees</Label>
            <p className="text-sm text-muted-foreground">Include transaction fees in calculations.</p>
          </div>
          <Switch 
            id="include-fees"
            checked={includeFees}
            onCheckedChange={onIncludeFeesChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="default-fee-amount">Default Fee Amount</Label>
          <Input 
            id="default-fee-amount" 
            type="number"
            placeholder="Fee Amount" 
            value={defaultFeeAmount}
            onChange={(e) => onDefaultFeeAmountChange(Number(e.target.value))}
          />
        </div>
        
        <div className="flex items-center justify-between rounded-md border p-4">
          <div className="space-y-1 leading-none">
            <Label htmlFor="use-percentage-instead">Use Percentage Instead</Label>
            <p className="text-sm text-muted-foreground">Use percentage instead of fixed amount for fees.</p>
          </div>
          <Switch 
            id="use-percentage-instead"
            checked={usePercentageInstead}
            onCheckedChange={onUsePercentageInsteadChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
