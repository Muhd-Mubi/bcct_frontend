'use client';

import React, { useState, useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useData } from '@/context/data-context';
import { Job } from '@/lib/types';
import { JobsTable } from '@/components/jobs/jobs-table';
import { CreateJobDialog } from '@/components/jobs/create-job-dialog';

export default function JobsPage() {
  const { jobs, saveJob } = useData();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const handleCreateNew = () => {
    setCreateOpen(true);
  };

  const handleSaveJob = (jobData: Omit<Job, 'status' | 'date'>) => {
    saveJob(jobData);
    setCreateOpen(false);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(
      (j) => j.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    return filteredJobs.slice(startIndex, startIndex + jobsPerPage);
  }, [filteredJobs, currentPage]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Jobs</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by Job ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button size="sm" onClick={handleCreateNew}>
              <PlusCircle />
              Create New Job
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <JobsTable
            jobs={paginatedJobs}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <CreateJobDialog
        isOpen={isCreateOpen}
        onOpenChange={setCreateOpen}
        onSave={handleSaveJob}
      />
    </div>
  );
}
