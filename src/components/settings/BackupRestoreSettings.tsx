
import React, { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui-components/Card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download, Upload, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useLocalStorage from "@/hooks/useLocalStorage";

export function BackupRestoreSettings() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [, setTrades] = useLocalStorage("trades", []);
  const [, setSettings] = useLocalStorage("userSettings", {});
  
  const handleCreateBackup = () => {
    try {
      // Get all data from localStorage to create a complete backup
      const backup = {
        trades: localStorage.getItem("trades") ? JSON.parse(localStorage.getItem("trades") || "[]") : [],
        userSettings: localStorage.getItem("userSettings") ? JSON.parse(localStorage.getItem("userSettings") || "{}") : {},
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
  
  const handleBrowseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRestoreError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);
        
        // Validate backup data
        if (!backupData.trades || !backupData.userSettings) {
          setRestoreError("Invalid backup file: missing required data");
          return;
        }
        
        setIsRestoring(true);
        
        // Restore all data to localStorage
        if (backupData.trades) localStorage.setItem("trades", JSON.stringify(backupData.trades));
        if (backupData.userSettings) localStorage.setItem("userSettings", JSON.stringify(backupData.userSettings));
        if (backupData.tradeSummary) localStorage.setItem("tradeSummary", JSON.stringify(backupData.tradeSummary));
        if (backupData.openPositions) localStorage.setItem("openPositions", JSON.stringify(backupData.openPositions));
        if (backupData.performanceMetrics) localStorage.setItem("performanceMetrics", JSON.stringify(backupData.performanceMetrics));
        
        // Update state with the new data (to trigger re-renders)
        setTrades(backupData.trades);
        setSettings(backupData.userSettings);
        
        toast({
          title: "Restore successful",
          description: "Your data has been restored from backup. Please refresh the page to see all changes."
        });
        
        setIsRestoring(false);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Restore error:", error);
        setRestoreError("Failed to parse backup file. Please ensure it's a valid JSON backup.");
        setIsRestoring(false);
      }
    };
    
    reader.readAsText(file);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup & Restore</CardTitle>
        <CardDescription>Create backups of your data or restore from a previous backup.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {restoreError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{restoreError}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label>Backup</Label>
          <p className="text-sm text-muted-foreground">
            Create a complete backup of all your data including trades, settings, and configurations.
          </p>
          <Button 
            variant="outline" 
            onClick={handleCreateBackup}
            className="mt-2 flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Create Backup
          </Button>
        </div>
        
        <div className="space-y-2 pt-4 border-t">
          <Label>Restore</Label>
          <p className="text-sm text-muted-foreground">
            Restore your data from a previously created backup file. This will replace all current data.
          </p>
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              onClick={handleBrowseFiles}
              disabled={isRestoring}
              className="flex items-center"
            >
              <Upload className="mr-2 h-4 w-4" />
              Browse Backup Files
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelected}
              accept=".json"
              className="hidden"
            />
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            Note: After restoring, please refresh the page to ensure all changes are applied correctly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
