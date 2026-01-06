'use client';

import React, { useEffect } from 'react';
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
import { WorkOrder, Material } from '@/lib/types';
import { PlusCircle, Trash2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const materialUsedSchema = z.object({
  materialId: z.string().min(1, 'Please select a material.'),
  unitQuantity: z.coerce.number().min(0, 'Invalid quantity value'),
  extraSheets: z.coerce.number().min(0, 'Invalid quantity value'),
});

const formSchema = z.object({
  materialsUsed: z.array(materialUsedSchema).min(1, 'At least one material must be recorded.'),
});

type FormValues = z.infer<typeof formSchema>;

interface CompleteWorkOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workOrderId: string;
  materials: Material[];
  onConfirm: (orderId: string, materialsUsed: z.infer<typeof materialUsedSchema>[]) => void;
}

export function CompleteWorkOrderDialog({
  isOpen,
  onOpenChange,
  workOrderId,
  materials,
  onConfirm,
}: CompleteWorkOrderDialogProps) {
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
    onConfirm(workOrderId, values.materialsUsed);
  };

  const selectedMaterialIds = form.watch('materialsUsed')?.map(
    (item) => item.materialId
  );

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Complete Work Order: {workOrderId}</DialogTitle>
          <DialogDescription>
            Record the paper types and quantities used to complete this work order.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
              <div className="space-y-4 py-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-2 p-2 border rounded-md">
                    <div className="grid grid-cols-2 gap-2 flex-grow">
                      <FormField
                        control={form.control}
                        name={`materialsUsed.${index}.materialId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Paper Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select paper" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {materials.map((m) => {
                                  const isSelected =
                                    selectedMaterialIds.includes(m._id) &&
                                    m._id !== form.getValues(`materialsUsed.${index}.materialId`);

                                  return (
                                    <SelectItem
                                      key={m._id}
                                      value={m._id}
                                      disabled={isSelected}
                                    >
                                      {m.name}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div></div>
                      <FormField
                        control={form.control}
                        name={`materialsUsed.${index}.unitQuantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity Used</FormLabel>
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
                            <FormLabel>Quantity Used</FormLabel>
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


                <Button type="button" variant="outline" size="sm" onClick={() => append({ materialId: '', unitQuantity: 0, extraSheets: 0 })} className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Another Paper Type
                </Button>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
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
