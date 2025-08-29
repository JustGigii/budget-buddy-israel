import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Expense } from '@/types';

interface UserComparisonProps {
  users: User[];
  expenses: Expense[];
}

export function UserComparison({ users, expenses }: UserComparisonProps) {
  const userData = users.map(user => {
    const userExpenses = expenses.filter(expense => expense.payer === user.name);
    const categoryBreakdown = userExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amountILS;
      return acc;
    }, {} as Record<string, number>);
    
    const totalCount = userExpenses.length;
    const avgPerExpense = totalCount > 0 ? user.totalPaid / totalCount : 0;
    
    return {
      name: user.hebName,
      totalPaid: user.totalPaid,
      totalOwed: user.totalOwed,
      netBalance: user.netBalance,
      expenseCount: totalCount,
      avgPerExpense,
      color: user.color,
      categoryBreakdown,
    };
  });

  const categories = Array.from(
    new Set(expenses.map(expense => expense.category))
  );

  const categoryComparisonData = categories.map(category => {
    const data: any = { category };
    users.forEach(user => {
      const userCategoryExpenses = expenses
        .filter(expense => expense.payer === user.name && expense.category === category)
        .reduce((sum, expense) => sum + expense.amountILS, 0);
      data[user.hebName] = userCategoryExpenses;
    });
    return data;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="rtl-numbers">
              {entry.dataKey}: ₪{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Overview Comparison */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>השוואה כללית</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₪${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="totalPaid" fill="hsl(var(--primary))" name="סה״כ שילם" />
              <Bar dataKey="totalOwed" fill="hsl(var(--accent))" name="סה״כ חייב" />
              <Bar dataKey="netBalance" fill="hsl(var(--warning))" name="יתרה" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>השוואה לפי קטגוריות</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryComparisonData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                type="number" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₪${(value / 1000).toFixed(0)}K`}
              />
              <YAxis 
                type="category" 
                dataKey="category" 
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              {users.map((user, index) => (
                <Bar 
                  key={user.id}
                  dataKey={user.hebName} 
                  fill={index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userData.map((user) => (
          <Card key={user.name} className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>סטטיסטיקות {user.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">סה״כ שילם:</span>
                    <div className="font-bold text-primary rtl-numbers">
                      ₪{user.totalPaid.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">כמות הוצאות:</span>
                    <div className="font-bold text-accent rtl-numbers">
                      {user.expenseCount}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ממוצע להוצאה:</span>
                    <div className="font-bold text-warning rtl-numbers">
                      ₪{Math.round(user.avgPerExpense).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">יתרה נטו:</span>
                    <div className={`font-bold rtl-numbers ${
                      user.netBalance > 0 ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      ₪{user.netBalance.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">פילוח לפי קטגוריות:</h4>
                  <div className="space-y-2">
                    {Object.entries(user.categoryBreakdown)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 3)
                      .map(([category, amount]) => (
                      <div key={category} className="flex justify-between text-sm">
                        <span>{category}</span>
                        <span className="font-medium rtl-numbers">₪{amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}