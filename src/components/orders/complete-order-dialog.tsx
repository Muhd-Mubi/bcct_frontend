'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Order, Material } from '@/lib/types';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useData } from '@/context/data-context';

const materialUsedSchema = z.object({
  materialId: z.string().min(1, 'Please select a material.'),
  unitQuantity: z.coerce.number().min(0, 'Unit quantity must be non-negative.'),
  extraSheets: z.coerce.number().min(0, 'Extra sheets must be non-negative.'),
}).refine(data => data.unitQuantity > 0 || data.extraSheets > 0, {
    message: "Either unit quantity or extra sheets must be greater than 0.",
    path: ["unitQuantity"],
});

const formSchema = z.object({
  materialsUsed: z.array(materialUsedSchema).min(1, 'At least one material must be recorded.'),
});

type FormValues = z.infer<typeof formSchema>;

interface CompleteOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
  materials: Material[];
  onConfirm: (orderId: string, materialsUsed: z.infer<typeof materialUsedSchema>[]) => void;
}

export function CompleteOrderDialog({
  isOpen,
  onOpenChange,
  order,
  materials,
  onConfirm,
}: CompleteOrderDialogProps) {
  const { measurements } = useData();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialsUsed: [{ materialId: '', unitQuantity: 0, extraSheets: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'materialsUsed',
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ materialsUsed: [{ materialId: '', unitQuantity: 0, extraSheets: 0 }] });
    }
  }, [isOpen, form]);

  const onSubmit = (values: FormValues) => {
    onConfirm(order.id, values.materialsUsed);
  };

  const getMaterialUnitLabel = (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    return material ? material.type : 'Units';
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Complete Order: {order.name}</DialogTitle>
          <DialogDescription>
            Record the materials and quantities used to complete this order.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 max-h-[300px] overflow-y-auto p-1">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2 p-2 border rounded-md">
                  <div className="grid grid-cols-3 gap-2 flex-grow">
                    <FormField
                      control={form.control}
                      name={`materialsUsed.${index}.materialId`}
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel>Material</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select material" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {materials.map((m) => (
                                    <SelectItem key={m.id} value={m.id}>
                                      {m.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                            </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`materialsUsed.${index}.unitQuantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getMaterialUnitLabel(form.watch(`materialsUsed.${index}.materialId`))}</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name={`materialsUsed.${index}.extraSheets`}
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
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button type="button" variant="outline" size="sm" onClick={() => append({ materialId: '', unitQuantity: 0, extraSheets: 0 })}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Material
            </Button>

            <DialogFooter>
               <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Confirm Completion</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
