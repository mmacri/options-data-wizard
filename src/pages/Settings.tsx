
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui-components/Card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/useThemeMode";
import { useToast } from "@/hooks/use-toast";
import { Sliders, UserCircle, Palette, Database, Bell, Calculator, FileSpreadsheet } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Trade } from "@/components/ui-components/DataTableTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type CalculationMethod = "simple" | "compound" | "weighted";
type DefaultDateRange = "7days" | "30days" | "90days" | "180days" | "1year" | "all";
type ChartType = "line" | "bar" | "pie" | "area";
type ExportFormat = "csv" | "excel" | "pdf" | "json";

type UserSettings = {
  defaultTrader: string;
  notifications: {
    tradeUpdates: boolean;
    profitAlerts: boolean;
    lossAlerts: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
  };
  display: {
    showTotalInvested: boolean;
    showROI: boolean;
    darkCharts: boolean;
    compactView: boolean;
    defaultChartType: ChartType;
  };
  calculations: {
    roiMethod: CalculationMethod;
    pnlMethod: CalculationMethod;
    includeFees: boolean;
    includeTaxes: boolean;
    defaultRiskFreeRate: number;
  };
  defaultView: string;
  defaultDateRange: DefaultDateRange;
  exportSettings: {
    defaultFormat: ExportFormat;
    includeMetadata: boolean;
    includeCharts: boolean;
    includeSummary: boolean;
  };
  dashboardWidgets: {
    recentTrades: boolean;
    profitLossChart: boolean;
    traderPerformance: boolean;
    optionTypeAnalysis: boolean;
    winLossRatio: boolean;
    maxDrawdown: boolean;
  };
};

const defaultSettings: UserSettings = {
  defaultTrader: "",
  notifications: {
    tradeUpdates: true,
    profitAlerts: true,
    lossAlerts: true,
    weeklyReports: false,
    monthlyReports: true,
  },
  display: {
    showTotalInvested: true,
    showROI: true,
    darkCharts: false,
    compactView: false,
    defaultChartType: "line",
  },
  calculations: {
    roiMethod: "simple",
    pnlMethod: "simple",
    includeFees: true,
    includeTaxes: false,
    defaultRiskFreeRate: 4.0,
  },
  defaultView: "dashboard",
  defaultDateRange: "30days",
  exportSettings: {
    defaultFormat: "csv",
    includeMetadata: true,
    includeCharts: false,
    includeSummary: true,
  },
  dashboardWidgets: {
    recentTrades: true,
    profitLossChart: true,
    traderPerformance: true,
    optionTypeAnalysis: true,
    winLossRatio: true,
    maxDrawdown: true,
  }
};

