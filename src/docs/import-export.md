
# Import and Export Functionality

This document explains how to import and export data in the application.

## Export Options

The application supports exporting trade data in multiple formats:

### CSV Export
Exports trade data in a comma-separated values format, which can be opened in spreadsheet applications like Excel or Google Sheets.

### Excel Export
Exports trade data to a native Excel (.xlsx) file with formatted data and multiple worksheets.

### PDF Export
Generates a PDF report with trade data, optional charts, and summary information.

### JSON Export
Exports data in JSON format, which is useful for developers or for backup purposes.

## Export Customization

When exporting, you can customize the following options:

### Include Metadata
When enabled, adds additional information to the export such as:
- Export date and time
- Total number of trades
- Trader name
- Application version

### Include Charts
For formats that support it (Excel and PDF), includes visual charts such as:
- Profit/Loss over time
- Trade distribution by type
- Win/Loss ratio visualization

### Include Summary
Adds a summary section with aggregated statistics:
- Total profit/loss
- Number of trades by status
- Win rate
- Average trade profit/loss
- Maximum drawdown

## Exporting Specific Data

### Export by Trader
You can export trades for a specific trader instead of exporting all trades.

### Export by Date Range
When a date filter is applied, only trades within that range will be exported.

## Import Functionality

### CSV Import Format
To import trades, the CSV file must follow a specific format. The application provides a template that can be downloaded from the Import dialog.

Required columns include:
- tradeId
- underlyingSymbol
- optionType
- entryDate
- entryPrice
- quantity
- status

Optional columns include:
- exitDate
- exitPrice
- totalPremium
- profitLoss
- traderName
- notes
- totalInvested
- roi

### Importing for Specific Traders
When importing, you can associate all imported trades with a specific trader, even if the trader information is not included in the import file.

### Data Validation
The import process validates the data to ensure it meets the requirements:
- Date formats must be YYYY-MM-DD
- Numeric values must be valid numbers
- Status must be one of: "Open", "Closed", or "Pending"
- Option type must be one of: "Call" or "Put"

### Handling Duplicates
If a trade with the same tradeId already exists, the application will:
1. Notify you about potential duplicates
2. Allow you to choose whether to skip, update, or create new trades

## Backup and Restore

### Full Application Backup
You can export all application data, including:
- All trades
- User settings
- Trader information
- Custom calculations

### Restoring from Backup
To restore data from a backup:
1. Navigate to Settings > Backup & Restore
2. Upload your backup file
3. Review the data to be restored
4. Confirm the restoration

### Automated Backups
Configure automated backup reminders that will notify you when it's time to back up your data.
