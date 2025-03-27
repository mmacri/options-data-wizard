
import { UserCircle } from "lucide-react";

interface ImportModalProps {
  isOpen: boolean;
  csvImportText: string;
  selectedTraderImport: string | null;
  onCsvTextChange: (text: string) => void;
  onClearTrader: () => void;
  onCancel: () => void;
  onImport: () => void;
}

export const ImportModal = ({
  isOpen,
  csvImportText,
  selectedTraderImport,
  onCsvTextChange,
  onClearTrader,
  onCancel,
  onImport
}: ImportModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-6 animate-fade-in">
        <h3 className="text-lg font-medium mb-4">
          {selectedTraderImport ? `Import Trades for ${selectedTraderImport}` : "Import Trades from CSV"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Paste your CSV data below. The first row should contain headers matching the required fields.
          {selectedTraderImport && ` All imported trades will be assigned to ${selectedTraderImport}.`}
        </p>
        {selectedTraderImport && (
          <div className="flex items-center mb-4 p-2 bg-primary/10 rounded-md">
            <UserCircle className="h-5 w-5 mr-2 text-primary" />
            <span>Importing for: <strong>{selectedTraderImport}</strong></span>
            <button 
              className="ml-auto text-xs text-muted-foreground hover:text-foreground"
              onClick={onClearTrader}
            >
              Clear
            </button>
          </div>
        )}
        <textarea
          value={csvImportText}
          onChange={(e) => onCsvTextChange(e.target.value)}
          className="w-full h-40 p-3 border rounded-md mb-4 text-sm font-mono"
          placeholder="tradeId,underlyingSymbol,optionType,entryDate,entryPrice,..."
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Cancel
          </button>
          <button
            onClick={onImport}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};
