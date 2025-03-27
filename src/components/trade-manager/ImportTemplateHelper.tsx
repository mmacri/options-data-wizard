
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function ImportTemplateHelper() {
  const templateCSV = `tradeId,underlyingSymbol,optionType,entryDate,exitDate,entryPrice,exitPrice,quantity,totalPremium,profitLoss,status,traderName,notes,totalInvested,roi
T1001,AAPL,Call,2023-01-15,2023-01-30,5.75,8.50,10,5750,2750,Closed,John Doe,Good trade based on earnings,5750,47.83
T1002,MSFT,Put,2023-02-05,,3.25,,5,1625,0,Open,Jane Smith,Hedge against market downturn,1625,0
T1003,TSLA,Call,2023-02-10,2023-02-25,12.50,9.75,2,2500,-550,Closed,John Doe,Bad timing on entry,2500,-22.00
T1004,NVDA,Put,2023-03-01,,8.00,,3,2400,0,Pending,Jane Smith,Waiting for market conditions,2400,0`;

  const downloadTemplate = () => {
    const blob = new Blob([templateCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'trade_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4 border rounded-md p-4 bg-muted/20">
      <h3 className="text-lg font-medium mb-2">Import Instructions</h3>
      
      <Tabs defaultValue="template">
        <TabsList className="mb-2">
          <TabsTrigger value="template">Template</TabsTrigger>
          <TabsTrigger value="format">Format Requirements</TabsTrigger>
          <TabsTrigger value="fields">Field Descriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="template" className="space-y-2">
          <p className="text-sm text-muted-foreground">Download and use our CSV template for importing trades. Fill in your data using the provided format.</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={downloadTemplate}
            className="flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Template Preview:</h4>
            <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto whitespace-pre-wrap">
              {templateCSV}
            </pre>
          </div>
        </TabsContent>
        
        <TabsContent value="format" className="space-y-2">
          <p className="text-sm text-muted-foreground mb-2">
            Your CSV file must follow these formatting rules:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>The first row must contain column headers exactly as shown in the template</li>
            <li>Date format must be YYYY-MM-DD (e.g., 2023-01-15)</li>
            <li>Numeric values should use period (.) as decimal separator</li>
            <li>Status must be one of: "Open", "Closed", or "Pending"</li>
            <li>Option type must be one of: "Call" or "Put"</li>
            <li>Leave exitDate and exitPrice empty for open or pending trades</li>
            <li>profitLoss for open or pending trades should be 0</li>
            <li>ROI is optional - it will be calculated if not provided</li>
          </ul>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Example:</h4>
            <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">
              {`T1001,AAPL,Call,2023-01-15,2023-01-30,5.75,8.50,10,5750,2750,Closed,John Doe,Good earnings trade,5750,47.83`}
            </pre>
          </div>
        </TabsContent>
        
        <TabsContent value="fields">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="field-1">
              <AccordionTrigger className="text-sm">Required Fields</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li><strong>tradeId</strong>: Unique identifier for the trade (e.g., T1001)</li>
                  <li><strong>underlyingSymbol</strong>: Stock ticker symbol (e.g., AAPL)</li>
                  <li><strong>optionType</strong>: Must be "Call" or "Put"</li>
                  <li><strong>entryDate</strong>: Date trade was entered (YYYY-MM-DD)</li>
                  <li><strong>entryPrice</strong>: Price per contract at entry</li>
                  <li><strong>quantity</strong>: Number of contracts</li>
                  <li><strong>status</strong>: Must be "Open", "Closed", or "Pending"</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="field-2">
              <AccordionTrigger className="text-sm">Optional Fields</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li><strong>exitDate</strong>: Date trade was closed (YYYY-MM-DD)</li>
                  <li><strong>exitPrice</strong>: Price per contract at exit</li>
                  <li><strong>totalPremium</strong>: Total cost of the position (calculated if omitted)</li>
                  <li><strong>profitLoss</strong>: Total profit/loss (calculated if omitted)</li>
                  <li><strong>traderName</strong>: Name of the trader who placed the trade</li>
                  <li><strong>notes</strong>: Any additional information about the trade</li>
                  <li><strong>totalInvested</strong>: Total amount invested (calculated if omitted)</li>
                  <li><strong>roi</strong>: Return on investment as percentage (calculated if omitted)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="field-3">
              <AccordionTrigger className="text-sm">Calculated Fields</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  These fields will be automatically calculated if not provided:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li><strong>totalPremium</strong> = entryPrice × quantity</li>
                  <li><strong>profitLoss</strong> = (exitPrice - entryPrice) × quantity (for closed trades)</li>
                  <li><strong>totalInvested</strong> = totalPremium (may be different if there are additional costs)</li>
                  <li><strong>roi</strong> = (profitLoss ÷ totalInvested) × 100</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}
