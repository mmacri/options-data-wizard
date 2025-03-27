
import { useState, useEffect } from "react";
import { FileSpreadsheet, FileText, FileType, FileJson } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/useLocalStorage";

interface ExportFormatDialogProps {
  onExport: (format: 'csv' | 'excel' | 'pdf' | 'json', options: any) => void;
  trigger: React.ReactNode;
  traderName?: string;
}

export function ExportFormatDialog({ onExport, trigger, traderName }: ExportFormatDialogProps) {
  const [settings] = useLocalStorage("userSettings", {
    exportSettings: {
      defaultFormat: "csv" as const,
      includeMetadata: true,
      includeCharts: false,
      includeSummary: true,
    }
  });
  
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf' | 'json'>(
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
  
  const { toast } = useToast();
  
  useEffect(() => {
    if (settings.exportSettings) {
      setFormat(settings.exportSettings.defaultFormat);
      setIncludeMetadata(settings.exportSettings.includeMetadata);
      setIncludeCharts(settings.exportSettings.includeCharts);
      setIncludeSummary(settings.exportSettings.includeSummary);
    }
  }, [settings.exportSettings]);

  const handleExport = () => {
    try {
      onExport(format, {
        includeMetadata,
        includeCharts,
        includeSummary
      });
      
      setOpen(false);
      toast({
        title: "Export started",
        description: `Exporting data as ${format.toUpperCase()}...`
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Trade Data</DialogTitle>
          <DialogDescription>
            {traderName 
              ? `Export ${traderName}'s trade data to your preferred format.` 
              : "Export all trade data to your preferred format."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-4">
            <Label>Export Format</Label>
            <RadioGroup 
              value={format} 
              onValueChange={(value) => setFormat(value as 'csv' | 'excel' | 'pdf' | 'json')}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  CSV
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="flex items-center cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Excel
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center cursor-pointer">
                  <FileType className="h-4 w-4 mr-2" />
                  PDF
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center cursor-pointer">
                  <FileJson className="h-4 w-4 mr-2" />
                  JSON
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-4">
            <Label>Export Options</Label>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="metadata" className="cursor-pointer">Include Metadata</Label>
              <Switch
                id="metadata"
                checked={includeMetadata}
                onCheckedChange={setIncludeMetadata}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="charts" className="cursor-pointer">
                Include Charts
                {format !== 'pdf' && format !== 'excel' && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (PDF/Excel only)
                  </span>
                )}
              </Label>
              <Switch
                id="charts"
                checked={includeCharts}
                onCheckedChange={setIncludeCharts}
                disabled={format !== 'pdf' && format !== 'excel'}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="summary" className="cursor-pointer">
                Include Summary
                {format === 'json' && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (Not available for JSON)
                  </span>
                )}
              </Label>
              <Switch
                id="summary"
                checked={includeSummary}
                onCheckedChange={setIncludeSummary}
                disabled={format === 'json'}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
