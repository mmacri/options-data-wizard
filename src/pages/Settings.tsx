
import { useState } from "react";
import { DateFilter } from "@/components/ui-components/DateFilter";
import { TraderFilter } from "@/components/ui-components/TraderFilter";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { useSettingsManager } from "@/hooks/useSettingsManager";
import { useTradersData } from "@/hooks/useTradersData";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function Settings() {
  const {
    settings,
    traderFilter,
    setTraderFilter,
    dateRange,
    setDateRange,
    handleSave,
    handleReset,
    handleThemeChange,
    handleCompactModeChange,
    handleShowWelcomeScreenChange,
    handleDefaultTraderChange,
    handleDefaultSymbolChange,
    handleDefaultQuantityChange,
    handleDefaultOptionTypeChange,
    handleRoiMethodChange,
    handleIncludeFeesChange,
    handleDefaultFeeAmountChange,
    handleUsePercentageInsteadChange,
  } = useSettingsManager();
  
  // Get trades from localStorage to extract unique traders
  const [trades] = useLocalStorage("trades", []);
  const { uniqueTraders } = useTradersData(trades);
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <SettingsHeader 
        onReset={handleReset}
        onSave={handleSave}
      />
      
      {/* Global Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <DateFilter
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <TraderFilter
          traderFilter={traderFilter}
          setTraderFilter={setTraderFilter}
          uniqueTraders={uniqueTraders}
        />
      </div>
      
      <SettingsTabs 
        // Appearance props
        theme={settings.appearance.theme}
        compactMode={settings.appearance.compactMode}
        showWelcomeScreen={settings.appearance.showWelcomeScreen}
        onThemeChange={handleThemeChange}
        onCompactModeChange={handleCompactModeChange}
        onShowWelcomeScreenChange={handleShowWelcomeScreenChange}
        
        // Trading props
        defaultTrader={settings.trading.defaultTrader}
        defaultSymbol={settings.trading.defaultSymbol}
        defaultQuantity={settings.trading.defaultQuantity}
        defaultOptionType={settings.trading.defaultOptionType}
        onDefaultTraderChange={handleDefaultTraderChange}
        onDefaultSymbolChange={handleDefaultSymbolChange}
        onDefaultQuantityChange={handleDefaultQuantityChange}
        onDefaultOptionTypeChange={handleDefaultOptionTypeChange}
        
        // Calculation props
        roiMethod={settings.calculation.roiMethod}
        includeFees={settings.calculation.includeFees}
        defaultFeeAmount={settings.calculation.defaultFeeAmount}
        usePercentageInstead={settings.calculation.usePercentageInstead}
        onRoiMethodChange={handleRoiMethodChange}
        onIncludeFeesChange={handleIncludeFeesChange}
        onDefaultFeeAmountChange={handleDefaultFeeAmountChange}
        onUsePercentageInsteadChange={handleUsePercentageInsteadChange}
      />
    </div>
  );
}
