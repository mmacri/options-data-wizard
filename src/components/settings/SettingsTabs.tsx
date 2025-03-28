
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppearanceSettings } from "./AppearanceSettings";
import { TradingSettings } from "./TradingSettings";
import { CalculationSettings } from "./CalculationSettings";
import { ExportSettings } from "./ExportSettings";
import { WidgetSettings } from "./WidgetSettings";
import { BackupRestoreSettings } from "./BackupRestoreSettings";
import { TraderManagement } from "./TraderManagement";
import { DataManagement } from "./DataManagement";
import { ThemeOption, OptionType, RoiMethod, ExportFormat } from "@/types/settings";

interface SettingsTabsProps {
  // Appearance props
  theme: ThemeOption;
  compactMode: boolean;
  showWelcomeScreen: boolean;
  onThemeChange: (theme: ThemeOption) => void;
  onCompactModeChange: (compactMode: boolean) => void;
  onShowWelcomeScreenChange: (showWelcomeScreen: boolean) => void;
  
  // Trading props
  defaultTrader: string;
  defaultSymbol: string;
  defaultQuantity: number;
  defaultOptionType: OptionType;
  onDefaultTraderChange: (defaultTrader: string) => void;
  onDefaultSymbolChange: (defaultSymbol: string) => void;
  onDefaultQuantityChange: (defaultQuantity: number) => void;
  onDefaultOptionTypeChange: (defaultOptionType: OptionType) => void;
  
  // Calculation props
  roiMethod: RoiMethod;
  includeFees: boolean;
  defaultFeeAmount: number;
  usePercentageInstead: boolean;
  onRoiMethodChange: (roiMethod: RoiMethod) => void;
  onIncludeFeesChange: (includeFees: boolean) => void;
  onDefaultFeeAmountChange: (defaultFeeAmount: number) => void;
  onUsePercentageInsteadChange: (usePercentageInstead: boolean) => void;
  
  // Export props
  defaultExportFormat?: ExportFormat;
  includeMetadata?: boolean;
  includeCharts?: boolean;
  includeSummary?: boolean;
  onDefaultExportFormatChange?: (format: ExportFormat) => void;
  onIncludeMetadataChange?: (include: boolean) => void;
  onIncludeChartsChange?: (include: boolean) => void;
  onIncludeSummaryChange?: (include: boolean) => void;
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
  
  // Export props
  defaultExportFormat = "csv",
  includeMetadata = true,
  includeCharts = false,
  includeSummary = true,
  onDefaultExportFormatChange = () => {},
  onIncludeMetadataChange = () => {},
  onIncludeChartsChange = () => {},
  onIncludeSummaryChange = () => {},
}: SettingsTabsProps) {
  return (
    <Tabs defaultValue="appearance" className="space-y-4">
      <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-1">
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="trading">Trading</TabsTrigger>
        <TabsTrigger value="calculation">Calculation</TabsTrigger>
        <TabsTrigger value="export">Export</TabsTrigger>
        <TabsTrigger value="traders">Traders</TabsTrigger>
        <TabsTrigger value="data">Data</TabsTrigger>
      </TabsList>
      
      <TabsContent value="appearance" className="space-y-4">
        <AppearanceSettings 
          theme={theme}
          compactMode={compactMode}
          showWelcomeScreen={showWelcomeScreen}
          onThemeChange={onThemeChange}
          onCompactModeChange={onCompactModeChange}
          onShowWelcomeScreenChange={onShowWelcomeScreenChange}
        />
        <WidgetSettings />
      </TabsContent>
      
      <TabsContent value="trading" className="space-y-4">
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
      
      <TabsContent value="calculation" className="space-y-4">
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
      
      <TabsContent value="export" className="space-y-4">
        <ExportSettings 
          defaultExportFormat={defaultExportFormat}
          includeMetadata={includeMetadata}
          includeCharts={includeCharts}
          includeSummary={includeSummary}
          onDefaultExportFormatChange={onDefaultExportFormatChange}
          onIncludeMetadataChange={onIncludeMetadataChange}
          onIncludeChartsChange={onIncludeChartsChange}
          onIncludeSummaryChange={onIncludeSummaryChange}
        />
        <BackupRestoreSettings />
      </TabsContent>
      
      <TabsContent value="traders" className="space-y-4">
        <TraderManagement />
      </TabsContent>
      
      <TabsContent value="data" className="space-y-4">
        <DataManagement />
      </TabsContent>
    </Tabs>
  );
}
