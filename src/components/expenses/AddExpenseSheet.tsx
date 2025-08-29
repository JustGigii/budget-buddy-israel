import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { useStore } from '@/store/useStore';
import { CURRENCIES, CATEGORIES,COUNTRYS } from '@/types';
import { cn } from '@/lib/utils';

const expenseSchema = z.object({
  date: z.date({ required_error: 'יש לבחור תאריך' }),
  merchant: z.string().min(1, 'יש להזין שם ספק'),

  category: z.enum(['מסעדות', 'אטרקציות', 'תחבורה', 'לינה', 'קניות', 'אחר'], {
   
    required_error: 'יש לבחור קטגוריה'
  }),
   amountOriginal: z.preprocess((v) => {
    if (typeof v === 'string') {
      const norm = v.replace(',', '.').trim();
      return norm === '' ? undefined : Number(norm);
    }
    return v;
  }, z.number({ required_error: 'יש להזין סכום' }).positive('הסכום חייב להיות חיובי')),
  currencyOriginal: z.string().min(1, 'יש לבחור מטבע'),
  country: z.string().min(1, 'יש לבחור מדינה'),
  payer: z.enum(['Omri', 'Noa'], { required_error: 'יש לבחור מי שילם' }),
  splitType: z.enum(['equal', 'personal']).default('equal'),
  notes: z.string().optional(),
})

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface AddExpenseSheetProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddExpenseSheet({ children, open: externalOpen, onOpenChange: externalOnOpenChange }: AddExpenseSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const addExpense = useStore(state => state.addExpense);
  const trip = useStore(s => s.trip)
  // Use external state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date(),
      splitType: 'equal',
      currencyOriginal: 'ILS',
      payer: 'Omri',
      notes: "",
      merchant: "",
      country: "",
      
    },
  });
      const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = (data: ExpenseFormData) => {
  
    if (!trip.id) {
      console.error('Missing trip.id — ודא שקראת init(tripId) באתחול האפליקציה');
      return;
    }
 
    addExpense(trip.id, data as any);
    form.reset();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {children && (
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
      )}
      
      <SheetContent side="bottom"   className="h-[85svh] max-h-[90dvh] overflow-y-hidden pt-3 pb-[calc(env(safe-area-inset-bottom)+16px)]" >
        <SheetHeader className="text-right mb-3 " >
          <SheetTitle  className="flex justify-center items-center gap-2 text-lg">
            הוספת הוצאה חדשה
          </SheetTitle>
        </SheetHeader>
      
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>תאריך</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-right font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, 'PPP', { locale: he })
                          ) : (
                            <span>בחר תאריך</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Merchant */}
            <FormField
              control={form.control}
              name="merchant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> מאפיה קנינו</FormLabel>
                  <FormControl>
                    <Input placeholder="לדוגמה: רמן איצ׳ירן" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="grid grid-cols-2 gap-2">
            {/* country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>מדינה</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר מדינה" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COUNTRYS.map((category) => (
                        <SelectItem key={category.key} value={category.key}>
                          <span className="flex items-center gap-2">
                            <span>{category.emoji}</span>
                            <span>{category.key}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
              <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>קטגוריה</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר קטגוריה" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.key} value={category.key}>
                          <span className="flex items-center gap-2">
                            <span>{category.emoji}</span>
                            <span>{category.key}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        
              
            {/* Amount and Currency */}

              <FormField
                control={form.control}
                name="amountOriginal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>סכום</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.02"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currencyOriginal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מטבע</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            <span className="flex items-center gap-2">
                              <span>{currency.symbol}</span>
                              <span>{currency.code}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Payer */}
            <FormField
              control={form.control}
              name="payer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>מי שילם?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Omri" id="omri" />
                        <Label htmlFor="omri">עמרי</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Noa" id="noa" />
                        <Label htmlFor="noa">נועה</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Split Type */}
            <FormField
              control={form.control}
              name="splitType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>סוג חלוקה</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="equal" id="equal" />
                        <Label htmlFor="equal">חצי-חצי</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="personal" id="personal" />
                        <Label htmlFor="personal">פרטי</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>הערות (אופציונלי)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="הערות נוספות..." 
                      className="min-h-[30px] resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col items-center  gap-2 pt-2 !mt-1">
              <Button  type="submit" onClick={() => formRef.current?.requestSubmit()} className="flex-1 w-full gradient-primary p-3" >
                הוסף הוצאה
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="flex-1 w-full"
              >
                ביטול
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}