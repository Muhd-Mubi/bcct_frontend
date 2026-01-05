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
import { PlusCircle, Trash2 } from 'lucide-react';
import { Job } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

const jobItemSchema = z.object({
  name: z.string().min(1, 'Item name is required.'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
});

const formSchema = z.object({
  job_id: z.string().min(1, 'Job Order ID is required.'),
  department: z.string().min(1, 'Department is required.'),
  tasks: z.array(jobItemSchema).min(1, 'At least one item is required.'),
  _id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateJobOrderDialogProps {
  isOpen: boolean;
  closeModal: () => void;
  onSave: (data: FormValues) => void;
  job?: Job;
  disableButton?: boolean
}

export function CreateJobOrderDialog({ isOpen, closeModal, onSave, job, disableButton = false }: CreateJobOrderDialogProps) {
  const isEditing = !!job;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { _id: '', job_id: '', department: '', tasks: [{ name: '', quantity: 1 }] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tasks',
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditing && job) {
        form.reset(job);
      } else {
        form.reset({ _id: "", job_id: "", department: '', tasks: [{ name: '', quantity: 1 }] });
      }
    }
  }, [isOpen, form, isEditing, job]);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEditing ? 'Edit Job Order' : 'Create New Job Order'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details of this job order.' : 'Fill in the details for the new job order.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)}>
            <ScrollArea className="max-h-[60vh] pr-4 overflow-y-auto pb-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="job_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Order ID</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Printing" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
                <div className="space-y-2">
                  <FormLabel>Items</FormLabel>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-2 p-2 border rounded-md">
                      <div className="grid grid-cols-2 gap-2 flex-grow">
                        <FormField
                          control={form.control}
                          name={`tasks.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Item Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., Brochure" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`tasks.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Quantity</FormLabel>
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
                        disabled={(fields.length === 1) || disableButton}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              
                <Button disabled={disableButton} type="button" variant="outline" size="sm" onClick={() => append({ name: '', quantity: 1 })}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Another Item
                </Button>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button disabled={disableButton} type="button" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button disabled={disableButton} type="submit">Save Job Order</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
