import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Settings = () => {
  return (
    <div className="min-h-screen gradient-warm">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">הגדרות</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>הגדרות כלליות</CardTitle>
            <CardDescription>נהל את הגדרות האפליקציה</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">הגדרות יתווספו בהמשך...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;