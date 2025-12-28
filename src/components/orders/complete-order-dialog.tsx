'use client';

import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { Order } from '@/lib/types';
import { useData } from '@/context/data-context';
import { PlusCircle, Trash2 } from 'lucide-react';

const materialUsedSchema = z.object({
    materialId: z.string().min(1, "Please select a material."),
    sheetsUsed: z.coerce.number().min(1, 'Sheets used must be at least 1.'),
});

const formSchema = z.object({
  materialsUsed: z.array(materialUsedSchema).min(1, "Please add at least one material."),
});

type FormValues = z.infer<typeof formSchema>;

interface CompleteOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (orderId: string, materialsUsed: { materialId: string; sheetsUsed: number }[]) => void;
  order?: Order;
}

export function CompleteOrderDialog({
  isOpen,
  onOpenChange,
  onSave,
  order,
}: CompleteOrderDialogProps) {
  const { materials } = useData();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialsUsed: [{ materialId: '', sheetsUsed: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "materialsUsed",
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ materialsUsed: [{ materialId: '', sheetsUsed: 0 }] });
    }
  }, [form, isOpen]);

  const onSubmit = (values: FormValues) => {
    if (order) {
      onSave(order.id, values.materialsUsed);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">
            Complete Order: {order?.name}
          </DialogTitle>
          <DialogDescription>
            Enter the quantity of materials used for this order.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-end p-2 border rounded-md">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name={`materialsUsed.${index}.materialId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Material" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {materials.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name={`materialsUsed.${index}.sheetsUsed`}
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
                  </div>
                  <div className="col-span-2">
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
             <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ materialId: '', sheetsUsed: 0 })}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Material
            </Button>
            <DialogFooter>
              <Button type="submit">Mark as Completed</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
