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
import { Textarea } from '@/components/ui/textarea';
import { Order } from '@/lib/types';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Order name must be at least 2 characters.'),
  clientName: z.string().min(2, 'Client name must be at least 2 characters.'),
  details: z.string().min(10, 'Details must be at least 10 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

interface OrderFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (order: Order) => void;
  order?: Order;
}

export function OrderFormDialog({
  isOpen,
  onOpenChange,
  onSave,
  order,
}: OrderFormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: order || {
      name: '',
      clientName: '',
      details: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(order || { name: '', clientName: '', details: '' });
    }
  }, [order, form, isOpen]);

  const onSubmit = (values: FormValues) => {
    onSave({
      ...values,
      id: order?.id || `new-${Date.now()}`,
      status: 'Pending',
      createdAt: order?.createdAt || new Date().toISOString(),
    } as Order);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {order ? 'Edit Order' : 'Create New Order'}
          </DialogTitle>
          <DialogDescription>
            Fill in the details for the new order.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Annual Report Printing" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Global Corp" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Details</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="e.g., 1000 copies, full color, glossy finish..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Order</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
