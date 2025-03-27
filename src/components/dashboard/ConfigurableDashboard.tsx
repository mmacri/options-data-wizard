
import { useState, useEffect } from "react";
import { Grip, X, Settings, PlusCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui-components/Card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/useLocalStorage";

export type WidgetType = 
  | "recentTrades" 
  | "profitLossChart" 
  | "traderPerformance" 
  | "optionTypeAnalysis" 
  | "winLossRatio" 
  | "maxDrawdown"
  | "custom";

export type WidgetConfig = {
  id: string;
  type: WidgetType;
  title: string;
  size: "small" | "medium" | "large";
  active: boolean;
  position: number;
};

export type DashboardConfig = {
  widgets: WidgetConfig[];
};

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: "recent-trades", type: "recentTrades", title: "Recent Trades", size: "large", active: true, position: 0 },
  { id: "profit-loss", type: "profitLossChart", title: "Profit/Loss Chart", size: "medium", active: true, position: 1 },
  { id: "trader-perf", type: "traderPerformance", title: "Trader Performance", size: "medium", active: true, position: 2 },
  { id: "option-analysis", type: "optionTypeAnalysis", title: "Option Type Analysis", size: "medium", active: true, position: 3 },
  { id: "win-loss", type: "winLossRatio", title: "Win/Loss Ratio", size: "small", active: true, position: 4 },
  { id: "max-drawdown", type: "maxDrawdown", title: "Maximum Drawdown", size: "small", active: true, position: 5 }
];

interface ConfigurableDashboardProps {
  renderWidget: (widget: WidgetConfig) => React.ReactNode;
}

export function ConfigurableDashboard({ renderWidget }: ConfigurableDashboardProps) {
  const [settings] = useLocalStorage("userSettings", {
    dashboardWidgets: {
      recentTrades: true,
      profitLossChart: true,
      traderPerformance: true,
      optionTypeAnalysis: true,
      winLossRatio: true,
      maxDrawdown: true,
    }
  });
  
  const { toast } = useToast();
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [dashboardConfig, setDashboardConfig] = useLocalStorage<DashboardConfig>("dashboardConfig", { 
    widgets: DEFAULT_WIDGETS 
  });
  
  useEffect(() => {
    // Apply settings from global settings
    const updatedWidgets = dashboardConfig.widgets.map(widget => ({
      ...widget,
      active: settings.dashboardWidgets[widget.type as keyof typeof settings.dashboardWidgets] ?? widget.active
    }));
    
    setDashboardConfig({
      ...dashboardConfig,
      widgets: updatedWidgets
    });
  }, [settings]);

  const toggleWidgetActive = (id: string) => {
    const updatedWidgets = dashboardConfig.widgets.map(widget => 
      widget.id === id ? { ...widget, active: !widget.active } : widget
    );
    
    setDashboardConfig({
      ...dashboardConfig,
      widgets: updatedWidgets
    });
  };

  const moveWidgetUp = (id: string) => {
    const index = dashboardConfig.widgets.findIndex(w => w.id === id);
    if (index <= 0) return;
    
    const updatedWidgets = [...dashboardConfig.widgets];
    const temp = updatedWidgets[index - 1];
    updatedWidgets[index - 1] = { ...updatedWidgets[index], position: index - 1 };
    updatedWidgets[index] = { ...temp, position: index };
    
    setDashboardConfig({
      ...dashboardConfig,
      widgets: updatedWidgets
    });
  };

  const moveWidgetDown = (id: string) => {
    const index = dashboardConfig.widgets.findIndex(w => w.id === id);
    if (index >= dashboardConfig.widgets.length - 1) return;
    
    const updatedWidgets = [...dashboardConfig.widgets];
    const temp = updatedWidgets[index + 1];
    updatedWidgets[index + 1] = { ...updatedWidgets[index], position: index + 1 };
    updatedWidgets[index] = { ...temp, position: index };
    
    setDashboardConfig({
      ...dashboardConfig,
      widgets: updatedWidgets
    });
  };

  const changeWidgetSize = (id: string, size: "small" | "medium" | "large") => {
    const updatedWidgets = dashboardConfig.widgets.map(widget => 
      widget.id === id ? { ...widget, size } : widget
    );
    
    setDashboardConfig({
      ...dashboardConfig,
      widgets: updatedWidgets
    });
  };

  const saveConfiguration = () => {
    setIsConfiguring(false);
    toast({
      title: "Dashboard saved",
      description: "Your dashboard configuration has been updated."
    });
  };

  const resetConfiguration = () => {
    setDashboardConfig({ widgets: DEFAULT_WIDGETS });
    toast({
      title: "Dashboard reset",
      description: "Your dashboard has been reset to default configuration."
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4 gap-2">
        {isConfiguring ? (
          <>
            <Button variant="outline" onClick={() => setIsConfiguring(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={saveConfiguration}>
              Save Layout
            </Button>
            <Button variant="outline" onClick={resetConfiguration}>
              Reset to Default
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={() => setIsConfiguring(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Configure Dashboard
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardConfig.widgets
          .filter(widget => !isConfiguring || widget.active)
          .sort((a, b) => a.position - b.position)
          .map(widget => (
            <div 
              key={widget.id}
              className={cn(
                "transition-all duration-200",
                widget.size === "small" && "col-span-1",
                widget.size === "medium" && "col-span-1 md:col-span-1 lg:col-span-1",
                widget.size === "large" && "col-span-1 md:col-span-2 lg:col-span-2",
              )}
            >
              {isConfiguring ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Grip className="h-4 w-4 cursor-move text-muted-foreground" />
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Widget Settings</DialogTitle>
                            <DialogDescription>
                              Configure this dashboard widget
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`active-${widget.id}`}>Active</Label>
                              <Switch 
                                id={`active-${widget.id}`} 
                                checked={widget.active}
                                onCheckedChange={() => toggleWidgetActive(widget.id)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Widget Size</Label>
                              <div className="flex gap-2">
                                {["small", "medium", "large"].map((size) => (
                                  <Button 
                                    key={size}
                                    variant={widget.size === size ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => changeWidgetSize(widget.id, size as "small" | "medium" | "large")}
                                  >
                                    {size.charAt(0).toUpperCase() + size.slice(1)}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Position</Label>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => moveWidgetUp(widget.id)}
                                  disabled={widget.position === 0}
                                >
                                  Move Up
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => moveWidgetDown(widget.id)}
                                  disabled={widget.position === dashboardConfig.widgets.length - 1}
                                >
                                  Move Down
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleWidgetActive(widget.id)}>
                        {widget.active ? <X className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="h-40 flex items-center justify-center bg-muted/40 rounded-b-lg">
                    <p className="text-muted-foreground text-sm">
                      {widget.active ? "Widget Enabled" : "Widget Disabled"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                widget.active && renderWidget(widget)
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
