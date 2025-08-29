import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/types';

interface ExpensesByCategoryProps {
  expenses: Expense[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))', 
  'hsl(var(--warning))',
  'hsl(var(--success))',
  'hsl(var(--muted-foreground))',
  'hsl(var(--destructive))',
];

export function ExpensesByCategory({ expenses }: ExpensesByCategoryProps) {
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amountILS;
    } else {
      acc.push({
        name: expense.category,
        value: expense.amountILS,
      });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const sortedData = categoryData.sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-primary rtl-numbers">
            ₪{payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            {((payload[0].value / expenses.reduce((sum, e) => sum + e.amountILS, 0)) * 100).toFixed(1)}%
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
          <CardTitle className="flex items-center gap-2">
            <span>התפלגות לפי קטגוריות</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>פירוט קטגוריות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedData.map((category, index) => {
              const total = expenses.reduce((sum, e) => sum + e.amountILS, 0);
              const percentage = (category.value / total) * 100;
              
              return (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground rtl-numbers">
                      ₪{category.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-right rtl-numbers">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}