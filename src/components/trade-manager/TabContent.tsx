
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui-components/Card";
import { DataTable } from "@/components/ui-components/DataTable";
import { Trade } from "@/components/ui-components/DataTableTypes";
import { TraderTable } from "./TraderTable";

interface TabContentProps {
  activeTab: string;
  trades: Trade[];
  summaryData: any[];
  openPositions: any[];
  performanceMetrics: any[];
  traderStats: any[];
  onViewTrade: (trade: Trade) => void;
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (trade: Trade) => void;
  onExportTraderData: (trader: string) => void;
}

export const TabContent = ({
  activeTab,
  trades,
  summaryData,
  openPositions,
  performanceMetrics,
  traderStats,
  onViewTrade,
  onEditTrade,
  onDeleteTrade,
  onExportTraderData
}: TabContentProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <Card glass>
            <CardHeader>
              <CardTitle>Trade Details</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={trades}
                onView={onViewTrade}
                onEdit={onEditTrade}
                onDelete={onDeleteTrade}
              />
            </CardContent>
          </Card>
        );
      
      case "summary":
        return (
          <Card glass>
            <CardHeader>
              <CardTitle>Trade Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={summaryData.length > 0 ? summaryData : trades}
                onView={onViewTrade}
                onEdit={onEditTrade}
                onDelete={onDeleteTrade}
              />
            </CardContent>
          </Card>
        );
      
      case "positions":
        // Filter for only open positions if openPositions is empty
        const positionsData = openPositions.length > 0 ? 
          openPositions : 
          trades.filter(trade => trade.status === "Open");
          
        return (
          <Card glass>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={positionsData}
                onView={onViewTrade}
                onEdit={onEditTrade}
                onDelete={onDeleteTrade}
              />
            </CardContent>
          </Card>
        );
      
      case "metrics":
        return (
          <Card glass>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={performanceMetrics.length > 0 ? performanceMetrics : trades}
                onView={onViewTrade}
                onEdit={onEditTrade}
                onDelete={onDeleteTrade}
              />
            </CardContent>
          </Card>
        );
      
      case "traders":
        return (
          <TraderTable 
            traderStats={traderStats} 
            onExportTraderData={onExportTraderData}
          />
        );
      
      default:
        return null;
    }
  };

  return <div className="mt-4">{renderContent()}</div>;
};
