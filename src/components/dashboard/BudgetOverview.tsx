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
  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* עמרי */}
      <Card className="shadow-card">

        <CardContent className="space-y-4">
           {users.map((user,index) => ( 
            <div key={user.id || index}>
          {/* סכום ששילם */}
                  <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className={`h-5 w-5 text-${user.color}`} />
            סטטוס {user.hebName}
          </CardTitle>
        </CardHeader>
        
          <div className={`p-3 bg-${user.color}/10 rounded-lg border border-${user.color}/20`}>
            <div className={`text-sm text-${user.color}/80 mb-1`}>שילם עד כה</div>
            <div className={`text-2xl font-bold text-${user.color} rtl-numbers`}>
           
              
          
              ₪{user?.totalPaid?.toLocaleString() || '0'}
            </div>
          </div>

          {/* מד שימוש בתקציב */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">שימוש בתקציב</span>
              <span className="text-sm font-bold text-primary rtl-numbers">
                { Math.min((user?.totalPaid || 0) / trip.budget * 100, 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={ Math.min((user?.totalPaid || 0) / trip.budget * 100, 100)} className="h-2" />
          </div>

          {/* יתרה */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />

                <span className="text-sm font-medium">
                  יתרה
                </span>
              </div>
              
              <span className={`font-bold rtl-numbers ${
                trip.budget - 3000- (user?.totalPaid  || 0) > 0 ? 'text-success' : user?.netBalance > 0 ? 'text-warning' : 'text-muted-foreground'
              }`}>
                ₪{trip.budget - (user?.totalPaid || 0)}
              </span>
            </div>
          </div>
          </div>
            ))}
        </CardContent>
      </Card>

    
 
    </div>
  );
}