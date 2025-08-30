import { useState, useEffect, useRef } from 'react';
import { Wallet, Plus } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { BudgetOverview } from '@/components/dashboard/BudgetOverview';
import { ExpensesList } from '@/components/expenses/ExpensesList';
import { AddExpenseSheet } from '@/components/expenses/AddExpenseSheet';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import LoginPage from '@/pages/LoginPage';
import { useAuth } from '@/hooks/useAuth';
import Analytics from './Analytics';
import { Card } from '@/components/ui/card';
import { useStoreReadyNoFlags } from "@/hooks/useStoreReadyNoFlags";
const tripId = 'big-trip-2025-2026';

const Index = () => {
  // ✅ כל ההוקים תמיד בטופ-לבל ובאותו סדר
  const { user, loading } = useAuth();
  const init = useStore(s => s.init);
  const {trip, users} = useStore();


  const [showAddExpense, setShowAddExpense] = useState(false);
  const unsubRef = useRef<null | (() => void)>(null);

  // ✅ מפעילים init רק כשהאימות הסתיים ויש user, ולא בזמן render
  useEffect(() => {
    if (loading) return;          // חכה לסיום טעינת האימות
    if (!user) return;            // אין משתמש => לא נרשמים ל־Firestore עדיין

    const unsub = init(tripId);   // רושם את כל ה־onSnapshot
    unsubRef.current = unsub;

    return () => {
      // ניקוי מאזינים בהחלפת user/Unmount
      unsubRef.current?.();
      unsubRef.current = null;
    };
  }, [loading, user?.uid, init]);




  
  // ⏳ מסך טעינה לאימות
  const isReady = useStoreReadyNoFlags();
  if ( (!isReady&& user) || loading) {
    return (

       <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">טוען…</div>
      </div>
    );
  }

  // 🔐 אין משתמש – מסך התחברות
  if (!user ) {
    return (
      <div className="min-h-screen gradient-warm">
        <div className="w-full h-full mx-auto px-4 py-6 space-y-6">
          <LoginPage />
        </div>
      </div>
    );
  }

  // 🎯 יש user – ייתכן שהדאטה עוד נטען, לכן לא ניפול על undefined
  const total = trip?.totalExpenses ?? 0;
  
  return (
    <div className="min-h-screen gradient-warm">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <BalanceCard />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-6">
            <BudgetOverview />
          </div>
        </div>

        <StatsCard
          title="סה״כ הוצאות"
          value={`₪${total.toLocaleString()}`}
          subtitle="מתחילת הטיול"
          icon={<Wallet className="h-5 w-5" />}
          variant="primary"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ExpensesList />
          </div>

          <Card>
            <Analytics />
          </Card>
          {users.find(user => user.email === user.email) &&(
          /* כפתור צף להוספת הוצאה */
          <AddExpenseSheet>
            <Button
              className="fixed bottom-6 left-6 h-14 w-14 rounded-full gradient-primary shadow-float hover:shadow-elegant transition-bounce z-50 border border-solid border-gray"
              size="icon"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </AddExpenseSheet>
          )}
        </div>

        {/* אופציונלי: שליטה דרך state */}
        <AddExpenseSheet open={showAddExpense} onOpenChange={setShowAddExpense} />
      </div>
    </div>
  );
};

export default Index;
