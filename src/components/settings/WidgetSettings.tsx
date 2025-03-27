
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui-components/Card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, RotateCcw } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

export function WidgetSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useLocalStorage("userSettings", {
    widgets: [
      { id: "recent-trades", title: "Recent Trades", enabled: true, position: 0 },
      { id: "profit-loss", title: "Profit/Loss Chart", enabled: true, position: 1 },
      { id: "trader-perf", title: "Trader Performance", enabled: true, position: 2 },
      { id: "option-analysis", title: "Option Type Analysis", enabled: true, position: 3 },
      { id: "win-loss", title: "Win/Loss Ratio", enabled: true, position: 4 },
      { id: "max-drawdown", title: "Maximum Drawdown", enabled: true, position: 5 },
    ]
  });

  const [widgets, setWidgets] = useState(settings.widgets || []);

  // Save widget settings to localStorage
  const saveWidgetSettings = () => {
    setSettings(prev => ({
      ...prev,
      widgets: widgets.map((widget, index) => ({
        ...widget,
        position: index
      }))
    }));
    
    toast({
      title: "Widget settings saved",
      description: "Your dashboard widgets have been updated."
    });
  };

  // Reset widget settings to defaults
  const resetWidgetSettings = () => {
    const defaultWidgets = [
      { id: "recent-trades", title: "Recent Trades", enabled: true, position: 0 },
      { id: "profit-loss", title: "Profit/Loss Chart", enabled: true, position: 1 },
      { id: "trader-perf", title: "Trader Performance", enabled: true, position: 2 },
      { id: "option-analysis", title: "Option Type Analysis", enabled: true, position: 3 },
      { id: "win-loss", title: "Win/Loss Ratio", enabled: true, position: 4 },
      { id: "max-drawdown", title: "Maximum Drawdown", enabled: true, position: 5 },
    ];
    
    setWidgets(defaultWidgets);
    
    toast({
      title: "Widget settings reset",
      description: "Your dashboard widgets have been reset to defaults."
    });
  };

  // Toggle widget enabled state
  const toggleWidgetEnabled = (index: number) => {
    const updatedWidgets = [...widgets];
    updatedWidgets[index].enabled = !updatedWidgets[index].enabled;
    setWidgets(updatedWidgets);
  };

  // Move widget up in the order
  const moveWidgetUp = (index: number) => {
    if (index === 0) return;
    const updatedWidgets = [...widgets];
    const temp = updatedWidgets[index];
    updatedWidgets[index] = updatedWidgets[index - 1];
    updatedWidgets[index - 1] = temp;
    setWidgets(updatedWidgets);
  };

  // Move widget down in the order
  const moveWidgetDown = (index: number) => {
    if (index === widgets.length - 1) return;
    const updatedWidgets = [...widgets];
    const temp = updatedWidgets[index];
    updatedWidgets[index] = updatedWidgets[index + 1];
    updatedWidgets[index + 1] = temp;
    setWidgets(updatedWidgets);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Widget Settings</CardTitle>
        <CardDescription>Manage your dashboard widgets.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="space-y-4">
          {widgets.map((widget, index) => (
            <div 
              key={widget.id} 
              className="flex items-center justify-between p-3 border rounded-md bg-background"
            >
              <div className="flex items-center">
                <Switch
                  id={`widget-${widget.id}`}
                  checked={widget.enabled}
                  onCheckedChange={() => toggleWidgetEnabled(index)}
                  className="mr-3"
                />
                <Label htmlFor={`widget-${widget.id}`}>
                  {widget.title}
                </Label>
              </div>
              
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => moveWidgetUp(index)}
                  disabled={index === 0}
                  className="h-8 w-8"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => moveWidgetDown(index)}
                  disabled={index === widgets.length - 1}
                  className="h-8 w-8"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={resetWidgetSettings}
            className="flex items-center"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          
          <Button onClick={saveWidgetSettings}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
