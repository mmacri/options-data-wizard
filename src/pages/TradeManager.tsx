
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui-components/Card";
import { DataTable, Trade } from "@/components/ui-components/DataTable";
import { TradeModal } from "@/components/ui-components/TradeModal";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockTrades: Trade[] = [
  {
    id: "1",
    tradeId: "T1001",
    underlyingSymbol: "AAPL",
    optionType: "Call",
    entryDate: "2023-01-15",
    entryPrice: 5.75,
    exitDate: "2023-02-10",
    exitPrice: 8.25,
    quantity: 10,
    totalPremium: 5750,
    profitLoss: 2500,
    status: "Closed",
    notes: "Closed for profit after earnings announcement"
  },
  {
    id: "2",
    tradeId: "T1002",
    underlyingSymbol: "TSLA",
    optionType: "Put",
    entryDate: "2023-02-01",
    entryPrice: 10.50,
    quantity: 5,
    totalPremium: 5250,
    profitLoss: -2100,
    status: "Closed",
    notes: "Closed for loss after market rally"
  },
  {
    id: "3",
    tradeId: "T1003",
    underlyingSymbol: "MSFT",
    optionType: "Call",
    entryDate: "2023-03-10",
    entryPrice: 3.25,
    quantity: 15,
    totalPremium: 4875,
    profitLoss: 1200,
    status: "Open",
    notes: "Holding through next earnings"
  },
  {
    id: "4",
    tradeId: "T1004",
    underlyingSymbol: "AMD",
    optionType: "Put",
    entryDate: "2023-03-15",
    entryPrice: 2.10,
    quantity: 20,
    totalPremium: 4200,
    profitLoss: 800,
    status: "Open",
    notes: "Expecting pullback after recent run"
  },
  {
    id: "5",
    tradeId: "T1005",
    underlyingSymbol: "NVDA",
    optionType: "Call",
    entryDate: "2023-03-20",
    entryPrice: 15.75,
    quantity: 3,
    totalPremium: 4725,
    profitLoss: 0,
    status: "Pending",
    notes: "Waiting for confirmation before adding to position"
  }
];

// Mock data for the other tabs
const mockSummaryData: Trade[] = [
  {
    id: "101",
    tradeId: "S1001",
    underlyingSymbol: "AAPL",
    optionType: "Call",
    entryDate: "2023-01-01",
    entryPrice: 0,
    quantity: 30,
    totalPremium: 15000,
    profitLoss: 3500,
    status: "Closed"
  },
  {
    id: "102",
    tradeId: "S1002",
    underlyingSymbol: "TSLA",
    optionType: "Put",
    entryDate: "2023-02-01",
    entryPrice: 0,
    quantity: 10,
    totalPremium: 8500,
    profitLoss: -1200,
    status: "Closed"
  },
  {
    id: "103",
    tradeId: "S1003",
    underlyingSymbol: "MSFT",
    optionType: "Call",
    entryDate: "2023-03-01",
    entryPrice: 0,
    quantity: 25,
    totalPremium: 7500,
    profitLoss: 2100,
    status: "Open"
  }
];

const mockOpenPositions: Trade[] = [
  {
    id: "201",
    tradeId: "P1001",
    underlyingSymbol: "MSFT",
    optionType: "Call",
    entryDate: "2023-03-10",
    entryPrice: 3.25,
    quantity: 15,
    totalPremium: 4875,
    profitLoss: 1200,
    status: "Open"
  },
  {
    id: "202",
    tradeId: "P1002",
    underlyingSymbol: "AMD",
    optionType: "Put",
    entryDate: "2023-03-15",
    entryPrice: 2.10,
    quantity: 20,
    totalPremium: 4200,
    profitLoss: 800,
    status: "Open"
  },
  {
    id: "203",
    tradeId: "P1003",
    underlyingSymbol: "NVDA",
    optionType: "Call",
    entryDate: "2023-03-20",
    entryPrice: 15.75,
    quantity: 3,
    totalPremium: 4725,
    profitLoss: 0,
    status: "Pending"
  }
];

const mockPerformanceMetrics: Trade[] = [
  {
    id: "301",
    tradeId: "M1001",
    underlyingSymbol: "AAPL",
    optionType: "Call",
    entryDate: "2023-01-01",
    entryPrice: 0,
    quantity: 0,
    totalPremium: 0,
    profitLoss: 3500,
    status: "Closed"
  },
  {
    id: "302",
    tradeId: "M1002",
    underlyingSymbol: "TSLA",
    optionType: "Put",
    entryDate: "2023-02-01",
    entryPrice: 0,
    quantity: 0,
    totalPremium: 0,
    profitLoss: -1200,
    status: "Closed"
  },
  {
    id: "303",
    tradeId: "M1003",
    underlyingSymbol: "MSFT",
    optionType: "Call",
    entryDate: "2023-03-01",
    entryPrice: 0,
    quantity: 0,
    totalPremium: 0,
    profitLoss: 2100,
    status: "Open"
  }
];

