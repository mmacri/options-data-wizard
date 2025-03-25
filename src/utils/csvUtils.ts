
import { Trade } from "@/components/ui-components/DataTable";

// Convert trades to CSV format
export const exportTradesCSV = (trades: Trade[]): string => {
  // Define all headers
  const headers = [
    'tradeId',
    'traderName', // Added trader name
    'underlyingSymbol',
    'optionType',
    'entryDate',
    'entryPrice',
    'exitDate',
    'exitPrice',
    'quantity',
    'totalPremium',
    'profitLoss',
    'status',
    'notes',
    'totalInvested',
    'roi'
  ];
  
  // Create CSV header row
  const csvRows = [headers.join(',')];
  
  // Add data rows
  for (const trade of trades) {
    const values = headers.map(header => {
      const value = trade[header as keyof Trade];
      
      // Handle different data types
      if (value === null || value === undefined) {
        return '';
      }
      
      // Wrap strings with commas in quotes
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      
      return String(value);
    });
    
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

// Parse CSV data to trades array
export const importTradesCSV = (csvData: string): Trade[] => {
  const rows = csvData.trim().split('\n');
  const headers = rows[0].split(',');
  
  return rows.slice(1).map((row, index) => {
    const values = parseCSVRow(row);
    const trade: Record<string, any> = { id: crypto.randomUUID() };
    
    headers.forEach((header, i) => {
      if (i < values.length) {
        // Parse numeric values
        if (['entryPrice', 'exitPrice', 'quantity', 'totalPremium', 'profitLoss', 'totalInvested', 'roi'].includes(header)) {
          trade[header] = values[i] ? parseFloat(values[i]) : null;
        } else {
          trade[header] = values[i];
        }
      }
    });
    
    return trade as Trade;
  });
};

// Helper to properly parse CSV rows with quoted values
const parseCSVRow = (row: string): string[] => {
  const result = [];
  let inQuotes = false;
  let currentValue = '';
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  result.push(currentValue);
  return result;
};
