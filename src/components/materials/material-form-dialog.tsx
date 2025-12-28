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
import { Material } from '@/lib/types';
import { useData } from '@/context/data-context';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  type: z.string().min(1, 'Please select a unit'),
  unitQuantity: z.coerce.number().min(0, 'Unit quantity must be a positive number.'),
  extraSheets: z.coerce.number().min(0, 'Extra sheets must be a positive number.'),
});

type FormValues = z.infer<typeof formSchema>;

interface MaterialFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (material: Material) => void;
  material?: Material;
}

export function MaterialFormDialog({
  isOpen,
  onOpenChange,
  onSave,
  material,
}: MaterialFormDialogProps) {
  const { measurements } = useData();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: material || {
      name: '',
      type: '',
      unitQuantity: 0,
      extraSheets: 0,
    },
  });
  
  useEffect(() => {
    if (isOpen) {
        if (material) {
          form.reset(material);
        } else {
          form.reset({
            name: '', type: '', unitQuantity: 0, extraSheets: 0
          });
        }
    }
  }, [material, form, isOpen]);


  const onSubmit = (values: FormValues) => {
    const measurement = measurements.find(m => m.name === values.type);
    const sheetsPerUnit = measurement?.sheetsPerUnit || 1;
    const totalStock = (values.unitQuantity * sheetsPerUnit) + values.extraSheets;

    onSave({
      ...values,
      id: material?.id || `new-${Date.now()}`,
      lastUpdated: new Date().toISOString(),
      currentStock: material?.currentStock || totalStock,
      maxStock: material?.maxStock || Math.max(1000, totalStock * 2), // Ensure maxStock is reasonable
      reorderThreshold: material?.reorderThreshold || 20,
    } as Material);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {material ? 'Edit Material' : 'Add Material'}
          </DialogTitle>
          <DialogDescription>
            Fill in the details for the inventory item.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Measurement Unit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {measurements.map(m => (
                        <SelectItem key={m._id} value={m.name}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
