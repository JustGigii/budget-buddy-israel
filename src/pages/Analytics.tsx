import { useState } from 'react';
import { TrendingUp, DollarSign, PieChart, BarChart3, Calendar, Target, SnailIcon, ReceiptText, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/store/useStore';
import { ExpensesByCategory } from '@/components/analytics/ExpensesByCategory';

import { DailySpending } from '@/components/analytics/DailySpending';
import {  COUNTRYS } from '@/types';
const Analytics = () => {
  const { users, expenses, trip } = useStore();
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedcountry, setSelectedcountry] = useState<string>('all');
  const filteredExpenses = selectedUser === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.payer === selectedUser);
  const filteredExpensesByContrey = selectedcountry === 'all' 
    ? filteredExpenses 
    : filteredExpenses.filter(expense => expense.country === selectedcountry);
  const totalExpenses = selectedUser === 'all' ? expenses.reduce((sum, expense) => sum + expense.amountILS, 0) : filteredExpensesByContrey.filter(expense => expense.payer === selectedUser).reduce((sum, expense) => sum + expense.amountILS, 0);
  const todayExpenses = filteredExpensesByContrey.filter(expense => (expense.date.getFullYear() === new Date().getFullYear() && 
                                                          expense.date.getMonth() === new Date().getMonth() &&
                                                          expense.date.getDate() === new Date().getDate()))
                                                         .reduce((sum, expense) => sum + expense.amountILS, 0);
  
  const categoryStats = filteredExpensesByContrey.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amountILS;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryStats).sort(([,a], [,b]) => b - a)[0];

  return (
    
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ניתוח הוצאות</h1>
            <p className="text-muted-foreground">תובנות מפורטות על ההוצאות שלכם</p>
          </div>
          <div className=" flex flex-row  gap-3  justify-between w-full">
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="בחר משתמש" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל המשתמשים</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.name}>
                  {user.hebName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Select value={selectedcountry} onValueChange={setSelectedcountry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="בחר מדינה" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל המדניות</SelectItem>
              {COUNTRYS.map((counrty,index) => (
                <SelectItem key={index } value={counrty.key}>
                  {counrty.key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">סה״כ הוצאות</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary rtl-numbers">
                ₪{totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedUser === 'all' ? 'כל המשתמשים' : users.find(u => u.name === selectedUser)?.hebName}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">שלום היום </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent rtl-numbers">
                ₪{Math.round(todayExpenses).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
               שולם היום
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">קטגוריה מובילה</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-primary">
                {topCategory?.[0] || 'אין נתונים'}
              </div>
              <p className="text-xs text-muted-foreground rtl-numbers">
                ₪{topCategory?.[1]?.toLocaleString() || '0'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">מתקציב</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning rtl-numbers">
                {((totalExpenses / trip.budget) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                מהתקציב הכולל
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Tabs */}
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">קטגוריות</TabsTrigger>

      
            <TabsTrigger value="daily">יומי</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="space-y-4">
            <ExpensesByCategory expenses={filteredExpenses} />
          </TabsContent>
          

          <TabsContent value="daily" className="space-y-4">
            <DailySpending expenses={filteredExpenses} />
          </TabsContent>
        </Tabs>
      </div>
   
  );
};

export default Analytics;