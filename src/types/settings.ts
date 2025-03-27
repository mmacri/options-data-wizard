
import { DateRange } from "react-day-picker";

export type ThemeOption = "light" | "dark" | "system";
export type OptionType = "call" | "put";
export type RoiMethod = "simple" | "annualized" | "realizedOnly";
export type ExportFormat = "csv" | "excel" | "pdf" | "json";

export interface WidgetSettings {
  id: string;
  title: string;
  enabled: boolean;
  position: number;
}

export interface UserSettings {
  appearance: {
    theme: ThemeOption;
    compactMode: boolean;
    showWelcomeScreen: boolean;
  };
  trading: {
    defaultTrader: string;
    defaultSymbol: string;
    defaultQuantity: number;
    defaultOptionType: OptionType;
  };
  calculation: {
    roiMethod: RoiMethod;
    includeFees: boolean;
    defaultFeeAmount: number;
    usePercentageInstead: boolean;
  };
  dateRange: DateRange;
  widgets: WidgetSettings[];
  exportSettings: {
    defaultFormat: ExportFormat;
    includeMetadata: boolean;
    includeCharts: boolean;
    includeSummary: boolean;
  };
}
