// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogle = async () => {
    try {
      setErr(null);
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      setErr(e?.message || "שגיאה בהתחברות");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen w-full flex items-center justify-center bg-background px-4">



          {/* בלוק העיצוב המוקי שלך */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-2xl border border-primary/20 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ">
                טיול של נועה ועמרי
              </div>
             


          {/* הסבר קצר וברור על האפליקציה */}
          <div className="space-y-3 text-right">
            <h2 className="text-xl font-semibold">מה קורה באפליקציה?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              אפליקציה לניהול הוצאות זוגיות ביפן. מוסיפים הוצאה בכל מטבע,
              בוחרים מי שילם ועל מי, והמערכת מחשבת אוטומטית את האיזון ביניכם —
              כולל המרה לשקלים, חלוקה 50/50 (או אישית), ודו״ח ברור של מי חייב למי.
            </p>
            <ul className="list-disc pr-5 text-sm text-muted-foreground space-y-1">
              <li>תמיכה במטבעות המזרח הרחוק והמרה ל־₪</li>
              <li>חלוקה הוגנת וזיהוי פערים בזמן אמת</li>
              <li>ממשק בעברית עם RTL מלא</li>
            </ul>
            <p className="text-xs text-muted-foreground">
              ההתחברות מתבצעת עם Google כדי לשמור את הנתונים שלך באופן מאובטח בענן.
              אין לנו גישה לסיסמה שלך וההרשאות מוגבלות למזהה החשבון והפרופיל הבסיסי בלבד.
            </p>
          </div>

          {/* כפתור התחברות */}
          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full h-11 rounded-xl text-base font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  מתחבר…
                </>
              ) : (
                <>
 
                  התחבר עם Google
                </>
              )}
            </Button>

            {err && <div className="text-sm text-red-600 text-center">{err}</div>}

            <p className="text-xs text-muted-foreground text-center">
              בלחיצה על “התחבר עם Google” אתה מאשר/ת את{" "}
              <a href="/terms" className="underline hover:opacity-80">תנאי השימוש</a>{" "}
              ואת{" "}
              <a href="/privacy-policy" className="underline hover:opacity-80">מדיניות הפרטיות</a>.
            </p>
          </div>
            </div>
          </div>
    </div>
  );
}
