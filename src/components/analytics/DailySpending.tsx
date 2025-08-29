import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/types';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isToday, isYesterday } from 'date-fns';
import { he } from 'date-fns/locale';

interface DailySpendingProps {
  expenses: Expense[];
}

export function DailySpending({ expenses }: DailySpendingProps) {
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const dailyData = daysInMonth.map(day => {
    const dayExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return format(expenseDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
    
    const total = dayExpenses.reduce((sum, expense) => sum + expense.amountILS, 0);
    const count = dayExpenses.length;
    
    return {
      date: format(day, 'dd/MM'),
      fullDate: day,
      total,
      count,
      isToday: isToday(day),
      isYesterday: isYesterday(day),
      dayName: format(day, 'EEE', { locale: he }),
    };
  });
  const totalweek = (date) => {
  const now = new Date();

  // למצוא את יום ראשון של השבוע הנוכחי
  const dayOfWeek = now.getDay(); // 0 = ראשון, 6 = שבת
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - dayOfWeek);

  // למצוא את שבת של השבוע הנוכחי
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);

  // לבדוק אם התאריך נמצא בטווח
  return date >= sunday && date <= saturday;
}
const weekelypay = expenses.filter(expense => { 
  const expenseDate = new Date(expense.date);
  return totalweek(expenseDate);
}).reduce((sum, expense) => sum + expense.amountILS, 0);

  // Get expenses by hour of day
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const hourExpenses = expenses.filter(expense => {
      const expenseHour = new Date(expense.date).getHours();
      return expenseHour === hour;
    });
    
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      total: hourExpenses.reduce((sum, expense) => sum + expense.amountILS, 0),
      count: hourExpenses.length,
    };
  });

  const weekdayData = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map((day, index) => {
    const dayExpenses = expenses.filter(expense => {
      return new Date(expense.date).getDay() === index;
    });
    
    return {
      day,
      total: dayExpenses.reduce((sum, expense) => sum + expense.amountILS, 0),
      count: dayExpenses.length,
      average: dayExpenses.length > 0 ? dayExpenses.reduce((sum, expense) => sum + expense.amountILS, 0) / dayExpenses.length : 0,
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
          {payload[1] && (
            <p className="text-accent rtl-numbers">
              הוצאות: {payload[1].value}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Daily Spending This Month */}
     

   

      {/* Today's Summary */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>סיכום יומי</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dailyData
              .filter(day => day.isToday || day.isYesterday)
              .map((day) => (
                <div key={day.date} className={`p-4 rounded-lg  ${
                  day.isToday ? 'bg-primary/10 border border-primary/20 '  : 'bg-muted border border-muted/0.1' 
                }`}>

                  <h4 className="  font-medium mb-2">
                    {day.isToday ? 'היום' : 'אתמול'}
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium rtl-numbers">₪{day.total.toLocaleString()}</span>
                      <span>:סה״כ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium rtl-numbers">{day.count}</span>
                      <span>:הוצאות</span>
                    </div>
                  </div>
                </div>
              ))}
            
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <h4 className="font-medium mb-2">ממוצע יומי</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>סכום:</span>
                  <span className="font-medium rtl-numbers">
                    ₪{Math.round(expenses.reduce((sum, e) => sum + e.amountILS, 0) / Math.max(1, new Date().getDate())).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>הוצאות:</span>
                  <span className="font-medium rtl-numbers">
                    {Math.round(expenses.length / Math.max(1, new Date().getDate()))}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
              <h4 className="font-medium mb-2">השבוע</h4>
              {(() => {
                const maxDay = expenses.reduce((index, expense) => totalweek(expense.date) ? index+ 1 : index,0);
                return (
                  <div className="space-y-1 text-sm ">

                    <div className="flex justify-between">
                      <span className="font-medium rtl-numbers">₪{weekelypay.toLocaleString()}</span>
                      <span>:סכום</span>
                    </div>
                                        <div className="flex justify-between ">
                      <span className="font-medium">{maxDay}</span>
                      <span >:הוצאות</span>
                    </div>
                  </div>
                  
                );
              })()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}