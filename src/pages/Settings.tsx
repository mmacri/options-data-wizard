
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui-components/Card";
import { 
  Upload, 
  Download,
  Save,
  Trash,
  Plus,
  Settings as SettingsIcon,
  CloudUpload,
  Moon,
  Sun,
  Paintbrush
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [cloudProvider, setCloudProvider] = useState("dropbox");
  const [cloudEmail, setCloudEmail] = useState("");
  const [refreshInterval, setRefreshInterval] = useState("5");
  
  // Column management
  const [columns, setColumns] = useState([
    { id: "1", name: "TradeID", dataType: "text", table: "Trade Details" },
    { id: "2", name: "UnderlyingSymbol", dataType: "text", table: "Trade Details" },
    { id: "3", name: "OptionType", dataType: "text", table: "Trade Details" },
    { id: "4", name: "EntryDate", dataType: "date", table: "Trade Details" },
    { id: "5", name: "EntryPrice", dataType: "number", table: "Trade Details" },
    { id: "6", name: "ExitDate", dataType: "date", table: "Trade Details" },
    { id: "7", name: "ExitPrice", dataType: "number", table: "Trade Details" },
    { id: "8", name: "Quantity", dataType: "number", table: "Trade Details" },
    { id: "9", name: "TotalPremium", dataType: "number", table: "Trade Details" },
    { id: "10", name: "ProfitLoss", dataType: "number", table: "Trade Details" },
    { id: "11", name: "Status", dataType: "text", table: "Trade Details" },
    { id: "12", name: "Notes", dataType: "text", table: "Trade Details" },
  ]);
  
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("text");
  const [newColumnTable, setNewColumnTable] = useState("Trade Details");
  
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
    toast({
      title: "Theme updated",
      description: `Theme set to ${!darkMode ? "dark" : "light"} mode.`
    });
  };
  
  const handleCloudSetup = () => {
    if (!cloudEmail) {
      toast({
        title: "Validation error",
        description: "Please enter your cloud provider email."
      });
      return;
    }
    
    toast({
      title: "Cloud setup initiated",
      description: `Connecting to ${cloudProvider} with ${cloudEmail}.`
    });
    
    // In a real app, this would authenticate with the cloud provider
    setTimeout(() => {
      toast({
        title: "Cloud connected",
        description: `Successfully connected to ${cloudProvider}.`
      });
    }, 1500);
  };
  
  const handleBackupNow = () => {
    toast({
      title: "Backup started",
      description: "Your data is being backed up to the cloud."
    });
    
    // Mock backup process
    setTimeout(() => {
      toast({
        title: "Backup complete",
        description: "All data has been successfully backed up."
      });
    }, 2000);
  };
  
  const handleImportData = () => {
    toast({
      title: "Import started",
      description: "This would open a file picker to import Excel data."
    });
  };
  
  const handleExportData = () => {
    toast({
      title: "Export started",
      description: "Your data is being exported."
    });
    
    // Mock export process
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "All data has been successfully exported."
      });
    }, 1500);
  };
  
  const handleAddColumn = () => {
    if (!newColumnName) {
      toast({
        title: "Validation error",
        description: "Please enter a column name."
      });
      return;
    }
    
    const newColumn = {
      id: (columns.length + 1).toString(),
      name: newColumnName,
      dataType: newColumnType,
      table: newColumnTable
    };
    
    setColumns([...columns, newColumn]);
    setNewColumnName("");
    
    toast({
      title: "Column added",
      description: `Column "${newColumnName}" has been added to "${newColumnTable}".`
    });
  };
  
  const handleDeleteColumn = (id: string) => {
    const updatedColumns = columns.filter(column => column.id !== id);
    setColumns(updatedColumns);
    
    toast({
      title: "Column deleted",
      description: "Column has been removed."
    });
  };
  
  const handleSaveColumnChanges = () => {
    toast({
      title: "Changes saved",
      description: "Column configuration has been updated."
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-light mb-8">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Data Import/Export Section */}
        <Card glass className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Data Import/Export
            </CardTitle>
            <CardDescription>
              Import data from Excel or export your current data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Import Data</h3>
              <p className="text-sm text-muted-foreground">
                Import data from an Excel file. The structure must match the expected format.
              </p>
              <button
                onClick={handleImportData}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Export Data</h3>
              <p className="text-sm text-muted-foreground">
                Export your current data to CSV or Excel format.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleExportData}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export to CSV
                </button>
                
                <button
                  onClick={handleExportData}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export to Excel
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Cloud Backup Section */}
        <Card glass className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CloudUpload className="h-5 w-5 mr-2" />
              Cloud Backup
            </CardTitle>
            <CardDescription>
              Configure cloud backup to Dropbox or OneDrive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Cloud Provider</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="cloudProvider">
                  Select Provider
                </label>
                <select
                  id="cloudProvider"
                  value={cloudProvider}
                  onChange={(e) => setCloudProvider(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="dropbox">Dropbox</option>
                  <option value="onedrive">OneDrive</option>
                  <option value="gdrive">Google Drive</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="cloudEmail">
                  Provider Email
                </label>
                <input
                  id="cloudEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={cloudEmail}
                  onChange={(e) => setCloudEmail(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              
              <button
                onClick={handleCloudSetup}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Connect
              </button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Manual Backup</h3>
              <p className="text-sm text-muted-foreground">
                Manually backup your data to the configured cloud provider.
              </p>
              <button
                onClick={handleBackupNow}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                <CloudUpload className="mr-2 h-4 w-4" />
                Backup Now
              </button>
            </div>
          </CardContent>
        </Card>
        
        {/* Column Management Section */}
        <Card glass className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "300ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2" />
              Column Management
            </CardTitle>
            <CardDescription>
              Add, remove, or modify columns for each table
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Columns</h3>
              
              <div className="overflow-auto rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium">Column Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Data Type</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Table</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {columns.map((column, index) => (
                      <tr 
                        key={column.id} 
                        className={index % 2 === 0 ? "bg-white dark:bg-card" : "bg-muted/20"}
                      >
                        <td className="p-4 align-middle">{column.name}</td>
                        <td className="p-4 align-middle">{column.dataType}</td>
                        <td className="p-4 align-middle">{column.table}</td>
                        <td className="p-4 align-middle text-right">
                          <button
                            onClick={() => handleDeleteColumn(column.id)}
                            className="btn-icon bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add New Column</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="newColumnName">
                    Column Name
                  </label>
                  <input
                    id="newColumnName"
                    type="text"
                    placeholder="Enter column name..."
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="newColumnType">
                    Data Type
                  </label>
                  <select
                    id="newColumnType"
                    value={newColumnType}
                    onChange={(e) => setNewColumnType(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="boolean">Boolean</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="newColumnTable">
                    Table
                  </label>
                  <select
                    id="newColumnTable"
                    value={newColumnTable}
                    onChange={(e) => setNewColumnTable(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="Trade Details">Trade Details</option>
                    <option value="Trade Summary">Trade Summary</option>
                    <option value="Open Positions">Open Positions</option>
                    <option value="Performance Metrics">Performance Metrics</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={handleAddColumn}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Column
              </button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <button
              onClick={handleSaveColumnChanges}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </button>
          </CardFooter>
        </Card>
        
        {/* General Preferences Section */}
        <Card glass className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Paintbrush className="h-5 w-5 mr-2" />
              General Preferences
            </CardTitle>
            <CardDescription>
              Customize your application experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <button
                onClick={handleToggleDarkMode}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                {darkMode ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark Mode
                  </>
                )}
              </button>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Auto-Refresh</h3>
              <p className="text-sm text-muted-foreground">
                Set how often the dashboard automatically refreshes
              </p>
              <div className="flex items-center space-x-4">
                <select
                  id="refreshInterval"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="1">Every 1 minute</option>
                  <option value="5">Every 5 minutes</option>
                  <option value="10">Every 10 minutes</option>
                  <option value="30">Every 30 minutes</option>
                  <option value="0">Never</option>
                </select>
                
                <button
                  onClick={() => {
                    toast({
                      title: "Auto-refresh updated",
                      description: refreshInterval === "0" 
                        ? "Auto-refresh disabled."
                        : `Auto-refresh set to every ${refreshInterval} minutes.`
                    });
                  }}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  Apply
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
