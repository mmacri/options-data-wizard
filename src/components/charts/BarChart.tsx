
import { BarChart as RechartsBarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title?: string;
  className?: string;
  color?: string;
  labelFormatter?: (value: any) => string;
  valueColor?: (value: any) => string;
}

export function BarChart({ 
  data, 
  xKey, 
  yKey, 
  title, 
  className,
  color = "hsl(var(--primary))",
  labelFormatter,
  valueColor
}: BarChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [animatedData, setAnimatedData] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setChartData(data);
      
      // Animate chart by incrementally showing bars
      const animateChart = () => {
        const intervalId = setInterval(() => {
          setAnimatedData(prev => {
            if (prev.length >= data.length) {
              clearInterval(intervalId);
              return data;
            }
            return [...prev, data[prev.length]];
          });
        }, 50);
        
        return () => clearInterval(intervalId);
      };
      
      setAnimatedData([]);
      const cleanup = animateChart();
      
      return cleanup;
    }
  }, [data, xKey, yKey]);
  
  const formatValue = (value: number) => {
    if (labelFormatter) {
      return labelFormatter(value);
    }
    
    if (Math.abs(value) >= 1000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(value);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  const getBarFill = (value: number) => {
    if (valueColor) {
      return valueColor(value);
    }
    return value >= 0 ? color : "hsl(var(--destructive))";
  };
  
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/80 backdrop-blur-sm shadow-md border border-border px-4 py-3 rounded-lg">
          <p className="font-medium text-sm">
            {label}
          </p>
          <p 
            className="text-sm font-semibold"
            style={{ color: getBarFill(payload[0].value) }}
          >
            {formatValue(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("w-full h-full min-h-[300px]", className)}>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={animatedData}
          margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
          barGap={8}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={color} stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis 
            dataKey={xKey} 
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis 
            tickFormatter={(value) => formatValue(value)}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <Tooltip content={customTooltip} />
          <Bar 
            dataKey={yKey} 
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationEasing="ease-out"
            name="Value"
            stroke={color}
            fill="url(#barGradient)"
            fillOpacity={0.8}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