export default function Settings() {
  const [settings, setSettings] = useLocalStorage<UserSettings>("userSettings", defaultSettings);
  const [trades] = useLocalStorage<Trade[]>("trades", []);
  const [newTrader, setNewTrader] = useState("");
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  const uniqueTraders = Array.from(new Set(trades.map(trade => trade.traderName || "Unknown")));
  
  const handleSaveSettings = () => {
    setSettings({...settings});
    toast({
      title: "Settings saved",
      description: "Your settings have been updated.",
    });
  };
  
  const handleAddTrader = () => {
    if (!newTrader.trim()) {
      toast({
        title: "Error",
        description: "Trader name cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    
    if (uniqueTraders.includes(newTrader)) {
      toast({
        title: "Error",
        description: "This trader already exists.",
        variant: "destructive",
      });
      return;
    }
    
    // Create a demo trade for the new trader
    const demoTrade: Trade = {
      id: crypto.randomUUID(),
      tradeId: `T${Math.floor(Math.random() * 10000)}`,
      underlyingSymbol: "DEMO",
      optionType: "Call",
      entryDate: new Date().toISOString().split('T')[0],
      entryPrice: 10,
      quantity: 1,
      totalPremium: 10,
      profitLoss: 0,
      status: "Pending",
      traderName: newTrader,
      notes: "Demo trade for new trader",
      totalInvested: 10,
      roi: 0
    };
    
    // Update the trades array in local storage
    const updatedTrades = [...trades, demoTrade];
    localStorage.setItem("trades", JSON.stringify(updatedTrades));
    
    setNewTrader("");
    toast({
      title: "Trader added",
      description: `${newTrader} has been added as a new trader.`,
    });
  };
  
  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.removeItem("trades");
      localStorage.removeItem("tradeSummary");
      localStorage.removeItem("openPositions");
      localStorage.removeItem("performanceMetrics");
      toast({
        title: "Data cleared",
        description: "All trade data has been cleared.",
      });
      // Reload the page to reflect the changes
      window.location.reload();
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-light mb-8">Settings</h1>
      
      <Tabs defaultValue="general" className="mb-8">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger 
            value="general" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <Sliders className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger 
            value="traders" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <UserCircle className="h-4 w-4 mr-2" />
            Traders
          </TabsTrigger>
          <TabsTrigger 
            value="appearance" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger 
            value="calculations" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculations
          </TabsTrigger>
          <TabsTrigger 
            value="exports" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Exports
          </TabsTrigger>
          <TabsTrigger 
            value="data" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <Database className="h-4 w-4 mr-2" />
            Data Management
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4">
          <Card glass>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultTrader">Default Trader</Label>
                  <select
                    id="defaultTrader"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={settings.defaultTrader}
                    onChange={(e) => setSettings({...settings, defaultTrader: e.target.value})}
                  >
                    <option value="">Select a default trader</option>
                    {uniqueTraders.map(trader => (
                      <option key={trader} value={trader}>{trader}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultView">Default View</Label>
                  <select
                    id="defaultView"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={settings.defaultView}
                    onChange={(e) => setSettings({...settings, defaultView: e.target.value})}
                  >
                    <option value="dashboard">Dashboard</option>
                    <option value="trade-manager">Trade Manager</option>
                    <option value="reporting">Reporting</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultDateRange">Default Date Range</Label>
                  <select
                    id="defaultDateRange"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={settings.defaultDateRange}
                    onChange={(e) => setSettings({
                      ...settings, 
                      defaultDateRange: e.target.value as DefaultDateRange
                    })}
                  >
                    <option value="7days">Last 7 days</option>
                    <option value="30days">Last 30 days</option>
                    <option value="90days">Last 90 days</option>
                    <option value="180days">Last 180 days</option>
                    <option value="1year">Last year</option>
                    <option value="all">All time</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label>Custom Date Range</Label>
                  <div className="flex flex-col space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateRange && "text-muted-foreground"
                          )}
                        >
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Select date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="traders" className="mt-4">
          <Card glass>
            <CardHeader>
              <CardTitle>Trader Management</CardTitle>
              <CardDescription>Add or view traders in the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter new trader name" 
                  value={newTrader}
                  onChange={(e) => setNewTrader(e.target.value)}
                />
                <Button onClick={handleAddTrader}>Add Trader</Button>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">Current Traders</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {uniqueTraders.map(trader => (
                    <div key={trader} className="p-3 rounded-md border bg-card">
                      <div className="flex items-center">
                        <UserCircle className="h-5 w-5 mr-2 text-primary" />
                        <span>{trader}</span>
                      </div>
                    </div>
                  ))}
                  {uniqueTraders.length === 0 && (
                    <p className="text-muted-foreground">No traders found. Add a trader to get started.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-4">
          <Card glass>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="theme">Theme</Label>
                    <p className="text-sm text-muted-foreground">Select the application theme</p>
                  </div>
                  <select
                    id="theme"
                    className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="chartType">Default Chart Type</Label>
                    <p className="text-sm text-muted-foreground">Select the default chart visualization</p>
                  </div>
                  <select
                    id="chartType"
                    className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={settings.display.defaultChartType}
                    onChange={(e) => setSettings({
                      ...settings, 
                      display: {
                        ...settings.display, 
                        defaultChartType: e.target.value as ChartType
                      }
                    })}
                  >
                    <option value="line">Line Chart</option>
                    <option value="bar">Bar Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="area">Area Chart</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="darkCharts">Dark Mode Charts</Label>
                    <p className="text-sm text-muted-foreground">Use dark colors for charts</p>
                  </div>
                  <Switch
                    id="darkCharts"
                    checked={settings.display.darkCharts}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        display: {...settings.display, darkCharts: checked}
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compactView">Compact View</Label>
                    <p className="text-sm text-muted-foreground">Use a more compact UI layout</p>
                  </div>
                  <Switch
                    id="compactView"
                    checked={settings.display.compactView}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        display: {...settings.display, compactView: checked}
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showTotalInvested">Show Total Invested</Label>
                    <p className="text-sm text-muted-foreground">Display total invested amount in reports</p>
                  </div>
                  <Switch
                    id="showTotalInvested"
                    checked={settings.display.showTotalInvested}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        display: {...settings.display, showTotalInvested: checked}
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showROI">Show ROI</Label>
                    <p className="text-sm text-muted-foreground">Display ROI in reports and tables</p>
                  </div>
                  <Switch
                    id="showROI"
                    checked={settings.display.showROI}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        display: {...settings.display, showROI: checked}
                      })
                    }
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculations" className="mt-4">
          <Card glass>
            <CardHeader>
              <CardTitle>Calculation Settings</CardTitle>
              <CardDescription>Customize how trade metrics are calculated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="roiMethod">ROI Calculation Method</Label>
                    <Select
                      value={settings.calculations.roiMethod}
                      onValueChange={(value) => setSettings({
                        ...settings,
                        calculations: {
                          ...settings.calculations,
                          roiMethod: value as CalculationMethod
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ROI method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple (P/L ÷ Investment)</SelectItem>
                        <SelectItem value="compound">Compound (Includes reinvestment)</SelectItem>
                        <SelectItem value="weighted">Time-Weighted</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground pt-1">
                      {settings.calculations.roiMethod === "simple" && "Simple ROI divides profit by initial investment"}
                      {settings.calculations.roiMethod === "compound" && "Compound ROI accounts for reinvested profits"}
                      {settings.calculations.roiMethod === "weighted" && "Time-weighted ROI accounts for the duration of investments"}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pnlMethod">P/L Calculation Method</Label>
                    <Select
                      value={settings.calculations.pnlMethod}
                      onValueChange={(value) => setSettings({
                        ...settings,
                        calculations: {
                          ...settings.calculations,
                          pnlMethod: value as CalculationMethod
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select P/L method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Absolute (Exit - Entry)</SelectItem>
                        <SelectItem value="compound">Percentage Based</SelectItem>
                        <SelectItem value="weighted">Risk-Adjusted</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground pt-1">
                      {settings.calculations.pnlMethod === "simple" && "Absolute P/L is the direct difference between exit and entry prices"}
                      {settings.calculations.pnlMethod === "compound" && "Percentage based P/L is relative to investment size"}
                      {settings.calculations.pnlMethod === "weighted" && "Risk-adjusted P/L factors in volatility and risk metrics"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riskFreeRate">Risk-Free Rate (%) for Risk-Adjusted Calculations</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="riskFreeRate"
                      min={0}
                      max={10}
                      step={0.25}
                      value={[settings.calculations.defaultRiskFreeRate]}
                      onValueChange={(values) => setSettings({
                        ...settings,
                        calculations: {
                          ...settings.calculations,
                          defaultRiskFreeRate: values[0]
                        }
                      })}
                      className="flex-1"
                    />
                    <span className="w-12 text-center font-medium">
                      {settings.calculations.defaultRiskFreeRate.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Used for Sharpe ratio and other risk-adjusted performance metrics</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="includeFees">Include Fees in Calculations</Label>
                    <p className="text-sm text-muted-foreground">Factor trading fees into P/L calculations</p>
                  </div>
                  <Switch
                    id="includeFees"
                    checked={settings.calculations.includeFees}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        calculations: {...settings.calculations, includeFees: checked}
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="includeTaxes">Include Estimated Taxes</Label>
                    <p className="text-sm text-muted-foreground">Factor estimated taxes into net profit calculations</p>
                  </div>
                  <Switch
                    id="includeTaxes"
                    checked={settings.calculations.includeTaxes}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        calculations: {...settings.calculations, includeTaxes: checked}
                      })
                    }
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="mt-4">
          <Card glass>
            <CardHeader>
              <CardTitle>Export Settings</CardTitle>
              <CardDescription>Configure export formats and options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultFormat">Default Export Format</Label>
                  <Select
                    value={settings.exportSettings.defaultFormat}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      exportSettings: {
                        ...settings.exportSettings,
                        defaultFormat: value as ExportFormat
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select export format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="includeMetadata">Include Metadata</Label>
                    <p className="text-sm text-muted-foreground">Add timestamp, user, and export date to exports</p>
                  </div>
                  <Switch
                    id="includeMetadata"
                    checked={settings.exportSettings.includeMetadata}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        exportSettings: {...settings.exportSettings, includeMetadata: checked}
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="includeCharts">Include Charts</Label>
                    <p className="text-sm text-muted-foreground">Add visualizations to PDF and Excel exports</p>
                  </div>
                  <Switch
                    id="includeCharts"
                    checked={settings.exportSettings.includeCharts}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        exportSettings: {...settings.exportSettings, includeCharts: checked}
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="includeSummary">Include Summary</Label>
                    <p className="text-sm text-muted-foreground">Add performance summary to exports</p>
                  </div>
                  <Switch
                    id="includeSummary"
                    checked={settings.exportSettings.includeSummary}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        exportSettings: {...settings.exportSettings, includeSummary: checked}
                      })
                    }
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="mt-4">
          <Card glass>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your trade data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Data Operations</h3>
                <p className="text-sm text-muted-foreground">Be careful with these operations as they can't be undone.</p>
              </div>
              
              <div className="pt-4 space-y-2">
                <Button 
                  variant="destructive" 
                  onClick={handleClearData}
                >
                  Clear All Data
                </Button>
                <p className="text-xs text-muted-foreground">This will permanently delete all your trade data and cannot be undone.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4">
          <Card glass>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="tradeUpdates">Trade Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified when trades are updated</p>
                  </div>
                  <Switch
                    id="tradeUpdates"
                    checked={settings.notifications.tradeUpdates}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, tradeUpdates: checked}
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="profitAlerts">Profit Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified about profitable trades</p>
                  </div>
                  <Switch
                    id="profitAlerts"
                    checked={settings.notifications.profitAlerts}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, profitAlerts: checked}
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="lossAlerts">Loss Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified about losing trades</p>
                  </div>
                  <Switch
                    id="lossAlerts"
                    checked={settings.notifications.lossAlerts}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, lossAlerts: checked}
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weeklyReports">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
                  </div>
                  <Switch
                    id="weeklyReports"
                    checked={settings.notifications.weeklyReports}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, weeklyReports: checked}
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="monthlyReports">Monthly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive monthly performance summaries</p>
                  </div>
                  <Switch
                    id="monthlyReports"
                    checked={settings.notifications.monthlyReports}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, monthlyReports: checked}
                      })
                    }
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
