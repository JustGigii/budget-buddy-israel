import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/store/useStore";

/**
 * מחזיר true כשהסנאפשוטים הראשונים של trip/users/expenses/exchangeRates הגיעו לפחות פעם אחת,
 * בלי לשנות את ה-store.
 */
export function useStoreReadyNoFlags() {
  // בוחרים רק את השדות שצריך (מונע רה-רנדרים מיותרים)
  const trip = useStore(s => s.trip);
  const users = useStore(s => s.users);
  const expenses = useStore(s => s.expenses);
  const exchangeRates = useStore(s => s.exchangeRates);

  // נשמור את הרפרנסים הראשוניים כדי להשוות אליהם
  const initialRefs = useRef({
    trip,
    users,
    expenses,
    exchangeRates,
  });

  const [loaded, setLoaded] = useState({
    trip: false,
    users: false,
    expenses: false,
    rates: false,
  });

  // בכל פעם שהרפרנס משתנה מהרפרנס ההתחלתי -> סימן שהגיע עדכון ראשון
  useEffect(() => {
    if (!loaded.trip && trip !== initialRefs.current.trip) {
      setLoaded(prev => ({ ...prev, trip: true }));
    }
  }, [trip, loaded.trip]);

  useEffect(() => {
    if (!loaded.users && users !== initialRefs.current.users) {
      setLoaded(prev => ({ ...prev, users: true }));
    }
  }, [users, loaded.users]);

  useEffect(() => {
    if (!loaded.expenses && expenses !== initialRefs.current.expenses) {
      setLoaded(prev => ({ ...prev, expenses: true }));
    }
  }, [expenses, loaded.expenses]);

  useEffect(() => {
    if (!loaded.rates && exchangeRates !== initialRefs.current.exchangeRates) {
      setLoaded(prev => ({ ...prev, rates: true }));
    }
  }, [exchangeRates, loaded.rates]);

  // אם חשוב לך “לשחרר” גם כשאין שערים/לא קריטי להמתין ל-rates – שים || true במקום loaded.rates
  const isReady = useMemo(
    () => loaded.trip && loaded.users && loaded.expenses && loaded.rates,
    [loaded]
  );

  return isReady;
}