export default function TradeManager() {
  const [activeTab, setActiveTab] = useState("details");
  const [trades, setTrades] = useState<Trade[]>(mockTrades);
  const [summaryData, setSummaryData] = useState<Trade[]>(mockSummaryData);
  const [openPositions, setOpenPositions] = useState<Trade[]>(mockOpenPositions);
  const [performanceMetrics, setPerformanceMetrics] = useState<Trade[]>(mockPerformanceMetrics);
  
  const [selectedTrade, setSelectedTrade] = useState<Trade | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddingTrade, setIsAddingTrade] = useState(false);
  
  const { toast } = useToast();
  
  const handleViewTrade = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsEditMode(false);
    setIsAddingTrade(false);
    setIsModalOpen(true);
  };
  
  const handleEditTrade = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsEditMode(true);
    setIsAddingTrade(false);
    setIsModalOpen(true);
  };
  
  const handleDeleteTrade = (trade: Trade) => {
    let updatedData;
    
    switch (activeTab) {
      case "details":
        updatedData = trades.filter(t => t.id !== trade.id);
        setTrades(updatedData);
        break;
      case "summary":
        updatedData = summaryData.filter(t => t.id !== trade.id);
        setSummaryData(updatedData);
        break;
      case "positions":
        updatedData = openPositions.filter(t => t.id !== trade.id);
        setOpenPositions(updatedData);
        break;
      case "metrics":
        updatedData = performanceMetrics.filter(t => t.id !== trade.id);
        setPerformanceMetrics(updatedData);
        break;
    }
    
    toast({
      title: "Trade deleted",
      description: `Trade ${trade.tradeId} has been deleted.`
    });
  };
  
  const handleSaveTrade = (updatedTrade: Trade) => {
    let updatedData;
    
    if (isAddingTrade) {
      switch (activeTab) {
        case "details":
          updatedData = [...trades, updatedTrade];
          setTrades(updatedData);
          break;
        case "summary":
          updatedData = [...summaryData, updatedTrade];
          setSummaryData(updatedData);
          break;
        case "positions":
          updatedData = [...openPositions, updatedTrade];
          setOpenPositions(updatedData);
          break;
        case "metrics":
          updatedData = [...performanceMetrics, updatedTrade];
          setPerformanceMetrics(updatedData);
          break;
      }
      
      toast({
        title: "Trade added",
        description: `New trade ${updatedTrade.tradeId} has been added.`
      });
    } else {
      switch (activeTab) {
        case "details":
          updatedData = trades.map(trade => 
            trade.id === updatedTrade.id ? updatedTrade : trade
          );
          setTrades(updatedData);
          break;
        case "summary":
          updatedData = summaryData.map(trade => 
            trade.id === updatedTrade.id ? updatedTrade : trade
          );
          setSummaryData(updatedData);
          break;
        case "positions":
          updatedData = openPositions.map(trade => 
            trade.id === updatedTrade.id ? updatedTrade : trade
          );
          setOpenPositions(updatedData);
          break;
        case "metrics":
          updatedData = performanceMetrics.map(trade => 
            trade.id === updatedTrade.id ? updatedTrade : trade
          );
          setPerformanceMetrics(updatedData);
          break;
      }
      
      toast({
        title: "Trade updated",
        description: `Trade ${updatedTrade.tradeId} has been updated.`
      });
    }
    
    setIsModalOpen(false);
  };
  
  const handleAddNewTrade = () => {
    setSelectedTrade(undefined);
    setIsEditMode(true);
    setIsAddingTrade(true);
    setIsModalOpen(true);
  };
  
  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "details":
        return trades;
      case "summary":
        return summaryData;
      case "positions":
        return openPositions;
      case "metrics":
        return performanceMetrics;
      default:
        return trades;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light">Trade Manager</h1>
        
        <button
          onClick={handleAddNewTrade}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Trade
        </button>
      </div>
      
      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-2 border-b">
          <button
            className={`tab-button ${activeTab === "details" ? "data-[state=active]" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Trade Details
          </button>
          <button
            className={`tab-button ${activeTab === "summary" ? "data-[state=active]" : ""}`}
            onClick={() => setActiveTab("summary")}
          >
            Trade Summary
          </button>
          <button
            className={`tab-button ${activeTab === "positions" ? "data-[state=active]" : ""}`}
            onClick={() => setActiveTab("positions")}
          >
            Open Positions
          </button>
          <button
            className={`tab-button ${activeTab === "metrics" ? "data-[state=active]" : ""}`}
            onClick={() => setActiveTab("metrics")}
          >
            Performance Metrics
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="animate-fade-in">
        <Card glass>
          <CardHeader>
            <CardTitle>
              {activeTab === "details" && "Trade Details"}
              {activeTab === "summary" && "Trade Summary"}
              {activeTab === "positions" && "Open Positions"}
              {activeTab === "metrics" && "Performance Metrics"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable 
              data={getCurrentData()}
              onView={handleViewTrade}
              onEdit={handleEditTrade}
              onDelete={handleDeleteTrade}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Trade Details Modal */}
      <TradeModal 
        trade={selectedTrade}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTrade}
        isEditMode={isEditMode}
      />
    </div>
  );
}
