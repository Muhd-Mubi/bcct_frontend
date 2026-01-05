'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { WorkOrderStatus } from '@/lib/types';

interface ChangeStatusConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  closeModal: () => void
  status?: WorkOrderStatus;
  disableButtons?: boolean
}

export function ChangeStatusConfirmationDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  closeModal,
  status,
  disableButtons
}: ChangeStatusConfirmationDialogProps) {
  const isDestructive = status === 'completed';

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will change the work order status to "{status}".
            {isDestructive && " This will affect inventory levels and cannot be easily undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeModal}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(isDestructive && buttonVariants({ variant: "destructive" }))}
            disabled={disableButtons}
          >
            Yes, Change Status
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
