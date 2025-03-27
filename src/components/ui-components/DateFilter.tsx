
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeSelector } from "./DateRangeSelector";
import { DateRange } from "react-day-picker";

interface DateFilterProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateFilter({ dateRange, onDateRangeChange, className }: DateFilterProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Filter by Date</CardTitle>
      </CardHeader>
      <CardContent>
        <DateRangeSelector 
          dateRange={dateRange}
          onChange={onDateRangeChange}
        />
      </CardContent>
    </Card>
  );
}
