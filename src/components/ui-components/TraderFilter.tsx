
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TraderFilterProps {
  traderFilter: string;
  setTraderFilter: (trader: string) => void;
  uniqueTraders: string[];
  className?: string;
}

export function TraderFilter({
  traderFilter,
  setTraderFilter,
  uniqueTraders,
  className
}: TraderFilterProps) {
  return (
    <div className={className}>
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
  );
}
