
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui-components/Card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, FileType, FileJson, Download } from "lucide-react";
import { ExportFormat } from "@/types/settings";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import { exportTrades } from "@/utils/exportUtils";

export function ExportSettings() {
  const { toast } = useToast();
  const [trades] = useLocalStorage("trades", []);
  const [settings, setSettings] = useLocalStorage("userSettings", {
    exportSettings: {
      defaultFormat: "csv" as ExportFormat,
      includeMetadata: true,
      includeCharts: false,
      includeSummary: true,
    }
  });

  const [format, setFormat] = useState<ExportFormat>(
    settings.exportSettings?.defaultFormat || "csv"
  );
  const [includeMetadata, setIncludeMetadata] = useState(
    settings.exportSettings?.includeMetadata !== undefined 
      ? settings.exportSettings.includeMetadata 
      : true
  );
  const [includeCharts, setIncludeCharts] = useState(
    settings.exportSettings?.includeCharts !== undefined 
      ? settings.exportSettings.includeCharts 
      : false
  );
  const [includeSummary, setIncludeSummary] = useState(
    settings.exportSettings?.includeSummary !== undefined 
      ? settings.exportSettings.includeSummary 
      : true
  );

  const handleSaveSettings = () => {
    setSettings(prev => ({
      ...prev,
      exportSettings: {
        defaultFormat: format,
        includeMetadata,
        includeCharts,
        includeSummary
      }
    }));
    
    toast({
      title: "Export settings saved",
      description: "Your export preferences have been updated.",
    });
  };

  const handleExportAllData = async () => {
    try {
      await exportTrades(trades, format, undefined, {
        includeMetadata,
        includeCharts,
        includeSummary
      });
      
      toast({
        title: "Data exported",
        description: `All trades have been exported as ${format.toUpperCase()}.`
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };

  const handleCreateBackup = async () => {
    try {
      // Get all data from localStorage to create a complete backup
      const backup = {
        trades: trades,
        userSettings: settings,
        tradeSummary: localStorage.getItem("tradeSummary") ? JSON.parse(localStorage.getItem("tradeSummary") || "[]") : [],
        openPositions: localStorage.getItem("openPositions") ? JSON.parse(localStorage.getItem("openPositions") || "[]") : [],
        performanceMetrics: localStorage.getItem("performanceMetrics") ? JSON.parse(localStorage.getItem("performanceMetrics") || "[]") : [],
        version: "1.0.0",
        timestamp: new Date().toISOString()
      };
      
      // Create and download backup file
      const backupBlob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(backupBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `trade-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Backup created",
        description: "A complete backup of your data has been downloaded."
      });
    } catch (error) {
      console.error("Backup error:", error);
      toast({
        title: "Backup failed",
        description: "There was an error creating your backup.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Settings</CardTitle>
        <CardDescription>Customize your export preferences.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="space-y-4">
          <Label>Default Export Format</Label>
          <RadioGroup 
            value={format} 
            onValueChange={(value) => setFormat(value as ExportFormat)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="csv-default" />
              <Label htmlFor="csv-default" className="flex items-center cursor-pointer">
                <FileText className="h-4 w-4 mr-2" />
                CSV
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="excel" id="excel-default" />
              <Label htmlFor="excel-default" className="flex items-center cursor-pointer">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pdf" id="pdf-default" />
              <Label htmlFor="pdf-default" className="flex items-center cursor-pointer">
                <FileType className="h-4 w-4 mr-2" />
                PDF
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="json-default" />
              <Label htmlFor="json-default" className="flex items-center cursor-pointer">
                <FileJson className="h-4 w-4 mr-2" />
                JSON
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-4">
          <Label>Default Export Options</Label>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="metadata-default" className="cursor-pointer">Include Metadata</Label>
            <Switch
              id="metadata-default"
              checked={includeMetadata}
              onCheckedChange={setIncludeMetadata}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="charts-default" className="cursor-pointer">
              Include Charts
              {format !== 'pdf' && format !== 'excel' && (
                <span className="text-xs text-muted-foreground ml-2">
                  (PDF/Excel only)
                </span>
              )}
            </Label>
            <Switch
              id="charts-default"
              checked={includeCharts}
              onCheckedChange={setIncludeCharts}
              disabled={format !== 'pdf' && format !== 'excel'}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="summary-default" className="cursor-pointer">
              Include Summary
              {format === 'json' && (
                <span className="text-xs text-muted-foreground ml-2">
                  (Not available for JSON)
                </span>
              )}
            </Label>
            <Switch
              id="summary-default"
              checked={includeSummary}
              onCheckedChange={setIncludeSummary}
              disabled={format === 'json'}
            />
          </div>
        </div>
        
        <div className="space-y-4 pt-4 border-t">
          <Label>Quick Actions</Label>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={handleSaveSettings} 
              className="flex items-center"
            >
              Save Settings
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleExportAllData} 
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Export All Data
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleCreateBackup} 
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Create Backup
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
