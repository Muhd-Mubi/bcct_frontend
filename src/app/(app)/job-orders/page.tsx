'use client';

import React, { useState, useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useData } from '@/context/data-context';
import { Job } from '@/lib/types';
import { JobOrdersTable } from '@/components/job-orders/job-orders-table';
import { CreateJobOrderDialog } from '@/components/job-orders/create-job-order-dialog';

export default function JobOrdersPage() {
  const { jobOrders, saveJobOrder } = useData();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const handleCreateNew = () => {
    setCreateOpen(true);
  };

  const handleSaveJobOrder = (jobData: Omit<Job, 'status' | 'date'>) => {
    saveJobOrder(jobData);
    setCreateOpen(false);
  };

  const filteredJobOrders = useMemo(() => {
    return (jobOrders || []).filter(
      (j) => j.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobOrders, searchTerm]);

  const paginatedJobOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    return filteredJobOrders.slice(startIndex, startIndex + jobsPerPage);
  }, [filteredJobOrders, currentPage]);

  const totalPages = Math.ceil(filteredJobOrders.length / jobsPerPage);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Job Orders</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by Job Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button size="sm" onClick={handleCreateNew}>
              <PlusCircle />
              Create New Job Order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <JobOrdersTable
            jobOrders={paginatedJobOrders}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <CreateJobOrderDialog
        isOpen={isCreateOpen}
        onOpenChange={setCreateOpen}
        onSave={handleSaveJobOrder}
      />
    </div>
  );
}
