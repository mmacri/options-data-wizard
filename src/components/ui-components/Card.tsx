
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export function Card({ children, className, glass = false, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "rounded-lg border bg-card p-6 shadow transition-all duration-200 hover:shadow-md",
        glass && "glass-card",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div 
      className={cn("flex flex-col space-y-1 pb-4", className)} 
      {...props} 
    />
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3 
      className={cn("text-lg font-medium leading-none tracking-tight", className)} 
      {...props} 
    />
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p 
      className={cn("text-sm text-muted-foreground", className)} 
      {...props} 
    />
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div 
      className={cn("pt-0", className)} 
      {...props} 
    />
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div 
      className={cn("flex items-center pt-4", className)} 
      {...props} 
    />
  );
}
