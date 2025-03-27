
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { UserSettings, ThemeOption, OptionType, RoiMethod } from "@/types/settings";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_SETTINGS: UserSettings = {
  appearance: {
    theme: "system" as ThemeOption,
    compactMode: false,
    showWelcomeScreen: true,
  },
  trading: {
    defaultTrader: "",
    defaultSymbol: "",
    defaultQuantity: 1,
    defaultOptionType: "call" as OptionType,
  },
  calculation: {
    roiMethod: "simple" as RoiMethod,
    includeFees: true,
    defaultFeeAmount: 0.65,
    usePercentageInstead: false,
  },
  dateRange: {
    from: undefined,
    to: undefined
  } as DateRange,
  widgets: [
    { id: "recent-trades", title: "Recent Trades", enabled: true, position: 0 },
    { id: "profit-loss", title: "Profit/Loss Chart", enabled: true, position: 1 },
    { id: "trader-perf", title: "Trader Performance", enabled: true, position: 2 },
    { id: "option-analysis", title: "Option Type Analysis", enabled: true, position: 3 },
    { id: "win-loss", title: "Win/Loss Ratio", enabled: true, position: 4 },
    { id: "max-drawdown", title: "Maximum Drawdown", enabled: true, position: 5 },
  ],
  exportSettings: {
    defaultFormat: "csv",
    includeMetadata: true,
    includeCharts: false,
    includeSummary: true,
  },
};

export const useSettingsManager = () => {
  const [settings, setSettings] = useLocalStorage<UserSettings>("userSettings", DEFAULT_SETTINGS);
  const [traderFilter, setTraderFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(settings.dateRange);
  const { toast } = useToast();
  
  // Update settings when dateRange changes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      dateRange: dateRange || { from: undefined, to: undefined } as DateRange,
    }));
  }, [dateRange, setSettings]);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };
  
  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setDateRange(DEFAULT_SETTINGS.dateRange);
    setTraderFilter("all");
    toast({
      title: "Settings reset",
      description: "Your preferences have been reset to defaults.",
    });
  };

  // Appearance settings handlers
  const handleThemeChange = (theme: ThemeOption) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme: theme,
      },
    }));
  };
  
  const handleCompactModeChange = (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        compactMode: checked,
      },
    }));
  };
  
  const handleShowWelcomeScreenChange = (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        showWelcomeScreen: checked,
      },
    }));
  };
  
  // Trading settings handlers
  const handleDefaultTraderChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      trading: {
        ...prev.trading,
        defaultTrader: value,
      },
    }));
  };
  
  const handleDefaultSymbolChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      trading: {
        ...prev.trading,
        defaultSymbol: value,
      },
    }));
  };
  
  const handleDefaultQuantityChange = (value: number) => {
    setSettings(prev => ({
      ...prev,
      trading: {
        ...prev.trading,
        defaultQuantity: value,
      },
    }));
  };
  
  const handleDefaultOptionTypeChange = (value: OptionType) => {
    setSettings(prev => ({
      ...prev,
      trading: {
        ...prev.trading,
        defaultOptionType: value,
      },
    }));
  };
  
  // Calculation settings handlers
  const handleRoiMethodChange = (value: RoiMethod) => {
    setSettings(prev => ({
      ...prev,
      calculation: {
        ...prev.calculation,
        roiMethod: value,
      },
    }));
  };
  
  const handleIncludeFeesChange = (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      calculation: {
        ...prev.calculation,
        includeFees: checked,
      },
    }));
  };
  
  const handleDefaultFeeAmountChange = (value: number) => {
    setSettings(prev => ({
      ...prev,
      calculation: {
        ...prev.calculation,
        defaultFeeAmount: value,
      },
    }));
  };
  
  const handleUsePercentageInsteadChange = (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      calculation: {
        ...prev.calculation,
        usePercentageInstead: checked,
      },
    }));
  };
  
  return {
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
  };
};
