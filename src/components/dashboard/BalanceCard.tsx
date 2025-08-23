import { Users, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';

export function BalanceCard() {
  const { users } = useStore();
  const [omri, noa] = users;
  
  const balanceDiff = Math.abs(omri.netBalance - noa.netBalance);
  const whoOwesWhom = omri.netBalance > noa.netBalance 
    ? { creditor: 'Omri', debtor: 'Noa', amount: balanceDiff / 2 }
    : omri.netBalance < noa.netBalance 
    ? { creditor: 'Noa', debtor: 'Omri', amount: balanceDiff / 2 }
    : null;

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-5 w-5 text-accent" />
          איזון חשבונות
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Individual stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">עומרי</div>
            <div className="font-semibold rtl-numbers">₪{omri.totalPaid}</div>
            <div className="text-xs text-muted-foreground">שילם</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">נועה</div>
            <div className="font-semibold rtl-numbers">₪{noa.totalPaid}</div>
            <div className="text-xs text-muted-foreground">שילמה</div>
          </div>
        </div>

        {/* Balance summary */}
        <div className="border-t pt-3">
          {whoOwesWhom ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {whoOwesWhom.creditor === 'Omri' ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-warning" />
                )}
                <span className="text-sm">
                  {whoOwesWhom.debtor} חייב/ת ל{whoOwesWhom.creditor}
                </span>
              </div>
              
              <Badge variant={whoOwesWhom.creditor === 'Omri' ? 'default' : 'secondary'}>
                <span className="rtl-numbers">₪{Math.round(whoOwesWhom.amount)}</span>
              </Badge>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-success">
              <Minus className="h-4 w-4" />
              <span className="text-sm font-medium">החשבון מאוזן</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}