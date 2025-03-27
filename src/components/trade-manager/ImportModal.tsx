
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserCircle, X } from "lucide-react";
import { ImportTemplateHelper } from "./ImportTemplateHelper";

interface ImportModalProps {
  isOpen: boolean;
  csvImportText: string;
  selectedTraderImport: string | null;
  onCsvTextChange: (text: string) => void;
  onClearTrader: () => void;
  onCancel: () => void;
  onImport: () => void;
}

export function ImportModal({
  isOpen,
  csvImportText,
  selectedTraderImport,
  onCsvTextChange,
  onClearTrader,
  onCancel,
  onImport
}: ImportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Trades</DialogTitle>
          <DialogDescription>
            Paste your CSV data below to import trades.
            {selectedTraderImport && (
              <div className="mt-2 flex items-center">
                <span className="text-primary font-medium">
                  Importing for trader: {selectedTraderImport}
                </span>
                <Button variant="ghost" size="icon" className="h-5 w-5 ml-2" onClick={onClearTrader}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <ImportTemplateHelper />
        
        <div className="space-y-2">
          <Label htmlFor="csvImport">CSV Data</Label>
          <Textarea
            id="csvImport"
            placeholder="Paste your CSV data here..."
            className="font-mono text-xs h-40"
            value={csvImportText}
            onChange={(e) => onCsvTextChange(e.target.value)}
          />
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onImport} disabled={!csvImportText.trim()}>
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
