import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'primary';
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  variant = 'default',
  className = '' 
}: StatsCardProps) {
  const variantStyles = {
    default: 'bg-card',
    success: 'bg-gradient-to-br from-success/10 to-success/5 border-success/20',
    warning: 'bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20',
    primary: 'gradient-primary text-primary-foreground border-primary/20'
  };

  const textStyles = {
    default: 'text-foreground',
    success: 'text-success',
    warning: 'text-warning',
    primary: 'text-primary-foreground'
  };

  return (
    <Card className={`shadow-card transition-smooth hover:shadow-elegant ${variantStyles[variant]} ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-sm font-medium ${variant === 'primary' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
            {title}
          </h3>
          {icon && (
            <div className={`${variant === 'primary' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
              {icon}
            </div>
          )}
        </div>
        
        <div className={`text-2xl font-bold mb-1 ${textStyles[variant]} rtl-numbers`}>
          {value}
        </div>
        
        {subtitle && (
          <p className={`text-xs ${variant === 'primary' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}