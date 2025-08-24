import { Users, TrendingUp, TrendingDown, Minus, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';

export function BalanceCard() {
  const { users } = useStore();
  const [omri, noa] = users;
  
  const balanceDiff = Math.abs(omri.netBalance - noa.netBalance);
  const whoOwesWhom = omri.netBalance > noa.netBalance 
    ? { creditor: 'עומרי', debtor: 'נועה', amount: balanceDiff / 2 }
    : omri.netBalance < noa.netBalance 
    ? { creditor: 'נועה', debtor: 'עומרי', amount: balanceDiff / 2 }
    : null;

  return (
    <Card className="shadow-elegant gradient-subtle border-accent/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Scale className="h-6 w-6 text-primary" />
          התחשבנות
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Balance summary - Main focus */}
        {whoOwesWhom ? (
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-xl border border-primary/10">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                {whoOwesWhom.creditor === 'עומרי' ? (
                  <TrendingUp className="h-5 w-5 text-success" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-warning" />
                )}
                <span className="text-lg font-medium">
                  {whoOwesWhom.debtor} חייב/ת ל{whoOwesWhom.creditor}
                </span>
              </div>
              
              <div className="text-4xl font-bold text-primary rtl-numbers">
                ₪{Math.round(whoOwesWhom.amount)}
              </div>
              
              <div className="text-sm text-muted-foreground">
                סכום להתחשבנות
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-success/5 to-success/10 p-6 rounded-xl border border-success/20">
            <div className="flex items-center justify-center gap-3 text-success">
              <Minus className="h-6 w-6" />
              <span className="text-xl font-bold">החשבון מאוזן!</span>
            </div>
            <div className="text-center mt-2 text-sm text-muted-foreground">
              אין צורך בהתחשבנות
            </div>
          </div>
        )}

        {/* Individual stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-card rounded-lg border shadow-sm">
            <div className="text-sm text-muted-foreground mb-2">עומרי</div>
            <div className="text-2xl font-bold text-foreground rtl-numbers mb-1">
              ₪{omri.totalPaid}
            </div>
            <div className="text-xs text-muted-foreground">שילם בסך הכל</div>
            <div className="text-xs text-primary mt-1 rtl-numbers">
              חייב: ₪{Math.round(omri.totalOwed)}
            </div>
          </div>
          
          <div className="text-center p-4 bg-card rounded-lg border shadow-sm">
            <div className="text-sm text-muted-foreground mb-2">נועה</div>
            <div className="text-2xl font-bold text-foreground rtl-numbers mb-1">
              ₪{noa.totalPaid}
            </div>
            <div className="text-xs text-muted-foreground">שילמה בסך הכל</div>
            <div className="text-xs text-primary mt-1 rtl-numbers">
              חייבת: ₪{Math.round(noa.totalOwed)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}