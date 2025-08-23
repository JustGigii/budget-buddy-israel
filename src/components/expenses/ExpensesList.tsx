import { useState } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { CATEGORIES, CURRENCIES } from '@/types';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

export function ExpensesList() {
  const { expenses } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExpenses = expenses.filter(expense =>
    expense.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryInfo = (category: string) => {
    return CATEGORIES.find(cat => cat.key === category) || CATEGORIES[5]; // Default to 'אחר'
  };

  const getCurrencySymbol = (code: string) => {
    return CURRENCIES.find(curr => curr.code === code)?.symbol || code;
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>הוצאות אחרונות</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 ml-1" />
              סינון
            </Button>
          </div>
        </CardTitle>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש לפי ספק או הערות..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            לא נמצאו הוצאות
          </div>
        ) : (
          filteredExpenses.map((expense) => {
            const categoryInfo = getCategoryInfo(expense.category);
            return (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{categoryInfo.emoji}</span>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{expense.merchant}</h4>
                      <Badge variant="outline" className={categoryInfo.color}>
                        {expense.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{format(expense.date, 'dd/MM/yyyy', { locale: he })}</span>
                      <span>•</span>
                      <span>{expense.payer} שילם</span>
                      <span>•</span>
                      <span>{expense.splitType === 'equal' ? 'חצי-חצי' : 'פרטי'}</span>
                    </div>
                    
                    {expense.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{expense.notes}</p>
                    )}
                  </div>
                </div>

                <div className="text-left">
                  <div className="font-semibold rtl-numbers">₪{expense.amountILS}</div>
                  {expense.currencyOriginal !== 'ILS' && (
                    <div className="text-sm text-muted-foreground rtl-numbers">
                      {getCurrencySymbol(expense.currencyOriginal)}{expense.amountOriginal.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}