
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Info, Calendar, Settings } from "lucide-react";

export default function Information() {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light">Information</h1>
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
            <FileText className="h-4 w-4 mr-2" />
            Calculations
          </TabsTrigger>
          <TabsTrigger 
            value="definitions" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <Settings className="h-4 w-4 mr-2" />
            Definitions
          </TabsTrigger>
          <TabsTrigger 
            value="guide" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <Calendar className="h-4 w-4 mr-2" />
            User Guide
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade Tracker Pro Overview</CardTitle>
              <CardDescription>
                A comprehensive solution for tracking and analyzing your trading activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                Trade Tracker Pro is designed to help traders of all levels track, analyze, and improve their trading performance. 
                The application supports multiple traders, various trade types, and provides detailed analytics and reporting.
              </p>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Key Features</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Trade Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Add, edit, and delete trades with detailed information including symbol, type, entry/exit prices, quantity, etc.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Performance Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Track profit/loss, ROI, win rates, and other key performance metrics to understand your trading strengths and weaknesses.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Multi-Trader Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Support for multiple traders with individual performance tracking and comparison.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Data Import/Export</h4>
                    <p className="text-sm text-muted-foreground">
                      Easily import and export trade data in various formats, including CSV, Excel, PDF, and JSON.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Comprehensive Filtering</h4>
                    <p className="text-sm text-muted-foreground">
                      Filter trades by date range, trader, symbol, and status to focus on specific aspects of your trading.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Backup & Restore</h4>
                    <p className="text-sm text-muted-foreground">
                      Create backups of your data and restore from previous backups to ensure your trading records are never lost.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Technology Stack</h3>
                <p>
                  Trade Tracker Pro is built using modern web technologies:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>React (Frontend framework)</li>
                  <li>TypeScript (Type-safe JavaScript)</li>
                  <li>Tailwind CSS (Styling)</li>
                  <li>shadcn/ui (UI components)</li>
                  <li>React Router (Navigation)</li>
                  <li>React Query (Data fetching)</li>
                  <li>LocalStorage (Data persistence)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calculations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade Calculations</CardTitle>
              <CardDescription>
                Detailed explanation of all calculations used in the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Profit/Loss (P/L)</h3>
                
                <div className="space-y-2">
                  <h4 className="font-medium">For Closed Trades</h4>
                  <div className="p-4 bg-muted rounded-md font-mono">
                    P/L = (Exit Price - Entry Price) × Quantity
                  </div>
                  <p className="text-sm text-muted-foreground">
                    For closed trades, the profit or loss is calculated as the difference between 
                    the exit price and entry price, multiplied by the quantity.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">For Open Trades</h4>
                  <div className="p-4 bg-muted rounded-md font-mono">
                    P/L = (Current Price - Entry Price) × Quantity
                  </div>
                  <p className="text-sm text-muted-foreground">
                    For open trades, the profit or loss is calculated using the current market price 
                    instead of an exit price.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Return on Investment (ROI)</h3>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Simple ROI</h4>
                  <div className="p-4 bg-muted rounded-md font-mono">
                    ROI = (Profit/Loss ÷ Initial Investment) × 100%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Where Initial Investment = Entry Price × Quantity
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Annualized ROI</h4>
                  <div className="p-4 bg-muted rounded-md font-mono">
                    Annualized ROI = [(1 + Simple ROI)^(365 ÷ Days Held) - 1] × 100%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Where Days Held = Exit Date - Entry Date (in days)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">ROI with Fees</h4>
                  <div className="p-4 bg-muted rounded-md font-mono">
                    ROI = [(Profit/Loss - Fees) ÷ (Initial Investment + Fees)] × 100%
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Option-Specific Calculations</h3>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Option Premium</h4>
                  <div className="p-4 bg-muted rounded-md font-mono">
                    Total Premium = Option Price × Contract Size × Number of Contracts
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Where Contract Size is typically 100 shares per contract
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Break-Even Price (Call Options)</h4>
                  <div className="p-4 bg-muted rounded-md font-mono">
                    Break-Even Price = Strike Price + Premium Per Share
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Break-Even Price (Put Options)</h4>
                  <div className="p-4 bg-muted rounded-md font-mono">
                    Break-Even Price = Strike Price - Premium Per Share
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Performance Metrics</h3>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Win Rate</h4>
                  <div className="p-4 bg-muted rounded-md font-mono">
                    Win Rate = (Number of Profitable Trades ÷ Total Number of Trades) × 100%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Maximum Drawdown</h4>
                  <div className="p-4 bg-muted rounded-md font-mono">
                    Drawdown = (Trough Value - Peak Value) ÷ Peak Value × 100%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The maximum percentage decline from a peak to a trough
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Average Trade</h4>
                  <div className="p-4 bg-muted rounded-md font-mono">
                    Average Trade P/L = Total P/L ÷ Number of Trades
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Risk-Reward Ratio</h4>
                  <div className="p-4 bg-muted rounded-md font-mono">
                    Risk-Reward Ratio = Potential Profit ÷ Potential Loss
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Sharpe Ratio</h4>
                  <div className="p-4 bg-muted rounded-md font-mono">
                    Sharpe Ratio = (Average ROI - Risk Free Rate) ÷ Standard Deviation of ROI
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Measures risk-adjusted return, with higher values indicating better risk-adjusted performance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="definitions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Definitions</CardTitle>
              <CardDescription>
                Key terms and definitions used throughout the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Trade Terms</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Trade</h4>
                    <p className="text-sm text-muted-foreground">
                      A single transaction involving the purchase and sale of a financial instrument.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Position</h4>
                    <p className="text-sm text-muted-foreground">
                      An open trade that has not yet been closed. A position represents your current holdings.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Option</h4>
                    <p className="text-sm text-muted-foreground">
                      A contract giving the holder the right, but not the obligation, to buy (call option) or sell (put option) an underlying asset at a specified price within a specific time period.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Premium</h4>
                    <p className="text-sm text-muted-foreground">
                      The price paid by the buyer of an option to the seller for the rights conveyed by the option contract.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Strike Price</h4>
                    <p className="text-sm text-muted-foreground">
                      The price at which the holder of an option can buy (in the case of a call) or sell (in the case of a put) the underlying security.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Performance Terms</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Return on Investment (ROI)</h4>
                    <p className="text-sm text-muted-foreground">
                      A performance measure used to evaluate the efficiency of an investment, expressed as a percentage of the investment's cost.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Win Rate</h4>
                    <p className="text-sm text-muted-foreground">
                      The percentage of trades that result in a profit compared to the total number of trades.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Drawdown</h4>
                    <p className="text-sm text-muted-foreground">
                      The reduction in account value from a peak to a trough, usually expressed as a percentage.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Annualized Return</h4>
                    <p className="text-sm text-muted-foreground">
                      The return on investment expressed as a percentage over a one-year period, accounting for compounding.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Risk-Reward Ratio</h4>
                    <p className="text-sm text-muted-foreground">
                      A comparison of the potential profit of a trade relative to its potential loss.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Option Strategies</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Call Option</h4>
                    <p className="text-sm text-muted-foreground">
                      A contract that gives the holder the right to buy an underlying asset at a specified price within a specific time period.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Put Option</h4>
                    <p className="text-sm text-muted-foreground">
                      A contract that gives the holder the right to sell an underlying asset at a specified price within a specific time period.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Bull Call Spread</h4>
                    <p className="text-sm text-muted-foreground">
                      An options strategy involving the purchase of a call option and the sale of another call option with a higher strike price, designed to profit from a moderate rise in the price of the underlying asset.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Bear Put Spread</h4>
                    <p className="text-sm text-muted-foreground">
                      An options strategy involving the purchase of a put option and the sale of another put option with a lower strike price, designed to profit from a moderate decline in the price of the underlying asset.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Iron Condor</h4>
                    <p className="text-sm text-muted-foreground">
                      An options strategy consisting of two puts and two calls with the same expiration date but different strike prices, designed to profit from low volatility in the underlying asset.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guide" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Guide</CardTitle>
              <CardDescription>
                How to use Trade Tracker Pro effectively
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Getting Started</h3>
                <p>
                  Follow these steps to begin using Trade Tracker Pro effectively:
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">1. Add Traders</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to Settings &rarr; Trader Management to add traders who will be using the application.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">2. Configure Default Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to Settings &rarr; Trading Defaults to set default values for new trades.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">3. Add Your First Trade</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to Trade Manager and click "Add New Trade" to record your first trade.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">4. Explore the Dashboard</h4>
                    <p className="text-sm text-muted-foreground">
                      Navigate to the Dashboard to see performance metrics and charts based on your trades.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Managing Trades</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Adding Trades</h4>
                    <p className="text-sm text-muted-foreground">
                      In the Trade Manager, click "Add New Trade" and fill in the trade details. Required fields include symbol, option type, entry date, entry price, and quantity.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Editing Trades</h4>
                    <p className="text-sm text-muted-foreground">
                      Click the edit button for any trade to update its details. You can update entry/exit prices, dates, and other trade information.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Closing a Trade</h4>
                    <p className="text-sm text-muted-foreground">
                      To close an open trade, edit the trade and update the status to "Closed", then add the exit date and price.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Filtering Trades</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the date range filter and trader filter to narrow down the trades displayed.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Management</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Importing Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to Trade Manager and click "Import" to import trade data from a CSV file. You can import for all traders or a specific trader.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Exporting Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Click "Export" to export trade data in various formats (CSV, Excel, PDF, JSON). You can export all trades or filter by trader.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Creating Backups</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to Settings &rarr; Backup & Restore to create a complete backup of all your data.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Restoring from Backup</h4>
                    <p className="text-sm text-muted-foreground">
                      In the Backup & Restore section, use the restore functionality to upload a previously created backup file.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tips for Effective Use</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Regular Backups</h4>
                    <p className="text-sm text-muted-foreground">
                      Create regular backups of your data to prevent loss, especially after adding a significant number of trades.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Consistent Data Entry</h4>
                    <p className="text-sm text-muted-foreground">
                      Be consistent in how you enter trade data, especially for symbols and option types, to ensure accurate reporting.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Use Notes Field</h4>
                    <p className="text-sm text-muted-foreground">
                      Add detailed notes to your trades to remember your thought process and strategy for each trade.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">Review Performance Regularly</h4>
                    <p className="text-sm text-muted-foreground">
                      Regularly review your performance metrics to identify strengths, weaknesses, and areas for improvement in your trading.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
