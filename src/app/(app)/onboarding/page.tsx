'use client';

import React, { useState, useMemo, useContext } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingTable } from '@/components/onboarding/onboarding-table';
import { PaperOnboarding, UserRoleContext } from '@/lib/types';
import { OnboardingFormDialog } from '@/components/onboarding/onboarding-form-dialog';
import { Input } from '@/components/ui/input';
import { useData } from '@/context/data-context';
import { RevertConfirmationDialog } from '@/components/onboarding/revert-confirmation-dialog';
import { useGetOnboaring, useCompleteOnboarding, useRevertOnboarding } from '@/api/react-query/queries/inventoryTransections';
import { toast } from 'react-toastify';


export default function OnboardingPage() {
  const { onloadings, saveOnloading, revertOnloading } = useData();
  const { isLeadership, isTechnical } = useContext(UserRoleContext);

  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [selectedOnloadingId, setSelectedOnloadingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: onboardingData,
    isLoading: isloadingOnboarding,
    error: errorFetchingOnboarding,
    refetch } = useGetOnboaring(currentPage);
  const {
    mutate: createOnboarding,
    isPending: creatingOnboarding,
  } = useCompleteOnboarding();
  const {
    mutate: revertOnboarding,
    isPending: revertingOnboarding,
  } = useRevertOnboarding();

  const canPerformActions = isLeadership || isTechnical;

  const handleAddOnloading = () => {
    setFormOpen(true);
  };

  const handleSaveOnloading = (onloadingData: Omit<PaperOnboarding, 'id' | 'date' | 'isReverted' | 'paperType'> & { papers: { paperType: string, unitQuantity: number, amount: number }[] }) => {
    const newData = {
      data: onloadingData
    }
    createOnboarding(newData, {
      onSuccess: (data) => {
        toast.success(data.message);
        refetch()
        closeOnloading();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  };

  const closeOnloading = () => {
    setFormOpen(false);
  }

  const handleRevertClick = (onloadingId: string) => {
    setSelectedOnloadingId(onloadingId);
    setConfirmOpen(true);
  };

  const handleConfirmRevert = () => {
    if (selectedOnloadingId) {
      const newData = {
        id: selectedOnloadingId
      }
      revertOnboarding(newData, {
        onSuccess: (data) => {
          toast.success(data.message);
          refetch()
          closeRevertModal();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      })
    }
    else {
      closeRevertModal()
    }
  };

  const closeRevertModal = () => {
    setSelectedOnloadingId(null);
    setConfirmOpen(false)
  }

  if (isloadingOnboarding) return <p>Loading...</p>;
  if (errorFetchingOnboarding) return <p>{errorFetchingOnboarding.message}</p>;

  const disableButtons = creatingOnboarding || revertingOnboarding

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Paper Onboarding History</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            {canPerformActions && (
              <Button size="sm" onClick={handleAddOnloading}>
                <PlusCircle />
                Add New Purchase
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <OnboardingTable
            data={onboardingData?.onboardings || []}
            onRevertClick={handleRevertClick}
            currentPage={onboardingData?.page}
            totalPages={onboardingData?.totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <OnboardingFormDialog
        isOpen={isFormOpen}
        onOpenChange={setFormOpen}
        onSave={handleSaveOnloading}
        disableButtons={disableButtons}
      />

      <RevertConfirmationDialog
        isOpen={isConfirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmRevert}
        onCLose={closeRevertModal}
        disableButtons={disableButtons}
      />
    </div>
  );
}
