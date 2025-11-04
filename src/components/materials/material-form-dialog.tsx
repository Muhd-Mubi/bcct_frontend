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

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  type: z.enum(['Paper', 'Cardboard']),
  supplier: z.string().min(2, 'Supplier must be at least 2 characters.'),
  currentStock: z.coerce.number().min(0, 'Stock cannot be negative.'),
  maxStock: z.coerce.number().min(1, 'Max stock must be at least 1.'),
  unitWeight: z.coerce.number().positive('Weight must be positive.'),
  unitHeight: z.coerce.number().positive('Height must be positive.'),
  reorderThreshold: z.coerce
    .number()
    .min(0, 'Threshold must be at least 0.')
    .max(100, 'Threshold cannot be over 100.'),
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
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: material || {
      name: '',
      type: 'Paper',
      supplier: '',
      currentStock: 0,
      maxStock: 1000,
      unitWeight: 0,
      unitHeight: 0,
      reorderThreshold: 20,
    },
  });
  
  useEffect(() => {
    if (material) {
      form.reset(material);
    } else {
      form.reset({
        name: '', type: 'Paper', supplier: '', currentStock: 0,
        maxStock: 1000, unitWeight: 0, unitHeight: 0, reorderThreshold: 20,
      });
    }
  }, [material, form, isOpen]);


  const onSubmit = (values: FormValues) => {
    onSave({
      ...values,
      id: material?.id || `new-${Date.now()}`,
      lastUpdated: new Date().toISOString(),
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
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Paper">Paper</SelectItem>
                      <SelectItem value="Cardboard">Cardboard</SelectItem>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Stock</FormLabel>
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
