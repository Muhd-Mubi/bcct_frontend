'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Order } from '@/lib/types';

const formSchema = z.object({
  sheetsUsed: z.coerce.number().min(1, 'Sheets used must be at least 1.'),
  rimsUsed: z.coerce.number().min(0, 'Rims used must be a positive number.'),
});

type FormValues = z.infer<typeof formSchema>;

interface CompleteOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (orderId: string, sheetsUsed: number, rimsUsed: number) => void;
  order?: Order;
}

export function CompleteOrderDialog({
  isOpen,
  onOpenChange,
  onSave,
  order,
}: CompleteOrderDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sheetsUsed: 0,
      rimsUsed: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ sheetsUsed: 0, rimsUsed: 0 });
    }
  }, [form, isOpen]);

  const onSubmit = (values: FormValues) => {
    if (order) {
      onSave(order.id, values.sheetsUsed, values.rimsUsed);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            Complete Order: {order?.name}
          </DialogTitle>
          <DialogDescription>
            Enter the quantity of paper used for this order.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sheetsUsed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sheets Used</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rimsUsed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rims Used</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Mark as Completed</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
