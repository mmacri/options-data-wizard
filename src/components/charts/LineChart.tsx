
import { Line, LineChart as RechartsLineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title?: string;
  className?: string;
  color?: string;
}

export function LineChart({ 
  data, 
  xKey, 
  yKey, 
  title, 
  className,
  color = "hsl(var(--primary))"
}: LineChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [animatedData, setAnimatedData] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      // Format dates if xKey values are date strings
      const formattedData = data.map(item => {
        const newItem = { ...item };
        if (typeof newItem[xKey] === 'string' && newItem[xKey].includes('-')) {
          try {
            const date = new Date(newItem[xKey]);
            if (!isNaN(date.getTime())) {
              newItem[`${xKey}Formatted`] = date.toLocaleDateString();
            }
          } catch (e) {
            // If date parsing fails, use the original value
          }
        }
        return newItem;
      });
      setChartData(formattedData);
      
      // Animate chart by incrementally showing data points
      const animateChart = () => {
        const intervalId = setInterval(() => {
          setAnimatedData(prev => {
            if (prev.length >= formattedData.length) {
              clearInterval(intervalId);
              return formattedData;
            }
            return [...prev, formattedData[prev.length]];
          });
        }, 50);
        
        return () => clearInterval(intervalId);
      };
      
      setAnimatedData([]);
      const cleanup = animateChart();
      
      return cleanup;
    }
  }, [data, xKey, yKey]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatAxisValue = (value: number) => {
    return formatCurrency(value);
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/80 backdrop-blur-sm shadow-md border border-border px-4 py-3 rounded-lg">
          <p className="font-medium text-sm">
            {`${payload[0].payload[`${xKey}Formatted`] || label}`}
          </p>
          <p className="text-sm text-primary font-semibold">
            {formatCurrency(payload[0].value)}
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
        <RechartsLineChart
          data={animatedData}
          margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis 
            dataKey={`${xKey}Formatted` in (chartData[0] || {}) ? `${xKey}Formatted` : xKey} 
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis 
            tickFormatter={formatAxisValue}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <Tooltip content={customTooltip} />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0, fill: color }}
            animationDuration={1000}
            animationEasing="ease-out"
            name="Value"
            fill="url(#colorGradient)"
            fillOpacity={0.6}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
