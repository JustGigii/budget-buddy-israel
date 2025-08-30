import { useState, useCallback, useEffect } from 'react';
import { Search, Filter, Calendar, Trash2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/store/useStore';
import { CATEGORIES, CURRENCIES,COUNTRYS } from '@/types';
import { format, set } from 'date-fns';
import { he } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

export function ExpensesList() {
  // ⬇️ הוספנו trip כדי שנוכל להעביר trip.id למחיקה
  const { trip, expenses,users, deleteExpense } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPayer, setSelectedPayer] = useState<string>('');
  const [splitType, setsplitType] = useState<string>('');
  const { toast } = useToast();
  const [user1,user2] = users;


  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch =
      expense.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || expense.category === selectedCategory;
    const matchesPayer = !selectedPayer || expense.payer === selectedPayer;
    const matchsplitType = !splitType || expense.splitType === splitType;
    return matchesSearch && matchesCategory && matchesPayer&&matchsplitType;
  });

  const getCategoryInfo = (category: string) =>
    CATEGORIES.find(cat => cat.key === category) || CATEGORIES[5]; // 'אחר'

  const getCurrencySymbol = (code: string) =>
    CURRENCIES.find(curr => curr.code === code)?.symbol || code;

  // ⬇️ מתקנים את הקריאה כך שתשתמש ב-trip.id, עם הגנות
  const handleDeleteExpense = useCallback(
    async (expenseId: string, merchant: string) => {
      if (!trip?.id) {
        console.error('Missing trip.id – ודא שהפעלת init(tripId) בעליית האפליקציה');
        toast({
          title: 'שגיאה',
          description: 'לא נמצא Trip פעיל. נסה לרענן את הדף.',
          variant: 'destructive',
        });
        return;
      }
      if (!expenseId) {
        console.error('Missing expenseId');
        return;
      }


      await deleteExpense(trip.id, expenseId);
      toast({
        title: 'הוצאה נמחקה',
        description: `הוצאה של ${merchant} נמחקה בהצלחה`,
      });
    },
    [trip?.id, deleteExpense, toast]
  );

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedPayer('');
    setsplitType('');
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>הוצאות אחרונות</span>
          <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs self-start sm:self-auto">
            <X className="h-3 w-3 ml-1" />
            נקה סינונים
          </Button>
        </CardTitle>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חיפוש לפי ספק או הערות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-col sm:flex-row">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="קטגוריה" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.key} value={category.key}>
                    <span className="flex items-center gap-2">
                      <span>{category.emoji}</span>
                      <span>{category.key}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2  sm:flex-row">
            <Select value={selectedPayer} onValueChange={setSelectedPayer}>
              <SelectTrigger className="w-full sm:w-[100px]">
                <SelectValue placeholder="משלם" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={user1.name}>{user1.hebName}</SelectItem>
                <SelectItem value={user2.name}>{user2.hebName}</SelectItem>
              </SelectContent>
            </Select>
              <Select value={splitType} onValueChange={setsplitType}>
              <SelectTrigger className="w-full sm:w-[100px]">
                <SelectValue placeholder="סוג חלוקה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equal">חצי חצי</SelectItem>
                <SelectItem value="personal">פרטי</SelectItem>
              </SelectContent>
            </Select>
            </div>
          </div>
        </div>
        
      </CardHeader>
                
      <CardContent className="space-y-3 h-[500px] overflow-y-auto ">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">לא נמצאו הוצאות</div>
        ) : (
        filteredExpenses.map((expense) => {
            const categoryInfo = getCategoryInfo(expense.category);
            return (
              <div
                key={expense.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth group gap-3"
              >
                <div className="flex items-start gap-3 flex-1">
                  
                  <span className="text-2xl">{categoryInfo.emoji}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                     <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{expense.merchant}</h4>
                     
                      </div>
                      <Badge variant="outline" className={`${categoryInfo.color} text-xs flex-shrink-0`}>
                        {expense.category}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{format(expense.date, 'dd/MM/yyyy', { locale: he })}</span>
                      <span>•</span>
                      <span>{expense.hebpayer}</span>
                      <span>•</span>
                      <span>{expense.splitType === 'equal' ? 'חצי-חצי' : 'פרטי'}</span>
                      
                    </div>

                    {expense.notes && (
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">{expense.notes}</p>
                    )}
                  </div>
                   <h4>{COUNTRYS.find((country) => country.key === expense.country)?.emoji}</h4>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <div className="text-right flex-shrink-0">
                    <div className="font-semibold rtl-numbers">₪{expense.amountILS}</div>
                    {expense.currencyOriginal !== 'ILS' && (
                      <div className="text-xs sm:text-sm text-muted-foreground rtl-numbers">
                        {getCurrencySymbol(expense.currencyOriginal)}
                        {expense.amountOriginal.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteExpense(expense.id, expense.merchant)}
                    className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
