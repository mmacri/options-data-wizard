
import { useState, useEffect } from "react";
import { Calendar, Settings as SettingsIcon, Calculator, PieChart, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/useLocalStorage";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { UserSettings, ThemeOption, OptionType, RoiMethod } from "@/types/settings";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Default settings
const defaultDateRange: DateRange = {
  from: new Date(new Date().getFullYear(), 0, 1), // Jan 1st of current year
  to: new Date(),
};

const defaultWidgets = [
  { id: "summary-stats", title: "Summary Statistics", enabled: true, position: 0 },
  { id: "profit-loss-chart", title: "Profit/Loss Chart", enabled: true, position: 1 },
  { id: "trade-status", title: "Trade Status", enabled: true, position: 2 },
  { id: "recent-trades", title: "Recent Trades", enabled: true, position: 3 },
  { id: "trader-performance", title: "Trader Performance", enabled: false, position: 4 },
  { id: "option-performance", title: "Option Type Performance", enabled: false, position: 5 },
];

const defaultUserSettings: UserSettings = {
  appearance: {
    theme: "system",
    compactMode: false,
    showWelcomeScreen: true,
  },
  trading: {
    defaultTrader: "",
    defaultSymbol: "",
    defaultQuantity: 1,
    defaultOptionType: "call",
  },
  calculation: {
    roiMethod: "simple",
    includeFees: true,
    defaultFeeAmount: 0.65,
    usePercentageInstead: false,
  },
  dateRange: defaultDateRange,
  widgets: defaultWidgets,
  exportSettings: {
    defaultFormat: "csv",
    includeMetadata: true,
    includeCharts: false,
    includeSummary: true,
  },
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useLocalStorage<UserSettings>("userSettings", defaultUserSettings);
  
  // Local state to track changes before saving
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ 
    from: settings.dateRange?.from || defaultDateRange.from,
    to: settings.dateRange?.to || defaultDateRange.to
  });

  // Update local settings when the stored settings change
  useEffect(() => {
    setLocalSettings(settings);
    setDateRange({ 
      from: settings.dateRange?.from || defaultDateRange.from,
      to: settings.dateRange?.to || defaultDateRange.to
    });
  }, [settings]);

  const handleSaveSettings = () => {
    // Update with confirmed date range
    const updatedSettings = {
      ...localSettings,
      dateRange: {
        from: dateRange?.from || defaultDateRange.from,
        to: dateRange?.to || defaultDateRange.to
      }
    };
    
    setSettings(updatedSettings);
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated."
    });
  };

  const handleResetSettings = () => {
    setLocalSettings(defaultUserSettings);
    setDateRange({ 
      from: defaultDateRange.from,
      to: defaultDateRange.to
    });
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to defaults."
    });
  };

  // Update a specific widget's settings
  const updateWidget = (id: string, property: 'enabled' | 'position', value: boolean | number) => {
    setLocalSettings(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget => 
        widget.id === id ? { ...widget, [property]: value } : widget
      )
    }));
  };

  const moveWidgetUp = (index: number) => {
    if (index <= 0) return;
    
    const newWidgets = [...localSettings.widgets];
    const currentPosition = newWidgets[index].position;
    const abovePosition = newWidgets[index - 1].position;
    
    newWidgets[index].position = abovePosition;
    newWidgets[index - 1].position = currentPosition;
    
    // Sort by position
    newWidgets.sort((a, b) => a.position - b.position);
    
    setLocalSettings(prev => ({
      ...prev,
      widgets: newWidgets
    }));
  };

  const moveWidgetDown = (index: number) => {
    if (index >= localSettings.widgets.length - 1) return;
    
    const newWidgets = [...localSettings.widgets];
    const currentPosition = newWidgets[index].position;
    const belowPosition = newWidgets[index + 1].position;
    
    newWidgets[index].position = belowPosition;
    newWidgets[index + 1].position = currentPosition;
    
    // Sort by position
    newWidgets.sort((a, b) => a.position - b.position);
    
    setLocalSettings(prev => ({
      ...prev,
      widgets: newWidgets
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light">Settings</h1>
      </div>
      
      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="trading" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Trading</span>
          </TabsTrigger>
          <TabsTrigger value="calculation" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculation</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="date-range" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Date Range</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the application looks and behaves.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Theme</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose the theme for the application.
                  </p>
                </div>
                <RadioGroup
                  value={localSettings.appearance.theme}
                  onValueChange={(value: ThemeOption) => 
                    setLocalSettings(prev => ({
                      ...prev, 
                      appearance: { 
                        ...prev.appearance, 
                        theme: value
                      }
                    }))
                  }
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="light" id="light" className="peer sr-only" />
                    <Label
                      htmlFor="light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span>Light</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                    <Label
                      htmlFor="dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span>Dark</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="system" id="system" className="peer sr-only" />
                    <Label
                      htmlFor="system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span>System</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Compact Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      Use a more compact layout with less spacing.
                    </p>
                  </div>
                  <Switch 
                    checked={localSettings.appearance.compactMode}
                    onCheckedChange={(checked) => 
                      setLocalSettings(prev => ({
                        ...prev, 
                        appearance: { 
                          ...prev.appearance, 
                          compactMode: checked 
                        }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Welcome Screen</h3>
                    <p className="text-sm text-muted-foreground">
                      Show welcome screen and tips on startup.
                    </p>
                  </div>
                  <Switch 
                    checked={localSettings.appearance.showWelcomeScreen}
                    onCheckedChange={(checked) => 
                      setLocalSettings(prev => ({
                        ...prev, 
                        appearance: { 
                          ...prev.appearance, 
                          showWelcomeScreen: checked 
                        }
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Trading Settings */}
        <TabsContent value="trading">
          <Card>
            <CardHeader>
              <CardTitle>Trading Settings</CardTitle>
              <CardDescription>
                Configure default values for new trades.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="default-trader">Default Trader</Label>
                  <Input 
                    id="default-trader" 
                    value={localSettings.trading.defaultTrader}
                    onChange={(e) => 
                      setLocalSettings(prev => ({
                        ...prev, 
                        trading: { 
                          ...prev.trading, 
                          defaultTrader: e.target.value 
                        }
                      }))
                    }
                    placeholder="Enter default trader name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-symbol">Default Symbol</Label>
                  <Input 
                    id="default-symbol" 
                    value={localSettings.trading.defaultSymbol}
                    onChange={(e) => 
                      setLocalSettings(prev => ({
                        ...prev, 
                        trading: { 
                          ...prev.trading, 
                          defaultSymbol: e.target.value 
                        }
                      }))
                    }
                    placeholder="e.g., AAPL"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-quantity">Default Quantity</Label>
                  <Input 
                    id="default-quantity" 
                    type="number"
                    min="1"
                    value={localSettings.trading.defaultQuantity}
                    onChange={(e) => 
                      setLocalSettings(prev => ({
                        ...prev, 
                        trading: { 
                          ...prev.trading, 
                          defaultQuantity: parseInt(e.target.value) || 1
                        }
                      }))
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Default Option Type</Label>
                  <RadioGroup
                    value={localSettings.trading.defaultOptionType}
                    onValueChange={(value: OptionType) => 
                      setLocalSettings(prev => ({
                        ...prev, 
                        trading: { 
                          ...prev.trading, 
                          defaultOptionType: value
                        }
                      }))
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="call" id="call" />
                      <Label htmlFor="call">Call</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="put" id="put" />
                      <Label htmlFor="put">Put</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Calculation Settings */}
        <TabsContent value="calculation">
          <Card>
            <CardHeader>
              <CardTitle>Calculation Settings</CardTitle>
              <CardDescription>
                Configure how trade performance metrics are calculated.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">ROI Calculation Method</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose how Return on Investment (ROI) is calculated.
                  </p>
                </div>
                <RadioGroup
                  value={localSettings.calculation.roiMethod}
                  onValueChange={(value: RoiMethod) => 
                    setLocalSettings(prev => ({
                      ...prev, 
                      calculation: { 
                        ...prev.calculation, 
                        roiMethod: value
                      }
                    }))
                  }
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="simple" id="simple" className="peer sr-only" />
                    <Label
                      htmlFor="simple"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="font-medium">Simple</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        (Profit / Initial Investment) × 100
                      </span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="annualized" id="annualized" className="peer sr-only" />
                    <Label
                      htmlFor="annualized"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="font-medium">Annualized</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Simple ROI × (365 / Days Held)
                      </span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="realizedOnly" id="realizedOnly" className="peer sr-only" />
                    <Label
                      htmlFor="realizedOnly"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="font-medium">Realized Only</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Only closed trades count
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Include Fees</h3>
                    <p className="text-sm text-muted-foreground">
                      Include trading fees in P/L calculations.
                    </p>
                  </div>
                  <Switch 
                    checked={localSettings.calculation.includeFees}
                    onCheckedChange={(checked) => 
                      setLocalSettings(prev => ({
                        ...prev, 
                        calculation: { 
                          ...prev.calculation, 
                          includeFees: checked 
                        }
                      }))
                    }
                  />
                </div>
                
                {localSettings.calculation.includeFees && (
                  <div className="space-y-2">
                    <Label htmlFor="fee-amount">Fee Amount ($)</Label>
                    <Input 
                      id="fee-amount" 
                      type="number"
                      step="0.01"
                      min="0"
                      value={localSettings.calculation.defaultFeeAmount}
                      onChange={(e) => 
                        setLocalSettings(prev => ({
                          ...prev, 
                          calculation: { 
                            ...prev.calculation, 
                            defaultFeeAmount: parseFloat(e.target.value) || 0
                          }
                        }))
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Fee amount per trade (e.g., $0.65 per contract)
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Use Percentages</h3>
                    <p className="text-sm text-muted-foreground">
                      Display P/L as percentages instead of dollar amounts.
                    </p>
                  </div>
                  <Switch 
                    checked={localSettings.calculation.usePercentageInstead}
                    onCheckedChange={(checked) => 
                      setLocalSettings(prev => ({
                        ...prev, 
                        calculation: { 
                          ...prev.calculation, 
                          usePercentageInstead: checked 
                        }
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Dashboard Settings */}
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Widgets</CardTitle>
              <CardDescription>
                Configure which widgets appear on your dashboard and their order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {localSettings.widgets.sort((a, b) => a.position - b.position).map((widget, index) => (
                  <div key={widget.id} className="flex items-center p-3 border rounded-md">
                    <div className="flex-1">
                      <div className="font-medium">{widget.title}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => moveWidgetUp(index)}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => moveWidgetDown(index)}
                          disabled={index === localSettings.widgets.length - 1}
                        >
                          ↓
                        </Button>
                      </div>
                      <Switch 
                        checked={widget.enabled}
                        onCheckedChange={(checked) => updateWidget(widget.id, 'enabled', checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Date Range Settings */}
        <TabsContent value="date-range">
          <Card>
            <CardHeader>
              <CardTitle>Default Date Range</CardTitle>
              <CardDescription>
                Set the default date range for filtering trades and reports.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={(range) => {
                            if (range?.from) {
                              setDateRange({
                                from: range.from, 
                                to: range.to || range.from
                              });
                            } else {
                              setDateRange(undefined);
                            }
                          }}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    This date range will be used as default for filtering trades in tables and reports.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-4 mt-8">
        <Button variant="outline" onClick={handleResetSettings}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}
