
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useLocalStorage from "@/hooks/useLocalStorage";
import { DateRange } from "react-day-picker";

type DateRangeOption = {
  value: string;
  label: string;
  days?: number;
};

interface DateRangeSelectorProps {
  dateRange: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangeSelector({ dateRange, onChange, className }: DateRangeSelectorProps) {
  const [settings] = useLocalStorage("userSettings", {
    defaultDateRange: "30days" as string
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
    if (!dateRange?.from && !dateRange?.to) {
      handlePresetChange(selectedPreset);
    }
  }, []);

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    
    if (value === "custom") {
      // If custom is selected, don't update the date range
      return;
    }
    
    if (value === "all") {
      // If "all time" is selected, clear the date range
      onChange(undefined);
      return;
    }
    
    const option = dateRangeOptions.find(opt => opt.value === value);
    if (option && option.days) {
      const today = new Date();
      const fromDate = new Date();
      fromDate.setDate(today.getDate() - option.days);
      
      onChange({ from: fromDate, to: today });
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from || range?.to) {
      setSelectedPreset("custom");
    }
    
    onChange(range);
  };

  return (
    <div className={cn("flex flex-col sm:flex-row gap-2 w-full", className)}>
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
              !dateRange?.from && !dateRange?.to && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
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
            defaultMonth={dateRange?.from}
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
