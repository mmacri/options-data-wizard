
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui-components/Card";

export function CalculationDetails() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ROI Calculation Methods</CardTitle>
          <CardDescription>Different ways to calculate Return on Investment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Simple ROI</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Simple ROI is calculated as (Profit / Investment) * 100
            </p>
            <pre className="bg-muted p-2 rounded-md mt-2 text-xs">
              ROI = (Profit / Investment) * 100
            </pre>
            <p className="text-sm mt-2">
              Example: If you invested $1,000 and made $1,200, your profit is $200. 
              ROI = ($200 / $1,000) * 100 = 20%
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Annualized ROI</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Annualized ROI accounts for the time period of the investment
            </p>
            <pre className="bg-muted p-2 rounded-md mt-2 text-xs">
              Annualized ROI = ((1 + ROI) ^ (365 / days)) - 1
            </pre>
            <p className="text-sm mt-2">
              Example: If you achieved 10% ROI in 73 days (1/5th of a year):
              Annualized ROI = ((1 + 0.1) ^ (365 / 73)) - 1 = 61.5%
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">ROI with Fees</h3>
            <p className="text-sm text-muted-foreground mt-1">
              This method includes transaction costs in the calculation
            </p>
            <pre className="bg-muted p-2 rounded-md mt-2 text-xs">
              ROI with Fees = ((Profit - Fees) / Investment) * 100
            </pre>
            <p className="text-sm mt-2">
              Example: If you invested $1,000, made $200 profit, but paid $20 in fees:
              ROI = (($200 - $20) / $1,000) * 100 = 18%
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Key metrics used to evaluate trading performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Win/Loss Ratio</h3>
            <p className="text-sm text-muted-foreground mt-1">
              The ratio of winning trades to losing trades
            </p>
            <pre className="bg-muted p-2 rounded-md mt-2 text-xs">
              Win/Loss Ratio = Number of Profitable Trades / Number of Unprofitable Trades
            </pre>
            <p className="text-sm mt-2">
              A ratio above 1.0 means you have more winning trades than losing trades.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Maximum Drawdown</h3>
            <p className="text-sm text-muted-foreground mt-1">
              The largest drop from a peak to a trough in account value
            </p>
            <pre className="bg-muted p-2 rounded-md mt-2 text-xs">
              Max Drawdown = ((Peak Value - Trough Value) / Peak Value) * 100
            </pre>
            <p className="text-sm mt-2">
              Lower drawdown values indicate better risk management.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Consistency (Standard Deviation)</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Measures the variability of returns
            </p>
            <pre className="bg-muted p-2 rounded-md mt-2 text-xs">
              Consistency = √(Σ(Returns - Mean Return)² / Number of Trades)
            </pre>
            <p className="text-sm mt-2">
              Lower values indicate more consistent returns across trades.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Option Trade Calculations</CardTitle>
          <CardDescription>Formulas used for different option strategies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Call Options</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Profit from call options is calculated as:
            </p>
            <pre className="bg-muted p-2 rounded-md mt-2 text-xs">
              Profit = (Exit Price - Entry Price) * Contract Size * Number of Contracts
            </pre>
            <p className="text-sm mt-2">
              For example, if you bought 1 call option at $2.00 and sold at $3.50, with each contract representing 100 shares:
              Profit = ($3.50 - $2.00) * 100 * 1 = $150
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Put Options</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Profit from put options follows the same formula:
            </p>
            <pre className="bg-muted p-2 rounded-md mt-2 text-xs">
              Profit = (Exit Price - Entry Price) * Contract Size * Number of Contracts
            </pre>
            <p className="text-sm mt-2">
              For puts, your profit increases as the underlying asset's price decreases.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Spreads</h3>
            <p className="text-sm text-muted-foreground mt-1">
              For spreads (like Bull Call Spread), calculate each leg separately:
            </p>
            <pre className="bg-muted p-2 rounded-md mt-2 text-xs">
              Profit = (Long Option P/L) + (Short Option P/L)
            </pre>
            <p className="text-sm mt-2">
              The maximum profit is typically the difference between strike prices minus the net premium paid.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
