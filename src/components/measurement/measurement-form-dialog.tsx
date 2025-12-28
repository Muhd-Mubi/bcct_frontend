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
import { Measurement } from '@/lib/types';

const formSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(2, 'Type must be at least 2 characters.'),
  sheetsPerUnit: z.coerce.number().min(1, 'Sheets per unit must be at least 1.'),
});

type FormValues = z.infer<typeof formSchema>;

interface MeasurementFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (measurement: Measurement) => void;
  measurement?: Measurement;
}

export function MeasurementFormDialog({
  isOpen,
  onOpenChange,
  onSave,
  measurement,
}: MeasurementFormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: measurement || {
      type: '',
      sheetsPerUnit: 1,
    },
  });
  
  useEffect(() => {
    if (measurement) {
      form.reset(measurement);
    } else {
      form.reset({
        type: '',
        sheetsPerUnit: 1,
      });
    }
  }, [measurement, form, isOpen]);


  const onSubmit = (values: FormValues) => {
    onSave({
      ...values,
      id: measurement?.id || `new-${Date.now()}`,
    } as Measurement);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {measurement ? 'Edit Measurement' : 'Add Measurement'}
          </DialogTitle>
          <DialogDescription>
            Fill in the details for the measurement unit.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sheetsPerUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sheets Per Unit</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
