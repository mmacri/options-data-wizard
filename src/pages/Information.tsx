
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui-components/Card";
import { CalculationDetails } from "@/components/information/CalculationDetails";
import { Info, Calculator, Book, Lightbulb, HelpCircle } from "lucide-react";

export default function Information() {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light">Information & Help</h1>
      </div>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger 
            value="overview" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <Info className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="calculations" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculations
          </TabsTrigger>
          <TabsTrigger 
            value="guide" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <Book className="h-4 w-4 mr-2" />
            User Guide
          </TabsTrigger>
          <TabsTrigger 
            value="tips" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Tips & Tricks
          </TabsTrigger>
          <TabsTrigger 
            value="faq" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Options Data Wizard</CardTitle>
              <CardDescription>
                An advanced platform for options traders to track, analyze, and optimize their trading performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Options Data Wizard helps you manage and analyze your options trading activity across multiple traders and strategies.
                Key features include:
              </p>
              
              <ul className="list-disc pl-5 space-y-2">
                <li>Multi-trader management with individual performance tracking</li>
                <li>Comprehensive trade logging for all option strategies</li>
                <li>Advanced performance metrics and analytics</li>
                <li>Customizable dashboard with performance widgets</li>
                <li>Export and backup capabilities for your trading data</li>
                <li>Detailed reporting with filtering by trader, date, and option type</li>
              </ul>
              
              <p className="mt-4">
                Navigate through the tabs to learn more about calculations, get usage guidance, and see tips for getting the most out of the platform.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calculations" className="mt-4">
          <CalculationDetails />
        </TabsContent>
        
        <TabsContent value="guide" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Guide</CardTitle>
              <CardDescription>Step-by-step instructions for using the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Getting Started</h3>
                <ol className="list-decimal pl-5 mt-2 space-y-2">
                  <li>
                    <strong>Set up traders</strong>: Go to Settings → Traders tab to add all the traders you want to track.
                  </li>
                  <li>
                    <strong>Configure calculation settings</strong>: Go to Settings → Calculation to set your preferred ROI method and fee handling.
                  </li>
                  <li>
                    <strong>Start adding trades</strong>: Go to the Trade Manager and click "Add Trade" to begin logging your options trades.
                  </li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Managing Trades</h3>
                <ol className="list-decimal pl-5 mt-2 space-y-2">
                  <li>
                    <strong>Add a new trade</strong>: Use the "Add Trade" button in the Trade Manager.
                  </li>
                  <li>
                    <strong>Edit a trade</strong>: Click the edit icon on any trade row to update details.
                  </li>
                  <li>
                    <strong>Close a position</strong>: Edit an open trade and enter the exit price and date.
                  </li>
                  <li>
                    <strong>Filter trades</strong>: Use the date range and trader filters to focus on specific subsets of data.
                  </li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Analyzing Performance</h3>
                <ol className="list-decimal pl-5 mt-2 space-y-2">
                  <li>
                    <strong>View overall metrics</strong>: The Dashboard provides a high-level view of performance.
                  </li>
                  <li>
                    <strong>Compare traders</strong>: Use the Traders tab in Trade Manager to compare performance across traders.
                  </li>
                  <li>
                    <strong>Generate reports</strong>: The Reporting page offers detailed analysis with various chart types.
                  </li>
                  <li>
                    <strong>Export data</strong>: Use the export functions to download CSV reports of your trading activity.
                  </li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Data Management</h3>
                <ol className="list-decimal pl-5 mt-2 space-y-2">
                  <li>
                    <strong>Import trades</strong>: Use the Import function to bulk-add trades from CSV files.
                  </li>
                  <li>
                    <strong>Create backups</strong>: Go to Settings → Export to back up all your trading data.
                  </li>
                  <li>
                    <strong>Restore data</strong>: Use the restore function to recover from a backup file.
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tips" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tips & Tricks</CardTitle>
              <CardDescription>Get the most out of the Options Data Wizard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-muted/40 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Use Keyboard Shortcuts</h3>
                  <p className="text-sm">
                    Press <kbd className="px-2 py-1 bg-background rounded border">Alt+N</kbd> to quickly add a new trade from any page.
                  </p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Save Custom Filters</h3>
                  <p className="text-sm">
                    Your date and trader filters are remembered between sessions. Set up your preferred view once and it will persist.
                  </p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Regular Backups</h3>
                  <p className="text-sm">
                    Create weekly backups of your data to prevent loss. Store backup files in a secure location.
                  </p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Use Tags in Notes</h3>
                  <p className="text-sm">
                    Add tags like #strategy or #experiment in your trade notes to make them searchable later.
                  </p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Compare Time Periods</h3>
                  <p className="text-sm">
                    Use the date filter to compare performance across different market conditions or quarters.
                  </p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Track Multiple Strategies</h3>
                  <p className="text-sm">
                    Create separate "traders" for different strategies to compare their effectiveness.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions about the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Can I track multiple accounts?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Yes, you can use different traders to track different accounts or create specific traders for each account you manage.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">How is ROI calculated?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  By default, ROI is calculated as (Profit / Investment) * 100. You can change the calculation method in Settings → Calculation to include fees or use annualized ROI.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Can I import data from my broker?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Yes, you can export trades from most brokers as CSV files and then import them using our CSV import tool. You may need to adjust the column mappings to match our format.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Is my data secure?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  All your trading data is stored locally in your browser's storage. To ensure data safety, regularly create backups using the export function in Settings → Export.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">How can I track complex options strategies?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You can select from various option types including spreads and multi-leg strategies when adding trades. For very complex strategies, you can break them down into individual legs and use the notes field to link them together.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Can I use this for stocks and other assets?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  While optimized for options trading, you can use the platform for tracking stocks and other assets by selecting the appropriate option type and using the relevant fields.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
