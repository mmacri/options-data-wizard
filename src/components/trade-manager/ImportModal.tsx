
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

  // Enhanced CSV template with more fields for comprehensive data import
  const csvTemplate = `tradeId,traderName,underlyingSymbol,optionType,entryDate,entryPrice,exitDate,exitPrice,quantity,totalPremium,totalInvested,profitLoss,status,notes
T1001,John Doe,AAPL,Call,2023-06-15,5.75,2023-07-10,8.25,10,5750,5750,2500,Closed,Closed for profit after earnings
T1002,Jane Smith,TSLA,Put,2023-07-01,10.50,2023-07-15,8.50,5,5250,5250,-1000,Closed,Closed for loss
T1003,John Doe,MSFT,Call,2023-07-10,3.25,,,15,4875,4875,0,Open,Holding through earnings
T1004,Jane Smith,AMD,Put,2023-07-15,2.10,,,20,4200,4200,0,Open,Looking for pullback
T1005,Alex Johnson,NVDA,Call,2023-07-20,15.75,,,3,4725,4725,0,Pending,Waiting for confirmation`;

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
          placeholder={csvTemplate}
        />
        <div className="flex justify-between items-center mb-2">
          <button 
            className="text-xs text-muted-foreground hover:text-primary"
            onClick={() => onCsvTextChange(csvTemplate)}
          >
            Load example template
          </button>
          <button
            className="text-xs text-muted-foreground hover:text-primary"
            onClick={() => onCsvTextChange("")}
          >
            Clear text
          </button>
        </div>
        
        <div className="bg-muted/30 p-3 rounded-md mb-4 text-xs">
          <h4 className="font-medium mb-1">Field Descriptions:</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>tradeId</strong>: Unique identifier for the trade</li>
            <li><strong>traderName</strong>: Name of the trader who made the trade</li>
            <li><strong>underlyingSymbol</strong>: Stock ticker symbol</li>
            <li><strong>optionType</strong>: "Call" or "Put"</li>
            <li><strong>entryDate</strong>: Date trade was opened (YYYY-MM-DD)</li>
            <li><strong>entryPrice</strong>: Option price at entry</li>
            <li><strong>exitDate</strong>: Date trade was closed (leave blank for open trades)</li>
            <li><strong>exitPrice</strong>: Option price at exit (leave blank for open trades)</li>
            <li><strong>quantity</strong>: Number of contracts</li>
            <li><strong>totalPremium</strong>: Total premium paid (entryPrice × quantity × 100)</li>
            <li><strong>totalInvested</strong>: Total capital invested</li>
            <li><strong>profitLoss</strong>: Total profit/loss on the trade</li>
            <li><strong>status</strong>: "Open", "Closed" or "Pending"</li>
            <li><strong>notes</strong>: Additional trade information</li>
          </ul>
        </div>
        
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
            disabled={!csvImportText.trim()}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};
