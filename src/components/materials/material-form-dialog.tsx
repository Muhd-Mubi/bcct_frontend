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
import { ScrollArea } from '../ui/scroll-area';
import { Measurement } from '@/lib/types';

const formSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  measurementId: z.string().optional(),
  unitQuantity: z.coerce.number().min(0, 'Unit quantity must be a positive number.'),
  extraSheets: z.coerce.number().min(0, 'Extra sheets must be a positive number.'),
  thresholdUnits: z.coerce.number().min(1, 'Threshold quantity must be a positive number.'),
});

type FormValues = z.infer<typeof formSchema>;
type MaterialPayload = (Omit<Material, '_id' | 'currentStock' | 'maxStock' | 'reorderThreshold' | 'lastUpdated' | 'type'> & { measurementId?: string }) | (Material & { measurementId?: string });

interface MaterialFormDialogProps {
  isOpen: boolean;
  onCLose: () => void;
  onSave: (material: MaterialPayload) => void;
  material?: Material;
  disableButtons?: boolean;
  measurementsList: Measurement[];
  loadingMeasurements?: boolean
}

export function MaterialFormDialog({
  isOpen,
  onCLose,
  onSave,
  material,
  disableButtons,
  measurementsList,
  loadingMeasurements = false
}: MaterialFormDialogProps) {
  const isEditing = !!material;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: undefined,
      name: '',
      measurementId: '',
      unitQuantity: 0,
      extraSheets: 0,
      thresholdUnits: 1
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (material) {
        const measurement = measurementsList.find(m => m.name === material.measurement);
        form.reset({
          ...material,
          measurementId: measurement?._id || '',
        });
      } else {
        form.reset({
          _id: undefined,
          name: '',
          measurementId: '',
          unitQuantity: 0,
          extraSheets: 0,
          thresholdUnits: 1
        });
      }
    }
  }, [material, form, isOpen]);


  const onSubmit = (values: FormValues) => {
    onSave(values as any);
  };

  return (
    <Dialog open={isOpen}>
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
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 py-4">
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
                {!loadingMeasurements && (
                  <FormField
                    control={form.control}
                    name="measurementId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Measurement Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {measurementsList.map(m => (
                              <SelectItem key={m._id} value={m._id}>{m.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="unitQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Quantity</FormLabel>
                        <FormControl>
                          <Input disabled={isEditing} type="number" {...field} />
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
                          <Input disabled={isEditing} type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="thresholdUnits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Threshold Units</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" disabled={disableButtons} onClick={onCLose}>Cancel</Button>
              <Button type="submit" disabled={disableButtons}>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
