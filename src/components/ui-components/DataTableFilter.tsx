
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  traderFilter: string;
  setTraderFilter: (trader: string) => void;
  uniqueTraders: string[];
}

export function DataTableFilter({
  searchTerm,
  setSearchTerm,
  traderFilter,
  setTraderFilter,
  uniqueTraders,
}: DataTableFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      
      {/* Trader Filter */}
      <div className="w-full md:w-64">
        <Select
          value={traderFilter}
          onValueChange={setTraderFilter}
        >
          <SelectTrigger className="w-full">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by Trader" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Traders</SelectItem>
            {uniqueTraders.map((trader) => (
              <SelectItem key={trader} value={trader}>
                {trader}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
