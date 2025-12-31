'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Job, WorkOrderPriority, JobItem } from '@/lib/types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';

const jobItemSchema = z.object({
  name: z.string(),
  quantity: z.number(),
});

const formSchema = z.object({
  jobId: z.string().min(1, 'Please select a Job Order ID.'),
  items: z.array(jobItemSchema).min(1, 'Please select at least one item for the work order.'),
  description: z.string().optional(),
  priority: z.enum(['High', 'Medium', 'Low']),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateWorkOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormValues) => void;
  jobOrders: Job[];
}

export function CreateWorkOrderDialog({ isOpen, onOpenChange, onSave, jobOrders }: CreateWorkOrderDialogProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { jobId: '', items: [], description: '', priority: 'Medium' },
  });

  const selectedJobId = form.watch('jobId');
  const selectedJob = useMemo(() => jobOrders.find(j => j.id === selectedJobId), [selectedJobId, jobOrders]);

  useEffect(() => {
    if (isOpen) {
      form.reset({ jobId: '', items: [], description: '', priority: 'Medium' });
    }
  }, [isOpen, form]);

  // Reset items when job changes
  useEffect(() => {
    form.setValue('items', []);
  }, [selectedJobId, form]);

  const handleItemToggle = (item: JobItem, checked: boolean) => {
    const currentItems = form.getValues('items');
    if (checked) {
      form.setValue('items', [...currentItems, item]);
    } else {
      form.setValue('items', currentItems.filter(i => i.name !== item.name));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Create New Work Order</DialogTitle>
          <DialogDescription>
            Fill in the details for the new work order. Select a job order to see available items.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="jobId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Job Order ID</FormLabel>
                   <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? jobOrders.find(
                                (job) => job.id === field.value
                              )?.id
                            : "Select Job Order ID"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                       <Command>
                        <CommandInput placeholder="Search Job Order ID..." />
                        <CommandList>
                          <CommandEmpty>No job order found.</CommandEmpty>
                          <CommandGroup>
                            {jobOrders.map((job) => (
                              <CommandItem
                                value={job.id}
                                key={job.id}
                                onSelect={() => {
                                  form.setValue("jobId", job.id);
                                  setPopoverOpen(false);
                                }}
                              >
                                {job.id}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedJob && (
              <FormField
                control={form.control}
                name="items"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Job Order Items</FormLabel>
                      <p className="text-sm text-muted-foreground">Select the items to include in this work order.</p>
                    </div>
                    <ScrollArea className="h-40 rounded-md border p-4">
                      {selectedJob.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <Checkbox
                            id={`item-${index}`}
                            onCheckedChange={(checked) => handleItemToggle(item, checked as boolean)}
                            checked={form.getValues('items').some(i => i.name === item.name)}
                          />
                          <label htmlFor={`item-${index}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {item.name} (Qty: {item.quantity})
                          </label>
                        </div>
                      ))}
                    </ScrollArea>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(['High', 'Medium', 'Low'] as WorkOrderPriority[]).map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter any relevant details about the work order..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Work Order</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
