
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useLocalStorage from "@/hooks/useLocalStorage";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type DateRangeOption = {
  value: string;
  label: string;
  days?: number;
};

interface DateRangeSelectorProps {
  onRangeChange: (fromDate: Date | undefined, toDate: Date | undefined) => void;
}

export function DateRangeSelector({ onRangeChange }: DateRangeSelectorProps) {
  const [settings] = useLocalStorage("userSettings", {
    defaultDateRange: "30days" as string
  });
  
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  
  const [selectedPreset, setSelectedPreset] = useState<string>(
    settings.defaultDateRange || "30days"
  );
  
  const dateRangeOptions: DateRangeOption[] = [
    { value: "7days", label: "Last 7 days", days: 7 },
    { value: "30days", label: "Last 30 days", days: 30 },
    { value: "90days", label: "Last 90 days", days: 90 },
    { value: "180days", label: "Last 180 days", days: 180 },
    { value: "1year", label: "Last year", days: 365 },
    { value: "all", label: "All time" },
    { value: "custom", label: "Custom range" },
  ];

  useEffect(() => {
    // Set initial date range based on default setting
    handlePresetChange(selectedPreset);
  }, []);

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    
    if (value === "custom") {
      // If custom is selected, don't update the date range
      return;
    }
    
    if (value === "all") {
      // If "all time" is selected, clear the date range
      setDateRange({ from: undefined, to: undefined });
      onRangeChange(undefined, undefined);
      return;
    }
    
    const option = dateRangeOptions.find(opt => opt.value === value);
    if (option && option.days) {
      const today = new Date();
      const fromDate = new Date();
      fromDate.setDate(today.getDate() - option.days);
      
      setDateRange({ from: fromDate, to: today });
      onRangeChange(fromDate, today);
    }
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    
    if (range.from || range.to) {
      setSelectedPreset("custom");
    }
    
    onRangeChange(range.from, range.to);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <Select value={selectedPreset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          {dateRangeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full sm:w-[240px] justify-start text-left font-normal",
              !dateRange.from && !dateRange.to && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMM d, yyyy")} -{" "}
                  {format(dateRange.to, "MMM d, yyyy")}
                </>
              ) : (
                format(dateRange.from, "MMM d, yyyy")
              )
            ) : (
              <span>All time</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={handleDateRangeChange}
            numberOfMonths={2}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
