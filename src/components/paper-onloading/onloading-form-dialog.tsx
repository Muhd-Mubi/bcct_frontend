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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/context/data-context';

const formSchema = z.object({
  paperType: z.string().min(1, 'Please select a paper type.'),
  supplier: z.string().min(2, 'Supplier name must be at least 2 characters.'),
  unitQuantity: z.coerce.number().min(1, 'Unit quantity must be at least 1.'),
  extraSheets: z.coerce.number().min(0, 'Extra sheets must be a positive number.'),
});

type FormValues = z.infer<typeof formSchema>;

interface OnloadingFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormValues) => void;
}

export function OnloadingFormDialog({
  isOpen,
  onOpenChange,
  onSave,
}: OnloadingFormDialogProps) {
  const { materials } = useData();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paperType: '',
      supplier: '',
      unitQuantity: 0,
      extraSheets: 0,
    },
  });

  const paperTypes = materials.map(m => m.name);


  useEffect(() => {
    if (isOpen) {
      form.reset({ paperType: '', supplier: '', unitQuantity: 0, extraSheets: 0 });
    }
  }, [form, isOpen]);

  const onSubmit = (values: FormValues) => {
    onSave(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Add New Paper Purchase</DialogTitle>
          <DialogDescription>
            Enter the details of the new paper stock received.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="paperType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paper Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select paper type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paperTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., PaperCorp" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unitQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="extraSheets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extra Sheets</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save Purchase</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
