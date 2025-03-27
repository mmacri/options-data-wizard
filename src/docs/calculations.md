
# Trade Calculations

This document explains how various trade-related calculations are performed in the application.

## Profit/Loss (P/L)

### For Closed Trades
The profit or loss for a closed trade is calculated as:

```
P/L = (Exit Price - Entry Price) × Quantity
```

### For Open Trades
For open trades, the P/L is based on the current market price:

```
P/L = (Current Price - Entry Price) × Quantity
```

## Return on Investment (ROI)

The application supports multiple ROI calculation methods:

### Simple ROI
```
ROI = (Profit/Loss ÷ Initial Investment) × 100%
```

Where:
- Initial Investment = Entry Price × Quantity

### Annualized ROI
```
Annualized ROI = [(1 + Simple ROI)^(365 ÷ Days Held) - 1] × 100%
```

Where:
- Days Held = Exit Date - Entry Date (in days)

### ROI with Fees
When fees are included:

```
ROI = [(Profit/Loss - Fees) ÷ (Initial Investment + Fees)] × 100%
```

## Option-Specific Calculations

### Option Premium
For options, the total premium is:

```
Total Premium = Option Price × Contract Size × Number of Contracts
```

Where:
- Contract Size is typically 100 shares per contract

### Break-Even Price

#### For Call Options
```
Break-Even Price = Strike Price + Premium Per Share
```

#### For Put Options
```
Break-Even Price = Strike Price - Premium Per Share
```

## Win Rate
```
Win Rate = (Number of Profitable Trades ÷ Total Number of Trades) × 100%
```

## Maximum Drawdown
The maximum percentage decline from a peak to a trough:

```
Drawdown = (Trough Value - Peak Value) ÷ Peak Value × 100%
```

## Average Trade
```
Average Trade P/L = Total P/L ÷ Number of Trades
```

## Risk-Reward Ratio
```
Risk-Reward Ratio = Potential Profit ÷ Potential Loss
```
