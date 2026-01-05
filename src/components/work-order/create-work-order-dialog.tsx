'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Job, WorkOrderPriority, JobItem, WorkOrder, WorkOrderStatus } from '@/lib/types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { useData } from '@/context/data-context';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useGetJobById } from '@/api/react-query/queries/jobOrder';
import { toast } from 'react-toastify';

const jobItemSchema = z.object({
  name: z.string(),
  quantity: z.number(),
});

const formSchema = z.object({
  _id: z.string().optional(),
  job: z.any(),
  tasks: z.array(jobItemSchema).min(1, 'Please select at least one task for the work order.'),
  description: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.enum(['pending', 'in progress', 'completed']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateWorkOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormValues) => void;
  workOrder?: WorkOrder;
  disableButtons?: boolean
}

export function CreateWorkOrderDialog({ isOpen, onOpenChange, onSave, workOrder, disableButtons = false }: CreateWorkOrderDialogProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchId, setSearchId] = useState(workOrder?.job || "")
  const { workOrders } = useData();
  const isEditing = !!workOrder;

  const { data: searchedJob, isLoading, isRefetching, error, refetch } = useGetJobById(isEditing ? workOrder?.job: searchId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { job: '', tasks: [], description: '', priority: 'medium' },
  });

  let selectedJobId = form.watch('job');
  const selectedJob = selectedJobId && searchedJob ? searchedJob?.job : '';

  const remainingQuantities = useMemo(() => {
    if (!selectedJob) return {};

    const quantities: { [itemName: string]: number } = {};

    for (const item of selectedJob.tasks) {
      quantities[item.name] = item.quantity;
    }

    const relatedWorkOrders = workOrders.filter(wo => wo.jobId === selectedJob.id && wo.id !== workOrder?.id);
    for (const wo of relatedWorkOrders) {
      for (const item of wo.tasks) {
        if (quantities[item.name] !== undefined) {
          quantities[item.name] -= item.quantity;
        }
      }
    }
    return quantities;
  }, [selectedJob, workOrders, workOrder]);


  useEffect(() => {
    if (isOpen) {
      if (isEditing && workOrder) {
        form.reset({
          _id: workOrder?._id,
          job: workOrder.job,
          tasks: workOrder.tasks,
          priority: workOrder.priority,
          description: workOrder.description,
          status: workOrder.status
        });
        selectedJobId = workOrder?.job
        refetch()
      } else {
        form.reset({ job: '', tasks: [], description: '', priority: 'medium' });
      }
    }
  }, [isOpen, form, isEditing, workOrder]);

  useEffect(() => {
    if (!isEditing) {
      form.setValue('tasks', []);
    }
  }, [form, isEditing]);

  const handleItemToggle = (item: JobItem, checked: boolean) => {
    const currentItems = form.getValues('tasks');
    if (checked) {
      form.setValue('tasks', [...currentItems, item]);
    } else {
      form.setValue('tasks', currentItems.filter(i => i.name !== item.name));
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log({ data })
    onSave(data);
  }

  const handleJobSearch = () => {
    if (!searchId) {
      toast.error("Id is required")
      return
    };
    refetch()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEditing ? 'Edit Work Order' : 'Create New Work Order'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this work order.' : 'Fill in the details for the new work order. Select a job order to see available items.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
              <div className="space-y-4 py-4">
                {isEditing && workOrder && (
                  <div className='flex justify-between items-center'>
                    <FormItem>
                      <FormLabel className='mr-3'>Status : </FormLabel>
                      <Badge variant={
                        workOrder.status === 'completed' ? 'default' :
                          workOrder.status === 'in progress' ? 'secondary' : 'destructive'
                      }>
                        {workOrder.status}
                      </Badge>
                    </FormItem>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="job"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Job Order ID</FormLabel>
                      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              disabled={isEditing || disableButtons}
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? field.value
                                : "Select Job Order ID"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput value={searchId} onValueChange={e => setSearchId(e)} placeholder="Search Job Order ID..." />
                            <CommandList>
                              <CommandEmpty>No job order found.</CommandEmpty>
                              <CommandGroup>
                                {searchedJob && (
                                  <CommandItem
                                    value={searchedJob.job.job_id}
                                    key={searchedJob.job.job_id}
                                    onSelect={() => {
                                      form.setValue("job", searchedJob.job.job_id);
                                      setPopoverOpen(false);
                                    }}
                                  >
                                    {searchedJob.job.job_id}
                                  </CommandItem>
                                )}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                          <Button onClick={handleJobSearch} className='ml-4 my-4'>Find</Button>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedJob && (
                  <FormField
                    control={form.control}
                    name="tasks"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Job Order Items</FormLabel>
                          <p className="text-sm text-muted-foreground">Select the items to include in this work order.</p>
                        </div>
                        <ScrollArea className="h-40 rounded-md border p-4">
                          {selectedJob?.tasks?.map((item, index) => {
                            return (
                              <div key={index} className="flex items-center space-x-2 mb-2">
                                <Checkbox
                                  id={`item-${index}`}
                                  onCheckedChange={(checked) => handleItemToggle(item, checked as boolean)}
                                  checked={form.getValues('tasks').some(i => i.name === item.name)}
                                  disabled={disableButtons}
                                />
                                <label htmlFor={`item-${index}`} className={cn("text-sm font-medium leading-none")}>
                                  {item.name} (Required: {item.quantity})
                                </label>
                              </div>
                            )
                          })}
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
                      <Select disabled={disableButtons} onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(['high', 'medium', 'low'] as WorkOrderPriority[]).map(p => (
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
              </div>
            </ScrollArea>
            <DialogFooter className="pt-6">
              <Button disabled={disableButtons} type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button disabled={disableButtons} type="submit">Save Work Order</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
