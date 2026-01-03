'use client';

import React, { useState, useMemo, useContext } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useData } from '@/context/data-context';
import { Job, UserRoleContext } from '@/lib/types';
import { JobOrdersTable } from '@/components/job-orders/job-orders-table';
import { CreateJobOrderDialog } from '@/components/job-orders/create-job-order-dialog';
import { DeleteJobOrderDialog } from '@/components/job-orders/delete-job-order-dialog';
import { useRouter } from 'next/navigation';

export default function JobOrdersPage() {
  const { jobOrders, workOrders, saveJobOrder, deleteJobOrder } = useData();
  const { role } = useContext(UserRoleContext);
  const router = useRouter();

  if (role === 'technical') {
    router.push('/dashboard');
    return null;
  }

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | undefined>(undefined);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  
  const jobWorkOrderCounts = useMemo(() => {
    const counts: { [jobId: string]: { total: number; open: number } } = {};
    jobOrders.forEach(job => {
        const relatedWos = workOrders.filter(wo => wo.jobId === job.id);
        counts[job.id] = {
            total: relatedWos.length,
            open: relatedWos.filter(wo => wo.status === 'Pending' || wo.status === 'In Progress').length
        };
    });
    return counts;
  }, [jobOrders, workOrders]);

  const handleCreateNew = () => {
    setSelectedJob(undefined);
    setCreateOpen(true);
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setCreateOpen(true);
  };
  
  const handleDelete = (jobId: string) => {
    setJobToDelete(jobId);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (jobToDelete) {
      deleteJobOrder(jobToDelete);
    }
    setDeleteOpen(false);
    setJobToDelete(null);
  };

  const handleSaveJobOrder = (jobData: Job | Omit<Job, 'date'>) => {
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
            workOrderCounts={jobWorkOrderCounts}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <CreateJobOrderDialog
        isOpen={isCreateOpen}
        onOpenChange={setCreateOpen}
        onSave={handleSaveJobOrder}
        job={selectedJob}
      />

      <DeleteJobOrderDialog
        isOpen={isDeleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
