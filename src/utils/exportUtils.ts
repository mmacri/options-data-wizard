
import { Trade } from "@/components/ui-components/DataTableTypes";
import { exportTradesCSV } from "./csvUtils";

// Helper function to get current date/time formatted for filenames
function getFormattedDateTime() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
}

// Export to Excel (XLSX format)
export const exportTradesExcel = async (
  trades: Trade[],
  traderName?: string,
  includeMetadata = true,
  includeSummary = true
) => {
  try {
    // For Excel export, we need to use a third-party library
    // We'll dynamically import it when needed to avoid bundling it always
    const XLSX = await import('xlsx').then(module => module.default);
    
    // Prepare data
    const worksheetData = trades.map(trade => ({
      'Trade ID': trade.tradeId,
      'Symbol': trade.underlyingSymbol,
      'Type': trade.optionType,
      'Entry Date': trade.entryDate,
      'Exit Date': trade.exitDate || '',
      'Entry Price': trade.entryPrice,
      'Exit Price': trade.exitPrice || '',
      'Quantity': trade.quantity,
      'P/L': trade.profitLoss,
      'Status': trade.status,
      'Trader': trade.traderName || 'Unknown',
      'Notes': trade.notes || '',
      'ROI (%)': trade.roi || 0,
    }));
    
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    
    // Add metadata sheet if requested
    if (includeMetadata) {
      const metadataData = [
        { 'Key': 'Export Date', 'Value': new Date().toLocaleString() },
        { 'Key': 'Total Trades', 'Value': trades.length },
        { 'Key': 'Trader', 'Value': traderName || 'All Traders' },
      ];
      const metadataSheet = XLSX.utils.json_to_sheet(metadataData);
      XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata');
    }
    
    // Add summary sheet if requested
    if (includeSummary) {
      const openTrades = trades.filter(t => t.status === 'Open').length;
      const closedTrades = trades.filter(t => t.status === 'Closed').length;
      const pendingTrades = trades.filter(t => t.status === 'Pending').length;
      const totalProfitLoss = trades.reduce((sum, t) => sum + t.profitLoss, 0);
      const profitableTrades = trades.filter(t => t.profitLoss > 0).length;
      const unprofitableTrades = trades.filter(t => t.profitLoss < 0).length;
      
      const summaryData = [
        { 'Metric': 'Open Trades', 'Value': openTrades },
        { 'Metric': 'Closed Trades', 'Value': closedTrades },
        { 'Metric': 'Pending Trades', 'Value': pendingTrades },
        { 'Metric': 'Total P/L', 'Value': totalProfitLoss },
        { 'Metric': 'Profitable Trades', 'Value': profitableTrades },
        { 'Metric': 'Unprofitable Trades', 'Value': unprofitableTrades },
        { 'Metric': 'Win Rate', 'Value': `${((profitableTrades / trades.length) * 100).toFixed(2)}%` },
      ];
      
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    }
    
    // Add main data sheet
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trades');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Create blob and download
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return blob;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw new Error("Failed to export as Excel file");
  }
};

