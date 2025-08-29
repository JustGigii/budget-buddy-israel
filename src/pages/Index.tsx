import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Users, Plus } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { BudgetOverview } from '@/components/dashboard/BudgetOverview';
import { ExpensesList } from '@/components/expenses/ExpensesList';
import { AddExpenseSheet } from '@/components/expenses/AddExpenseSheet';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import  LoginPage  from '@/pages/LoginPage'
// import { useAuth } from '@/hooks/useAuth';
const Index = () => {
  const { trip, users, calculateBalances } = useStore();
    // const { user, loading } = useAuth();
  const [showAddExpense, setShowAddExpense] = useState(false);

  useEffect(() => {
    calculateBalances();
  }, [calculateBalances]);
// if(loading)
//       return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-pulse text-muted-foreground">טוען…</div>
//       </div>
//     );
  

//   if(!user) return ( 
//     <div className="min-h-screen gradient-warm">
//        <div className="w-full h-full mx-auto px-4 py-6 space-y-6">
//         <LoginPage />
//     </div>
// </div>
// )

  return (
    
    <div className="min-h-screen gradient-warm">
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        
     
        {/* Balance Card - Main focus */}
        <BalanceCard />
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* <StatsCard
            title="נשאר בתקציב"
            value={`₪${trip.remainingBudget.toLocaleString()}`}
            subtitle={`מתוך ₪${trip.budget.toLocaleString()}`}
            icon={<TrendingUp className="h-5 w-5" />}
            variant={trip.remainingBudget > 0 ? 'success' : 'warning'}
          /> */}
          {/* {users.map((user, index) => (
                      <StatsCard
            title={user.name + ' סכום ששילם'}
            value={`₪${users[0]?.totalPaid || 0}`}
            subtitle="עד כה"
            icon={<Users className="h-5 w-5" />}
          />
          
          ))} */}
              <div className="space-y-6">
            <BudgetOverview />
          </div>

        </div>
            <StatsCard
            title="סה״כ הוצאות"
            value={`₪${trip.totalExpenses.toLocaleString()}`}
            subtitle="מתחילת הטיול"
            icon={<Wallet className="h-5 w-5" />}
            variant="primary"
          />
          
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ExpensesList />
          </div>
          
                 {/* Floating Add Button */}
      <AddExpenseSheet>
        <Button 
          className="fixed bottom-6 left-6 h-14 w-14 rounded-full gradient-primary shadow-float hover:shadow-elegant transition-bounce z-50"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </AddExpenseSheet>
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
