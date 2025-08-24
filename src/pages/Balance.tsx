import { useState } from 'react';
import { Plus } from 'lucide-react';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { AddExpenseSheet } from '@/components/expenses/AddExpenseSheet';
import { Button } from '@/components/ui/button';

const Balance = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);

  return (
    <div className="min-h-screen gradient-warm">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">התחשבנות</h1>
          <Button 
            onClick={() => setShowAddExpense(true)}
            className="gradient-primary hover:shadow-elegant transition-bounce"
          >
            <Plus className="h-4 w-4 ml-1" />
            הוספת הוצאה
          </Button>
        </div>
        
        <BalanceCard />
        
        <AddExpenseSheet 
          open={showAddExpense} 
          onOpenChange={setShowAddExpense}
        />
      </div>
    </div>
  );
};

export default Balance;