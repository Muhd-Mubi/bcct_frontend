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

const materialUsedSchema = z.object({
  materialId: z.string().min(1, 'Please select a material.'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
});

const formSchema = z.object({
  materialsUsed: z.array(materialUsedSchema).min(1, 'At least one material must be recorded.'),
});

type FormValues = z.infer<typeof formSchema>;

interface CompleteWorkOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workOrder: WorkOrder;
  materials: Material[];
  onConfirm: (orderId: string, materialsUsed: z.infer<typeof materialUsedSchema>[]) => void;
}

export function CompleteWorkOrderDialog({
  isOpen,
  onOpenChange,
  workOrder,
  materials,
  onConfirm,
}: CompleteWorkOrderDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialsUsed: [{ materialId: '', quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'materialsUsed',
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ materialsUsed: [{ materialId: '', quantity: 1 }] });
    }
  }, [isOpen, form]);

  const onSubmit = (values: FormValues) => {
    onConfirm(workOrder.id, values.materialsUsed);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Complete Work Order: {workOrder.jobId}</DialogTitle>
          <DialogDescription>
            Record the paper types and quantities used to complete this work order.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 max-h-[300px] overflow-y-auto p-1">
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
                                  {materials.map((m) => (
                                    <SelectItem key={m._id} value={m._id}>
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
                      name={`materialsUsed.${index}.quantity`}
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
            </div>
            
            <Button type="button" variant="outline" size="sm" onClick={() => append({ materialId: '', quantity: 1 })}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Paper Type
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
