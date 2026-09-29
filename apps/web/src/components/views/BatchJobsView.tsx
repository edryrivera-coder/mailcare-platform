'use client';

import React, { useState } from 'react';
import { CheckCircle2, PlayCircle, Plus, RotateCcw, XCircle } from 'lucide-react';
import type { BatchJob, BatchJobCategory } from '@mailcare/shared-types';
import { INITIAL_BATCH_JOBS } from '@/lib/mailcare-data';
import { BatchJobsHeroGraphic } from '@/components/illustrations/HeroGraphics';

const JOB_TABS: BatchJobCategory[] = [
  'All Jobs',
  'Verification',
  'Inbox Processing',
  'CRM Sync',
  'Hygiene',
];

export function BatchJobsView({ compact = false }: { compact?: boolean }) {
  const [activeTab, setActiveTab] = useState<BatchJobCategory>('All Jobs');
  const [jobs, setJobs] = useState<BatchJob[]>(INITIAL_BATCH_JOBS);
  const [selectedJob, setSelectedJob] = useState<BatchJob | null>(null);
  const [jobToast, setJobToast] = useState<string | null>(null);

  const visibleJobs =
    activeTab === 'All Jobs' ? jobs : jobs.filter((job) => job.category === activeTab);

  function retryFailedJob(jobId: string) {
    setJobs((prev) =>
      prev.map((j) =>
        j.jobId === jobId
          ? {
              ...j,
              status: 'Running',
              progress: 35,
              completedRecords: 17500,
              checkpointRange: '000001 - 017500 (Resumed from DLQ)',
            }
          : j
      )
    );
    setJobToast(`Replayed Dead-Letter Queue (DLQ) for ${jobId}. Resumed from checkpoint cursor.`);
  }

  async function handleCreateNewBatchJob() {
    const nextJobId = `BJ-2025-00${126 + jobs.length}`;
    const newJob: BatchJob = {
      jobId: nextJobId,
      type: 'Bulk Verification (100k CSV)',
      category: 'Verification',
      status: 'Running',
      progress: 42,
      totalRecords: 100000,
      completedRecords: 42000,
      checkpointRange: '000001 - 042000 (10k Partitions)',
      createdRelative: 'Just now',
    };

    try {
      await fetch('/api/v1/verification/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: 'enterprise_contacts_100k.csv', recordCount: 100000 }),
      });
    } catch {
      // Local state still updates
    }

    setJobs((prev) => [newJob, ...prev]);
    setSelectedJob(newJob);
    setJobToast(
      `Started ${nextJobId} — 100,000 records split into 10 worker partitions of 10,000 (NFA-08).`
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-[#d8a84e]/20">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1
              className={`${
                compact ? 'text-xl' : 'text-2xl sm:text-3xl'
              } font-bold text-[#fff8eb] tracking-tight`}
            >
              Batch Jobs
            </h1>
            {!compact && (
              <button
                type="button"
                onClick={() => void handleCreateNewBatchJob()}
                className="gold-btn px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Start New Batch</span>
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#d4c5a9] mt-1">
            Process large datasets and bulk operations asynchronously with 10,000-record checkpoints.
          </p>

          {/* Sub-navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1 mt-4 p-1 rounded-xl bg-[#12100d] border border-[#d8a84e]/25">
            {JOB_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'gold-tab-active font-semibold'
                    : 'text-[#c7b99e] hover:text-[#fff8eb]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <BatchJobsHeroGraphic />
      </div>

      {jobToast && (
        <div className="px-3.5 py-2 rounded-lg bg-[#194d33]/55 border border-[#28c76f]/50 text-xs text-[#6ce8a0] flex items-center justify-between">
          <span>{jobToast}</span>
          <button
            type="button"
            onClick={() => setJobToast(null)}
            className="text-[#d4c5a9] hover:text-white ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 KPI Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="gold-card p-4">
          <span className="text-xs text-[#dfd3bc] block">Total Jobs</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-extrabold text-white">{242 + jobs.length}</span>
            <span className="text-xs font-semibold text-[#28c76f]">↑ 12%</span>
          </div>
        </div>

        <div className="gold-card p-4">
          <span className="text-xs text-[#dfd3bc] block">Running</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-extrabold text-white">
              {21 + jobs.filter((j) => j.status === 'Running').length}
            </span>
            <span className="text-xs font-semibold text-[#28c76f]">Active Workers</span>
          </div>
        </div>

        <div className="gold-card p-4">
          <span className="text-xs text-[#dfd3bc] block">Completed</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-extrabold text-white">198</span>
            <span className="text-xs font-semibold text-[#28c76f]">99.9% SLA</span>
          </div>
        </div>

        <div className="gold-card p-4">
          <span className="text-xs text-[#dfd3bc] block">Failed (DLQ)</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-extrabold text-white">
              {jobs.filter((j) => j.status === 'Failed').length}
            </span>
            {jobs.some((j) => j.status === 'Failed') ? (
              <button
                type="button"
                onClick={() => {
                  const failed = jobs.find((j) => j.status === 'Failed');
                  if (failed) retryFailedJob(failed.jobId);
                }}
                className="text-[11px] font-semibold text-[#ffca6b] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Replay DLQ
              </button>
            ) : (
              <span className="text-xs font-semibold text-[#28c76f]">0 Failed ✓</span>
            )}
          </div>
        </div>
      </div>

      {/* Batch Jobs Table Card */}
      <div className="gold-card p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#d8a84e]/20 text-[#d4c5a9]">
                <th className="py-3 px-3">Job ID</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 w-44">Progress</th>
                <th className="py-3 px-3 text-right">Completion</th>
                <th className="py-3 px-3 text-right">Created</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visibleJobs.map((job) => (
                <tr key={job.jobId} className="hover:bg-[#d8a84e]/[0.05] transition">
                  <td className="py-3 px-3 font-semibold text-[#fff8eb] whitespace-nowrap">
                    {job.jobId}
                  </td>
                  <td className="py-3 px-3 text-[#dfd3bc] whitespace-nowrap">{job.type}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {job.status === 'Running' && (
                      <span className="inline-flex items-center gap-1.5 text-[#28c76f] font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#28c76f] animate-pulse" />
                        Running
                      </span>
                    )}
                    {job.status === 'Completed' && (
                      <span className="inline-flex items-center gap-1.5 text-[#28c76f] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#28c76f]" />
                        Completed
                      </span>
                    )}
                    {job.status === 'Failed' && (
                      <span className="inline-flex items-center gap-1.5 text-[#ea5455] font-semibold">
                        <XCircle className="w-3.5 h-3.5 text-[#ea5455]" />
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          job.status === 'Failed'
                            ? 'bg-[#ea5455]'
                            : 'bg-gradient-to-r from-[#28c76f] to-[#52e593] shadow-[0_0_8px_rgba(40,199,111,0.5)]'
                        }`}
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-[#fff8eb]">
                    {job.progress}%
                  </td>
                  <td className="py-3 px-3 text-right text-[#d4c5a9] whitespace-nowrap">
                    {job.createdRelative}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(job)}
                      className="gold-btn-outline px-3.5 py-1 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkpoint & DLQ Detail Panel (NFA-11 & Sec. 31) */}
      {selectedJob && (
        <div className="gold-card p-4 border-[#eab95c]/60">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#d8a84e]/20">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-[#eab95c]" />
              <span className="text-xs sm:text-sm font-bold text-[#fff8eb]">
                Checkpoint Telemetry — {selectedJob.jobId} ({selectedJob.type})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedJob(null)}
              className="text-xs text-[#d4c5a9] hover:text-white cursor-pointer"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="gold-card-inset p-3 rounded-lg">
              <span className="text-[#c7b99e] block">Partition Progress (NFA-08)</span>
              <span className="text-white font-bold">
                {selectedJob.completedRecords.toLocaleString()} /{' '}
                {selectedJob.totalRecords.toLocaleString()} records
              </span>
            </div>
            <div className="gold-card-inset p-3 rounded-lg">
              <span className="text-[#c7b99e] block">Restartable Checkpoint Cursor (NFA-11)</span>
              <span className="text-[#f5d07e] font-mono font-semibold">
                {selectedJob.checkpointRange}
              </span>
            </div>
            <div className="gold-card-inset p-3 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[#c7b99e] block">Dead-Letter / Replay (Sec. 31)</span>
                <span className="text-white font-semibold">{selectedJob.status}</span>
              </div>
              {selectedJob.status === 'Failed' && (
                <button
                  type="button"
                  onClick={() => {
                    retryFailedJob(selectedJob.jobId);
                    setSelectedJob(null);
                  }}
                  className="gold-btn px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Replay DLQ
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
