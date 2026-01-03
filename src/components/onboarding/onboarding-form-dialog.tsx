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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/context/data-context';
import { PlusCircle, Trash2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const paperItemSchema = z.object({
  paperType: z.string().min(1, 'Please select a paper type.'),
  unitQuantity: z.coerce.number().min(1, 'Unit quantity must be at least 1.'),
  amount: z.coerce.number().min(0, 'Amount must be a positive number.'),
});

const formSchema = z.object({
  supplier: z.string().min(2, 'Supplier name must be at least 2 characters.'),
  papers: z.array(paperItemSchema).min(1, 'At least one paper type must be added.'),
});

type FormValues = z.infer<typeof formSchema>;

interface OnboardingFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormValues) => void;
}

export function OnboardingFormDialog({
  isOpen,
  onOpenChange,
  onSave,
}: OnboardingFormDialogProps) {
  const { materials } = useData();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: '',
      papers: [{ paperType: '', unitQuantity: 0, amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "papers",
  });

  const paperTypes = materials.map(m => m.name);

  useEffect(() => {
    if (isOpen) {
      form.reset({ supplier: '', papers: [{ paperType: '', unitQuantity: 1, amount: 0 }] });
    }
  }, [form, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Add New Paper Purchase</DialogTitle>
          <DialogDescription>
            Enter the details of the new paper stock received.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)}>
            <ScrollArea className="max-h-[60vh] p-4">
              <div className="space-y-4">
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
                
                <div className="space-y-2">
                  <FormLabel>Papers Received</FormLabel>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-2 p-2 border rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-grow">
                          <FormField
                            control={form.control}
                            name={`papers.${index}.paperType`}
                            render={({ field }) => (
                              <FormItem className="col-span-3">
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
                            name={`papers.${index}.unitQuantity`}
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
                            name={`papers.${index}.amount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount (Rs)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} placeholder="Cost in Rs" />
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

                <Button type="button" variant="outline" size="sm" onClick={() => append({ paperType: '', unitQuantity: 1, amount: 0 })}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Add Another Paper Type
                </Button>
              </div>
            </ScrollArea>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Purchase</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
