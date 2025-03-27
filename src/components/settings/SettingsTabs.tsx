
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AppearanceSettings } from "./AppearanceSettings";
import { TradingSettings } from "./TradingSettings";
import { CalculationSettings } from "./CalculationSettings";
import { ExportSettings } from "./ExportSettings";
import { WidgetSettings } from "./WidgetSettings";
import { ThemeOption, OptionType, RoiMethod } from "@/types/settings";

interface SettingsTabsProps {
  // Appearance props
  theme: ThemeOption;
  compactMode: boolean;
  showWelcomeScreen: boolean;
  onThemeChange: (theme: ThemeOption) => void;
  onCompactModeChange: (checked: boolean) => void;
  onShowWelcomeScreenChange: (checked: boolean) => void;
  
  // Trading props
  defaultTrader: string;
  defaultSymbol: string;
  defaultQuantity: number;
  defaultOptionType: OptionType;
  onDefaultTraderChange: (value: string) => void;
  onDefaultSymbolChange: (value: string) => void;
  onDefaultQuantityChange: (value: number) => void;
  onDefaultOptionTypeChange: (value: OptionType) => void;
  
  // Calculation props
  roiMethod: RoiMethod;
  includeFees: boolean;
  defaultFeeAmount: number;
  usePercentageInstead: boolean;
  onRoiMethodChange: (value: RoiMethod) => void;
  onIncludeFeesChange: (checked: boolean) => void;
  onDefaultFeeAmountChange: (value: number) => void;
  onUsePercentageInsteadChange: (checked: boolean) => void;
}

export function SettingsTabs({
  // Appearance props
  theme,
  compactMode,
  showWelcomeScreen,
  onThemeChange,
  onCompactModeChange,
  onShowWelcomeScreenChange,
  
  // Trading props
  defaultTrader,
  defaultSymbol,
  defaultQuantity,
  defaultOptionType,
  onDefaultTraderChange,
  onDefaultSymbolChange,
  onDefaultQuantityChange,
  onDefaultOptionTypeChange,
  
  // Calculation props
  roiMethod,
  includeFees,
  defaultFeeAmount,
  usePercentageInstead,
  onRoiMethodChange,
  onIncludeFeesChange,
  onDefaultFeeAmountChange,
  onUsePercentageInsteadChange
}: SettingsTabsProps) {
  return (
    <Tabs defaultValue="appearance" className="mb-8">
      <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
        <TabsTrigger 
          value="appearance" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
        >
          Appearance
        </TabsTrigger>
        <TabsTrigger 
          value="trading" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
        >
          Trading
        </TabsTrigger>
        <TabsTrigger 
          value="calculation" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
        >
          Calculation
        </TabsTrigger>
        <TabsTrigger 
          value="export" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
        >
          Export
        </TabsTrigger>
        <TabsTrigger 
          value="widgets" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
        >
          Widgets
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="appearance" className="mt-4">
        <AppearanceSettings 
          theme={theme}
          compactMode={compactMode}
          showWelcomeScreen={showWelcomeScreen}
          onThemeChange={onThemeChange}
          onCompactModeChange={onCompactModeChange}
          onShowWelcomeScreenChange={onShowWelcomeScreenChange}
        />
      </TabsContent>
      
      <TabsContent value="trading" className="mt-4">
        <TradingSettings 
          defaultTrader={defaultTrader}
          defaultSymbol={defaultSymbol}
          defaultQuantity={defaultQuantity}
          defaultOptionType={defaultOptionType}
          onDefaultTraderChange={onDefaultTraderChange}
          onDefaultSymbolChange={onDefaultSymbolChange}
          onDefaultQuantityChange={onDefaultQuantityChange}
          onDefaultOptionTypeChange={onDefaultOptionTypeChange}
        />
      </TabsContent>
      
      <TabsContent value="calculation" className="mt-4">
        <CalculationSettings 
          roiMethod={roiMethod}
          includeFees={includeFees}
          defaultFeeAmount={defaultFeeAmount}
          usePercentageInstead={usePercentageInstead}
          onRoiMethodChange={onRoiMethodChange}
          onIncludeFeesChange={onIncludeFeesChange}
          onDefaultFeeAmountChange={onDefaultFeeAmountChange}
          onUsePercentageInsteadChange={onUsePercentageInsteadChange}
        />
      </TabsContent>
      
      <TabsContent value="export" className="mt-4">
        <ExportSettings />
      </TabsContent>
      
      <TabsContent value="widgets" className="mt-4">
        <WidgetSettings />
      </TabsContent>
    </Tabs>
  );
}
