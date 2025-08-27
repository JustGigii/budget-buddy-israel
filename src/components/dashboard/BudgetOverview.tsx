import { TrendingDown, TrendingUp, Target, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useStore } from '@/store/useStore';

export function BudgetOverview() {
  const { trip, users } = useStore();
  
  const budgetUsedPercentage = (trip.totalExpenses / trip.budget) * 100;
  const isOverBudget = budgetUsedPercentage > 100;
  const remainingDays = 180; // Mock - 6 months trip
  const dailyBudget = trip.remainingBudget / remainingDays;
  
  // Calculate individual budget usage percentages
  const omriUsagePercentage = Math.min((users[0]?.totalPaid || 0) / trip.budget * 100, 100);
  const noaUsagePercentage = Math.min((users[1]?.totalPaid || 0) / trip.budget * 100, 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* עמרי */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            סטטוס עמרי
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* סכום ששילם */}
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="text-sm text-primary/80 mb-1">שילם עד כה</div>
            <div className="text-2xl font-bold text-primary rtl-numbers">
              ₪{users[0]?.totalPaid?.toLocaleString() || '0'}
            </div>
          </div>

          {/* מד שימוש בתקציב */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">שימוש בתקציב</span>
              <span className="text-sm font-bold text-primary rtl-numbers">
                {omriUsagePercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={omriUsagePercentage} className="h-2" />
          </div>

          {/* יתרה */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {users[0]?.netBalance > 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-warning" />
                )}
                <span className="text-sm font-medium">
                  {users[0]?.netBalance > 0 ? 'זוכה' : users[0]?.netBalance < 0 ? 'חייב' : 'מאוזן'}
                </span>
              </div>
              
              <span className={`font-bold rtl-numbers ${
                users[0]?.netBalance > 0 ? 'text-success' : users[0]?.netBalance < 0 ? 'text-warning' : 'text-muted-foreground'
              }`}>
                ₪{Math.abs(users[0]?.netBalance || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* נועה */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-secondary" />
            סטטוס נועה
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* סכום ששילמה */}
          <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
            <div className="text-sm text-secondary/80 mb-1">שילמה עד כה</div>
            <div className="text-2xl font-bold text-secondary rtl-numbers">
              ₪{users[1]?.totalPaid?.toLocaleString() || '0'}
            </div>
          </div>

          {/* מד שימוש בתקציב */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">שימוש בתקציב</span>
              <span className="text-sm font-bold text-secondary rtl-numbers">
                {noaUsagePercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={noaUsagePercentage} className="h-2" />
          </div>

          {/* יתרה */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {users[1]?.netBalance > 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-warning" />
                )}
                <span className="text-sm font-medium">
                  {users[1]?.netBalance > 0 ? 'זוכה' : users[1]?.netBalance < 0 ? 'חייבת' : 'מאוזנת'}
                </span>
              </div>
              
              <span className={`font-bold rtl-numbers ${
                users[1]?.netBalance > 0 ? 'text-success' : users[1]?.netBalance < 0 ? 'text-warning' : 'text-muted-foreground'
              }`}>
                ₪{Math.abs(users[1]?.netBalance || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}