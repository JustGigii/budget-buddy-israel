import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Users, Plus } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { BudgetOverview } from '@/components/dashboard/BudgetOverview';
import { ExpensesList } from '@/components/expenses/ExpensesList';
import { AddExpenseSheet } from '@/components/expenses/AddExpenseSheet';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

const Index = () => {
  const { trip, users, calculateBalances } = useStore();
  const [showAddExpense, setShowAddExpense] = useState(false);

  useEffect(() => {
    calculateBalances();
  }, [calculateBalances]);

  const totalPaid = users.reduce((sum, user) => sum + user.totalPaid, 0);
  const averageExpense = totalPaid / (users[0].totalPaid > 0 || users[1].totalPaid > 0 ? 
    (users[0].totalPaid > 0 ? 1 : 0) + (users[1].totalPaid > 0 ? 1 : 0) : 1);

  return (
    <div className="min-h-screen gradient-warm">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">דשבורד</h1>
          <Button 
            onClick={() => setShowAddExpense(true)}
            className="gradient-primary hover:shadow-elegant transition-bounce"
          >
            <Plus className="h-4 w-4 ml-1" />
            הוספת הוצאה
          </Button>
        </div>
        {/* Balance Card - Main focus */}
        <BalanceCard />
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="סה״כ הוצאות"
            value={`₪${trip.totalExpenses.toLocaleString()}`}
            subtitle="מתחילת הטיול"
            icon={<Wallet className="h-5 w-5" />}
            variant="primary"
          />
          
          <StatsCard
            title="נשאר בתקציב"
            value={`₪${trip.remainingBudget.toLocaleString()}`}
            subtitle={`מתוך ₪${trip.budget.toLocaleString()}`}
            icon={<TrendingUp className="h-5 w-5" />}
            variant={trip.remainingBudget > 0 ? 'success' : 'warning'}
          />
          
          <StatsCard
            title="עומרי שילם"
            value={`₪${users[0]?.totalPaid || 0}`}
            subtitle="עד כה"
            icon={<Users className="h-5 w-5" />}
          />
          
          <StatsCard
            title="נועה שילמה"
            value={`₪${users[1]?.totalPaid || 0}`}
            subtitle="עד כה"
            icon={<Users className="h-5 w-5" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ExpensesList />
          </div>
          
          <div className="space-y-6">
            <BudgetOverview />
          </div>
        </div>
        
        <AddExpenseSheet 
          open={showAddExpense} 
          onOpenChange={setShowAddExpense}
        />
      </div>
    </div>
  );
};

export default Index;
