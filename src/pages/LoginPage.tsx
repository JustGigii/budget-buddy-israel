// src/pages/LoginPage.tsx
import { useState } from "react";
// import { signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogle = async () => {
    try {
      setErr(null);
      setLoading(true);
    //   await signInWithPopup(auth, googleProvider);
      // אחרי התחברות – נווט לאן שתרצה (למשל לעמוד הראשי/דשבורד)
      navigate("/");
    } catch (e: any) {
      setErr(e?.message || "שגיאה בהתחברות");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <Card className="w-[95%] max-w-md border-primary/20 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            התחברות
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            היכנס/י כדי להמשיך לאפליקציה
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
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
                {/* אייקון גוגל קטן ב-SVG כדי לא להוסיף חבילות */}
                <svg
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.7 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 1.6l2.7-2.6C16.9 3 14.7 2 12 2 6.9 2 2.9 6 2.9 11.1S6.9 20.2 12 20.2c7 0 9.2-4.9 8.6-8.2H12z"/>
                </svg>
                התחבר עם Google
              </>
            )}
          </Button>

          {err && (
            <div className="text-sm text-red-600 text-center">{err}</div>
          )}

          <div className="text-center text-xs text-muted-foreground">
            בלחיצה על “התחבר עם Google” אתה מאשר את תנאי השימוש ומדיניות הפרטיות.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
