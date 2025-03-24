
import { PieChart as RechartsPieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PieChartProps {
  data: {
    name: string;
    value: number;
    color?: string;
  }[];
  title?: string;
  className?: string;
}

export function PieChart({ data, title, className }: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Default colors if not provided
  const defaultColors = [
    "hsl(var(--primary))",
    "hsl(var(--success))",
    "hsl(var(--warning))",
    "hsl(var(--destructive))",
    "hsl(var(--accent))"
  ];
  
  useEffect(() => {
    if (data) {
      // Add default colors if not provided
      const dataWithColors = data.map((item, index) => ({
        ...item,
        color: item.color || defaultColors[index % defaultColors.length]
      }));
      
      setChartData([]);
      
      // Animate chart by incrementally showing data points
      const intervalId = setInterval(() => {
        setChartData(prev => {
          if (prev.length >= dataWithColors.length) {
            clearInterval(intervalId);
            return dataWithColors;
          }
          return [...prev, dataWithColors[prev.length]];
        });
      }, 100);
      
      return () => clearInterval(intervalId);
    }
  }, [data]);
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };
  
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/80 backdrop-blur-sm shadow-md border border-border px-4 py-3 rounded-lg">
          <p className="font-medium text-sm">
            {payload[0].name}
          </p>
          <p className="text-sm font-semibold" style={{ color: payload[0].payload.color }}>
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <div className={cn("w-full h-full min-h-[300px]", className)}>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius="70%"
            innerRadius="40%"
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                style={{
                  filter: activeIndex === index ? 'drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.5))' : 'none',
                  transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: '50% 50%',
                  transition: 'transform 0.2s ease-out'
                }}
              />
            ))}
          </Pie>
          <Tooltip content={customTooltip} />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            formatter={(value, entry, index) => (
              <span className="text-sm text-foreground">{value}</span>
            )}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
