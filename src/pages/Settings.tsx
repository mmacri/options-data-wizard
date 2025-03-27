import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui-components/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { TraderFilter } from "@/components/ui-components/TraderFilter";
import { DateFilter } from "@/components/ui-components/DateFilter";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import useLocalStorage from "@/hooks/useLocalStorage";
import { DateRangeSelector } from "@/components/ui-components/DateRangeSelector";
import { ThemeOption, ExportFormat, OptionType, RoiMethod, UserSettings } from "@/types/settings";
import { getUniqueTraders } from "@/components/ui-components/DataTableTypes";
import { useTradersData } from "@/hooks/useTradersData";

const DEFAULT_SETTINGS: UserSettings = {
  appearance: {
    theme: "system" as ThemeOption,
    compactMode: false,
    showWelcomeScreen: true,
  },
  trading: {
    defaultTrader: "",
    defaultSymbol: "SPY",
    defaultQuantity: 1,
    defaultOptionType: "call" as OptionType,
  },
  calculation: {
    roiMethod: "simple" as RoiMethod,
    includeFees: true,
    defaultFeeAmount: 0.65,
    usePercentageInstead: false,
  },
  dateRange: {},
  widgets: [
    { id: "recent-trades", title: "Recent Trades", enabled: true, position: 0 },
    { id: "profit-loss", title: "Profit/Loss Chart", enabled: true, position: 1 },
    { id: "trader-perf", title: "Trader Performance", enabled: true, position: 2 },
    { id: "option-analysis", title: "Option Type Analysis", enabled: true, position: 3 },
    { id: "win-loss", title: "Win/Loss Ratio", enabled: true, position: 4 },
    { id: "max-drawdown", title: "Maximum Drawdown", enabled: true, position: 5 },
  ],
  exportSettings: {
    defaultFormat: "csv" as ExportFormat,
    includeMetadata: true,
    includeCharts: false,
    includeSummary: true,
  },
};

export default function Settings() {
  const [settings, setSettings] = useLocalStorage<UserSettings>("userSettings", DEFAULT_SETTINGS);
  const [traderFilter, setTraderFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(settings.dateRange);
  
  const { toast } = useToast();
  
  // Get trades from localStorage to extract unique traders
  const [trades] = useLocalStorage("trades", []);
  const { uniqueTraders } = useTradersData(trades);
  
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };
  
  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    toast({
      title: "Settings reset",
      description: "Your preferences have been reset to defaults.",
    });
  };
  
  // Update settings when dateRange changes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      dateRange: dateRange || {},
    }));
  }, [dateRange, setSettings]);
  
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
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light">Settings</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
      
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
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your application.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.appearance.theme}
                  onValueChange={(value) => handleThemeChange(value as ThemeOption)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="space-y-1 leading-none">
                  <Label htmlFor="compact-mode">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">Display data in a denser layout.</p>
                </div>
                <Switch 
                  id="compact-mode" 
                  checked={settings.appearance.compactMode}
                  onCheckedChange={handleCompactModeChange}
                />
              </div>
              
              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="space-y-1 leading-none">
                  <Label htmlFor="show-welcome-screen">Show Welcome Screen</Label>
                  <p className="text-sm text-muted-foreground">Display the welcome screen on first launch.</p>
                </div>
                <Switch 
                  id="show-welcome-screen"
                  checked={settings.appearance.showWelcomeScreen}
                  onCheckedChange={handleShowWelcomeScreenChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trading" className="mt-4">
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
                  value={settings.trading.defaultTrader}
                  onChange={(e) => handleDefaultTraderChange(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-symbol">Default Symbol</Label>
                <Input 
                  id="default-symbol" 
                  placeholder="Symbol (e.g., SPY)" 
                  value={settings.trading.defaultSymbol}
                  onChange={(e) => handleDefaultSymbolChange(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-quantity">Default Quantity</Label>
                <Input 
                  id="default-quantity" 
                  type="number"
                  placeholder="Quantity" 
                  value={settings.trading.defaultQuantity}
                  onChange={(e) => handleDefaultQuantityChange(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-option-type">Default Option Type</Label>
                <Select
                  value={settings.trading.defaultOptionType}
                  onValueChange={(value) => handleDefaultOptionTypeChange(value as OptionType)}
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
        </TabsContent>
        
        <TabsContent value="calculation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Calculation Settings</CardTitle>
              <CardDescription>Configure how profit and loss are calculated.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="roi-method">ROI Method</Label>
                <Select
                  value={settings.calculation.roiMethod}
                  onValueChange={(value) => handleRoiMethodChange(value as RoiMethod)}
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
                  checked={settings.calculation.includeFees}
                  onCheckedChange={handleIncludeFeesChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-fee-amount">Default Fee Amount</Label>
                <Input 
                  id="default-fee-amount" 
                  type="number"
                  placeholder="Fee Amount" 
                  value={settings.calculation.defaultFeeAmount}
                  onChange={(e) => handleDefaultFeeAmountChange(Number(e.target.value))}
                />
              </div>
              
              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="space-y-1 leading-none">
                  <Label htmlFor="use-percentage-instead">Use Percentage Instead</Label>
                  <p className="text-sm text-muted-foreground">Use percentage instead of fixed amount for fees.</p>
                </div>
                <Switch 
                  id="use-percentage-instead"
                  checked={settings.calculation.usePercentageInstead}
                  onCheckedChange={handleUsePercentageInsteadChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Settings</CardTitle>
              <CardDescription>Customize your export preferences.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {/* Export settings content here */}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="widgets" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Widget Settings</CardTitle>
              <CardDescription>Manage your dashboard widgets.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {/* Widget settings content here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
