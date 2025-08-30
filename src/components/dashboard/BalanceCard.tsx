import { Users, TrendingUp, TrendingDown, Minus, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
// import omriProfile from '@/assets/omri-profile.jpg';
// import noaProfile from '@/assets/noa-profile.jpg';

export function BalanceCard() {
  
  const users  = useStore(s => s.users);
  const [omri, noa] = users;
  if (!omri || !noa) return null;
  const totalPaid = omri.totalPaid + noa.totalPaid;
  const omriPercentage = (totalPaid > 0 ? (omri.totalPaid / totalPaid) * 100 : 50 );
  const noaPercentage = (totalPaid > 0 ? (noa.totalPaid / totalPaid) * 100 : 50);
  

 const maxuser = omri.netBalance > noa.netBalance ? omri :omri.netBalance == noa.netBalance ? null : noa;
  return (
    <Card className="overflow-hidden relative bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-primary/20 shadow-elegant">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      
      <CardHeader className="relative pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-primary">
          <Scale className="h-6 w-6" />
          התחשבנות
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-6">
        {/* Main settlement display */}
        {maxuser ? (
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-2xl border border-primary/20 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                
                  <TrendingUp className="h-6 w-6 text-success" />
               
                <span className="text-lg font-semibold">
                {maxuser.hebName} שילם יותר 
                </span>
              </div>
              
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent rtl-numbers">
                ₪{Math.round(maxuser.netBalance)}
              </div>
              
              <div className="text-sm text-muted-foreground font-medium">
                סכום להתחשבנות
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-success/10 to-success/15 p-6 rounded-2xl border border-success/30">
            <div className="flex items-center justify-center gap-3 text-success">
              
              <span className="text-2xl font-bold">החשבון מאוזן!</span>
            </div>
            <div className="text-center mt-2 text-sm text-muted-foreground">
              אין צורך בהתחשבנות
            </div>
          </div>
        )}

        {/* Profile cards with percentages */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative overflow-hidden bg-gradient-to-br from-card to-card/80 rounded-2xl border border-primary/20 shadow-lg">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/20 to-transparent" />
            <div className="relative p-4 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-primary/30 shadow-lg">
                <img 
                  src={omri.picture} 
                  alt={omri.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-1">{omri.hebName}</div>
              <div className="text-2xl font-bold text-primary rtl-numbers mb-1">
                ₪{omri.totalOwed.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mb-2">שילם בסך הכל</div>
              
              {/* Percentage bar */}
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${omriPercentage}%` }}
                />
              </div>
              <div className="text-sm font-bold text-primary">
                {Math.round(omriPercentage)}%
              </div>
              
              <div className="text-xs text-muted-foreground mt-2 rtl-numbers">
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-card to-card/80 rounded-2xl border border-accent/20 shadow-lg">
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-accent/20 to-transparent" />
            <div className="relative p-4 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-accent/30 shadow-lg">
                <img 
                  src={noa.picture} 
                  alt={noa.hebName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-1">{noa.hebName}</div>
              <div className="text-2xl font-bold text-accent rtl-numbers mb-1">
                ₪{(noa.totalOwed).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mb-2">שילמה בסך הכל</div>
              
              {/* Percentage bar */}
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-accent to-accent/80 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${noaPercentage}%` }}
                />
              </div>
              <div className="text-sm font-bold text-accent">
                {Math.round(noaPercentage)}%
              </div>
              
              <div className="text-xs text-muted-foreground mt-2 rtl-numbers">
       
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}