// Export to PDF format
export const exportTradesPDF = async (
  trades: Trade[],
  traderName?: string,
  includeMetadata = true,
  includeSummary = true
) => {
  try {
    // For PDF export, we need to use a third-party library
    const { jsPDF } = await import('jspdf');
    const { autoTable } = await import('jspdf-autotable');
    
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add title
    const title = traderName 
      ? `Trade Report - ${traderName}` 
      : 'Trade Report - All Traders';
    
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Add metadata if requested
    if (includeMetadata) {
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
      doc.text(`Total Trades: ${trades.length}`, 14, 35);
    }
    
    // Add summary if requested
    if (includeSummary) {
      const openTrades = trades.filter(t => t.status === 'Open').length;
      const closedTrades = trades.filter(t => t.status === 'Closed').length;
      const pendingTrades = trades.filter(t => t.status === 'Pending').length;
      const totalProfitLoss = trades.reduce((sum, t) => sum + t.profitLoss, 0);
      const profitableTrades = trades.filter(t => t.profitLoss > 0).length;
      const unprofitableTrades = trades.filter(t => t.profitLoss < 0).length;
      const winRate = ((profitableTrades / trades.length) * 100).toFixed(2);
      
      // Add summary table
      autoTable(doc, {
        head: [['Metric', 'Value']],
        body: [
          ['Open Trades', openTrades.toString()],
          ['Closed Trades', closedTrades.toString()],
          ['Pending Trades', pendingTrades.toString()],
          ['Total P/L', `$${totalProfitLoss.toFixed(2)}`],
          ['Profitable Trades', profitableTrades.toString()],
          ['Unprofitable Trades', unprofitableTrades.toString()],
          ['Win Rate', `${winRate}%`],
        ],
        startY: 45,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
      });
    }
    
    // Add trades table
    const tableData = trades.map(trade => [
      trade.tradeId,
      trade.underlyingSymbol,
      trade.optionType,
      trade.entryDate,
      trade.exitDate || '-',
      `$${trade.entryPrice.toFixed(2)}`,
      trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '-',
      trade.quantity,
      `$${trade.profitLoss.toFixed(2)}`,
      trade.status,
      trade.traderName || 'Unknown',
    ]);
    
    autoTable(doc, {
      head: [['ID', 'Symbol', 'Type', 'Entry Date', 'Exit Date', 'Entry', 'Exit', 'Qty', 'P/L', 'Status', 'Trader']],
      body: tableData,
      startY: includeSummary ? doc.lastAutoTable.finalY + 15 : 45,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
    });
    
    // Generate PDF blob
    const pdfBlob = doc.output('blob');
    return pdfBlob;
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    throw new Error("Failed to export as PDF file");
  }
};

// Export to JSON format
export const exportTradesJSON = (
  trades: Trade[],
  traderName?: string,
  includeMetadata = true
) => {
  try {
    let exportData: any = { trades };
    
    if (includeMetadata) {
      exportData.metadata = {
        exportDate: new Date().toISOString(),
        traderName: traderName || 'All Traders',
        totalTrades: trades.length,
      };
    }
    
    // Create JSON blob
    const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    return jsonBlob;
  } catch (error) {
    console.error("Error exporting to JSON:", error);
    throw new Error("Failed to export as JSON file");
  }
};

// Main export function that handles all formats
export const exportTrades = async (
  trades: Trade[],
  format: 'csv' | 'excel' | 'pdf' | 'json' = 'csv',
  traderName?: string,
  options = { includeMetadata: true, includeSummary: true, includeCharts: false }
) => {
  try {
    let blob;
    let extension;
    let mimeType;
    
    switch (format) {
      case 'excel':
        blob = await exportTradesExcel(trades, traderName, options.includeMetadata, options.includeSummary);
        extension = 'xlsx';
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
        
      case 'pdf':
        blob = await exportTradesPDF(trades, traderName, options.includeMetadata, options.includeSummary);
        extension = 'pdf';
        mimeType = 'application/pdf';
        break;
        
      case 'json':
        blob = exportTradesJSON(trades, traderName, options.includeMetadata);
        extension = 'json';
        mimeType = 'application/json';
        break;
        
      case 'csv':
      default:
        const csvData = exportTradesCSV(trades, traderName);
        blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        extension = 'csv';
        mimeType = 'text/csv';
        break;
    }
    
    // Generate filename
    const timestamp = getFormattedDateTime();
    const traderSuffix = traderName ? `_${traderName.replace(/\s+/g, '_')}` : '';
    const filename = `trades_export${traderSuffix}_${timestamp}.${extension}`;
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    return true;
  } catch (error) {
    console.error(`Error exporting trades as ${format}:`, error);
    throw error;
  }
};
