import { TrendingDown, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useStore } from '@/store/useStore';

export function BudgetOverview() {
  const { trip } = useStore();
  
  const budgetUsedPercentage = (trip.totalExpenses / trip.budget) * 100;
  const isOverBudget = budgetUsedPercentage > 100;
  const remainingDays = 180; // Mock - 6 months trip
  const dailyBudget = trip.remainingBudget / remainingDays;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          סטטוס תקציב
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Budget Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">תקציב מנוצל</span>
            <span className="text-sm font-medium rtl-numbers">
              {budgetUsedPercentage.toFixed(1)}%
            </span>
          </div>
          
          <Progress 
            value={Math.min(budgetUsedPercentage, 100)} 
            className="h-2"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span className="rtl-numbers">₪{trip.totalExpenses.toLocaleString()}</span>
            <span className="rtl-numbers">₪{trip.budget.toLocaleString()}</span>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOverBudget ? (
                <TrendingDown className="h-4 w-4 text-destructive" />
              ) : (
                <TrendingUp className="h-4 w-4 text-success" />
              )}
              <span className="text-sm font-medium">
                {isOverBudget ? 'חריגה מהתקציב' : 'נשאר בתקציב'}
              </span>
            </div>
            
            <span className={`font-bold rtl-numbers ${
              isOverBudget ? 'text-destructive' : 'text-success'
            }`}>
              ₪{Math.abs(trip.remainingBudget).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Daily Budget */}
        {!isOverBudget && (
          <div className="text-center p-3 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">תקציב יומי משוער</div>
            <div className="text-lg font-semibold rtl-numbers">₪{Math.round(dailyBudget)}</div>
            <div className="text-xs text-muted-foreground">
              ל-{remainingDays} ימים נותרים
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}