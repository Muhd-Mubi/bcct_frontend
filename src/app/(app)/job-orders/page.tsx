'use client';

import React, { useState, useMemo, useContext, useEffect } from 'react';
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
import { useDeleteJob, useCreateJob, useEditJob, useGetJobs } from '@/api/react-query/queries/jobOrder'
import { toast } from 'react-toastify';

export default function JobOrdersPage() {
  const { jobOrders, workOrders, saveJobOrder, deleteJobOrder } = useData();
  const { role } = useContext(UserRoleContext);
  const router = useRouter();

  useEffect(() => {
    if (role === 'technical') {
      // router.push('/dashboard');
    }
  }, [role, router]);

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | undefined>(undefined);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const { data, isLoading, error, refetch } = useGetJobs(currentPage);
  const {
    mutate: createJob,
    isPending: creatingJob,
  } = useCreateJob();
  const {
    mutate: editJob,
    isPending: updatingJob,
  } = useEditJob();
  const {
    mutate: deleteJob,
    isPending: deletingJob,
  } = useDeleteJob();

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
      const deleteData = {
        id : jobToDelete
      }
      deleteJob(deleteData, {
        onSuccess: (data) => {
          toast.success(data.message);
          refetch()
          closeCreateEditModal()
        },
        onError: (error) => {
          toast.error(error.message);
        },
      })
    }
    closeDeletModal()
  };

  const handleSaveJobOrder = (jobData: Job | Omit<Job, 'date'>) => {
    const isEdit = !!jobData?._id

    if (isEdit) {
      const updatedData = {
        id: jobData?.job_id,
        data: jobData
      }
      editJob(updatedData, {
        onSuccess: (data) => {
          toast.success(data.message);
          refetch()
          closeCreateEditModal()
        },
        onError: (error) => {
          toast.error(error.message);
        },
      })
    } else {
      const newData = {
        data: jobData
      }
      createJob(newData, {
        onSuccess: (data) => {
          toast.success(data.message);
          refetch()
          closeCreateEditModal();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      })
    }
  };

  const closeCreateEditModal = () => {
    setSelectedJob(undefined);
    setCreateOpen(false);
  }

  const closeDeletModal = () => {
    setDeleteOpen(false);
    setJobToDelete(null);
  }

  const filteredJobOrders = useMemo(() => {
    return (jobOrders || []).filter(
      (j) => j.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobOrders, searchTerm]);

  // const paginatedJobOrders = useMemo(() => {
  //   const startIndex = (currentPage - 1) * jobsPerPage;
  //   return filteredJobOrders.slice(startIndex, startIndex + jobsPerPage);
  // }, [filteredJobOrders, currentPage]);

  const totalPages = Math.ceil(filteredJobOrders.length / jobsPerPage);

  // const data = {
  //   jobs: [
  //     {
  //       "_id": "69589e5c332b4a3df524cdd3",
  //       "job_id": "2",
  //       "department": "Pharmacy",
  //       "tasks": [
  //         {
  //           "name": "G1 Form",
  //           "quantity": 200
  //         },
  //         {
  //           "name": "G2 Form",
  //           "quantity": 500
  //         }
  //       ],
  //       "createdAt": "2026-01-03T04:43:08.046Z",
  //       "__v": 0,
  //       "numberOfWorkOrders": 1,
  //       "id": "69589e5c332b4a3df524cdd3"
  //     },
  //     {
  //       "_id": "69589977550f68c9157647a0",
  //       "job_id": "1",
  //       "department": "Chemistry",
  //       "tasks": [
  //         {
  //           "name": "Repeaters Form",
  //           "quantity": 50
  //         },
  //         {
  //           "name": "G1 Form",
  //           "quantity": 220
  //         }
  //       ],
  //       "createdAt": "2026-01-03T04:22:15.167Z",
  //       "__v": 0,
  //       "numberOfWorkOrders": 0,
  //       "id": "69589977550f68c9157647a0"
  //     }
  //   ]
  // }


  // if (role === 'technical') {
  //   return null;
  // }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  const disableButton = creatingJob || updatingJob || deletingJob

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
            jobOrders={data?.jobs || []}
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
        closeModal={closeCreateEditModal}
        onSave={handleSaveJobOrder}
        job={selectedJob}
        disableButton={disableButton}
      />

      <DeleteJobOrderDialog
        isOpen={isDeleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
