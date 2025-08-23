import { Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onAddExpense: () => void;
  onOpenSettings: () => void;
}

export function Header({ onAddExpense, onOpenSettings }: HeaderProps) {
  return (
    <header className="bg-card border-b shadow-card sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇯🇵</span>
            <div>
              <h1 className="text-xl font-semibold text-foreground">יפן 2025-2026</h1>
              <p className="text-sm text-muted-foreground">מעקב הוצאות משותפות</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={onOpenSettings}
              className="transition-smooth hover:bg-muted"
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button 
              onClick={onAddExpense}
              className="gradient-primary hover:shadow-elegant transition-bounce font-medium"
              size="sm"
            >
              <Plus className="h-4 w-4 ml-1" />
              הוספה
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}