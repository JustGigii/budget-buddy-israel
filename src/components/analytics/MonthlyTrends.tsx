import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/types';
import { format, startOfMonth, eachMonthOfInterval, startOfYear, endOfMonth } from 'date-fns';
import { he } from 'date-fns/locale';

interface MonthlyTrendsProps {
  expenses: Expense[];
}

export function MonthlyTrends({ expenses }: MonthlyTrendsProps) {
  const currentYear = new Date().getFullYear();
  const yearStart = startOfYear(new Date());
  const yearEnd = new Date();
  
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });
  
  const monthlyData = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    });
    
    const total = monthExpenses.reduce((sum, expense) => sum + expense.amountILS, 0);
    const count = monthExpenses.length;
    
    return {
      month: format(month, 'MMM', { locale: he }),
      total,
      count,
      average: count > 0 ? total / count : 0,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary rtl-numbers">
            סה״כ: ₪{payload[0].value.toLocaleString()}
          </p>
          <p className="text-accent rtl-numbers">
            כמות הוצאות: {payload[1]?.value || 0}
          </p>
          <p className="text-muted-foreground rtl-numbers">
            ממוצע: ₪{Math.round(payload[0].value / (payload[1]?.value || 1)).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>מגמות חודשיות - סכומים</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickFormatter={(value) => `₪${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>כמות הוצאות חודשית</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value, name) => [value, 'כמות הוצאות']}
                labelStyle={{ direction: 'rtl' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(var(--accent))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--accent))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card lg:col-span-2">
        <CardHeader>
          <CardTitle>סטטיסטיקות חודשיות מפורטות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {monthlyData.map((month) => (
              <div key={month.month} className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium text-center mb-2">{month.month}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>סה״כ:</span>
                    <span className="font-medium rtl-numbers">₪{month.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>הוצאות:</span>
                    <span className="font-medium rtl-numbers">{month.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ממוצע:</span>
                    <span className="font-medium rtl-numbers">₪{Math.round(month.average).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}