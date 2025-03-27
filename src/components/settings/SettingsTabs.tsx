
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppearanceSettings } from "./AppearanceSettings";
import { TradingSettings } from "./TradingSettings";
import { CalculationSettings } from "./CalculationSettings";
import { ExportSettings } from "./ExportSettings";
import { WidgetSettings } from "./WidgetSettings";
import { BackupRestoreSettings } from "./BackupRestoreSettings";
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
  onUsePercentageInsteadChange,
}: SettingsTabsProps) {
  return (
    <Tabs defaultValue="appearance" className="w-full">
      <TabsList className="grid grid-cols-6 mb-8">
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="trading">Trading</TabsTrigger>
        <TabsTrigger value="calculation">Calculation</TabsTrigger>
        <TabsTrigger value="export">Export</TabsTrigger>
        <TabsTrigger value="widgets">Widgets</TabsTrigger>
        <TabsTrigger value="backup">Backup</TabsTrigger>
      </TabsList>
      
      <TabsContent value="appearance" className="space-y-6">
        <AppearanceSettings 
          theme={theme}
          compactMode={compactMode}
          showWelcomeScreen={showWelcomeScreen}
          onThemeChange={onThemeChange}
          onCompactModeChange={onCompactModeChange}
          onShowWelcomeScreenChange={onShowWelcomeScreenChange}
        />
      </TabsContent>
      
      <TabsContent value="trading" className="space-y-6">
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
      
      <TabsContent value="calculation" className="space-y-6">
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
      
      <TabsContent value="export" className="space-y-6">
        <ExportSettings />
      </TabsContent>
      
      <TabsContent value="widgets" className="space-y-6">
        <WidgetSettings />
      </TabsContent>
      
      <TabsContent value="backup" className="space-y-6">
        <BackupRestoreSettings />
      </TabsContent>
    </Tabs>
  );
}
