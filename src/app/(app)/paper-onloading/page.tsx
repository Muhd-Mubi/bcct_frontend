'use client';

import React, { useState, useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OnloadingTable } from '@/components/paper-onloading/onloading-table';
import { PaperOnloading } from '@/lib/data';
import { OnloadingFormDialog } from '@/components/paper-onloading/onloading-form-dialog';
import { Input } from '@/components/ui/input';
import { useData } from '@/context/data-context';
import { RevertConfirmationDialog } from '@/components/paper-onloading/revert-confirmation-dialog';


export default function PaperOnloadingPage() {
  const { onloadings, saveOnloading, revertOnloading } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [selectedOnloadingId, setSelectedOnloadingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddOnloading = () => {
    setFormOpen(true);
  };

  const handleSaveOnloading = (onloadingData: Omit<PaperOnloading, 'id' | 'date'>) => {
    saveOnloading(onloadingData);
    setFormOpen(false);
  };
  
  const handleRevertClick = (onloadingId: string) => {
    setSelectedOnloadingId(onloadingId);
    setConfirmOpen(true);
  };

  const handleConfirmRevert = () => {
    if (selectedOnloadingId) {
      revertOnloading(selectedOnloadingId);
    }
    setConfirmOpen(false);
    setSelectedOnloadingId(null);
  };


  const filteredData = useMemo(() => {
    return onloadings.filter((o) =>
      o.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [onloadings, searchTerm]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Paper Onloading History</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button size="sm" onClick={handleAddOnloading}>
              <PlusCircle />
              Add New Purchase
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <OnloadingTable data={filteredData} onRevertClick={handleRevertClick}/>
        </CardContent>
      </Card>

      <OnloadingFormDialog
        isOpen={isFormOpen}
        onOpenChange={setFormOpen}
        onSave={handleSaveOnloading}
      />

      <RevertConfirmationDialog
        isOpen={isConfirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmRevert}
      />
    </div>
  );
}
