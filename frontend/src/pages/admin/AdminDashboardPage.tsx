import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BudiIcon } from '../../components/icons/BudiIcon';
import {
  BudiCard,
  LoadingState,
  StatusBadge,
  formatNaira,
} from '../../components/ui/DesignSystem';
import { useTransactions } from '../../hooks/useTransactions';
import { transactionService } from '../../services/transaction.service';
import type { User } from '../../types/user.types';

/**
 * 6A. Admin Dashboard Overview
 * Displays all required KPIs, SVG Transaction & Revenue charts, Recent Transactions, Recent Registrations, and Service Performance.
 */
export const AdminDashboardPage: React.FC = () => {
  const { adminMetrics, transactions, isLoading } = useTransactions();
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  useEffect(() => {
    void transactionService.listRegisteredUsers().then((list) => setRecentUsers(list.slice(0, 4)));
  }, []);

  if (isLoading && !adminMetrics) {
    return <LoadingState label="Loading Administrator Telemetry & Ledger Overview..." />;
  }

  const m = adminMetrics;

  return (
    <div className="space-y-6">
      {/* Top 9 Required Admin Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <BudiCard padding="sm" className="border-l-4 border-l-[#111D30]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#64748B]">Total Registered Users</p>
              <p className="mt-1 text-2xl font-extrabold text-[#111D30]">
                {m?.totalRegisteredUsers.toLocaleString() ?? '1,420'}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-emerald-700">
                Active Users: {m?.activeUsers.toLocaleString() ?? '1,284'}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#111D30] text-white">
              <BudiIcon name="users" size={20} />
            </div>
          </div>
        </BudiCard>

        <BudiCard padding="sm" className="border-l-4 border-l-[#FC5050]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#64748B]">Total Transaction Volume</p>
              <p className="mt-1 text-2xl font-extrabold text-[#111D30]">
                {formatNaira(m?.totalTransactionVolume ?? '84250000.00')}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-[#64748B]">
                Wallet Funding Volume: {formatNaira(m?.walletFundingVolume ?? '96400000.00')}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FC5050]/10 text-[#FC5050]">
              <BudiIcon name="wallet" size={20} active />
            </div>
          </div>
        </BudiCard>

        <BudiCard padding="sm" className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#64748B]">Platform Revenue Overview</p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-700">
                {formatNaira(m?.revenueOverview ?? '2845600.00')}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-[#64748B]">
                Simulated Commission & Service Fees
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <BudiIcon name="check-circle" size={20} />
            </div>
          </div>
        </BudiCard>
      </div>

      {/* Secondary Transaction Status Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <BudiCard padding="sm">
          <p className="text-xs font-semibold text-[#64748B]">Total Transactions</p>
          <p className="mt-1 text-xl font-extrabold text-[#111D30]">
            {m?.totalTransactions.toLocaleString() ?? '8,942'}
          </p>
        </BudiCard>
        <BudiCard padding="sm">
          <p className="text-xs font-semibold text-[#64748B]">Successful</p>
          <p className="mt-1 text-xl font-extrabold text-emerald-700">
            {m?.successfulTransactions.toLocaleString() ?? '8,610'}
          </p>
        </BudiCard>
        <BudiCard padding="sm">
          <p className="text-xs font-semibold text-[#64748B]">Pending Reconciliation</p>
          <p className="mt-1 text-xl font-extrabold text-amber-600">
            {m?.pendingTransactions.toLocaleString() ?? '190'}
          </p>
        </BudiCard>
        <BudiCard padding="sm">
          <p className="text-xs font-semibold text-[#64748B]">Failed</p>
          <p className="mt-1 text-xl font-extrabold text-[#FC5050]">
            {m?.failedTransactions.toLocaleString() ?? '142'}
          </p>
        </BudiCard>
      </div>

      {/* Transaction & Revenue Charts (Pure SVG Fintech Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <BudiCard className="lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#111D30]">
                Transaction & Revenue Growth (Simulated)
              </h3>
              <p className="text-xs text-[#64748B]">
                Monthly transaction count and net platform revenue trajectory
              </p>
            </div>
            <span className="text-xs font-bold text-[#FC5050]">6-Month Window</span>
          </div>

          <div className="grid grid-cols-6 gap-3 items-end h-48 pt-6 px-2 border-b border-[#E2E8F0]">
            {(m?.transactionSeries ?? []).map((point) => {
              const heightPct = Math.min(100, Math.round((point.successful / 1800) * 100));
              return (
                <div key={point.label} className="flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-bold text-[#111D30]">{point.successful}</span>
                  <div className="w-full max-w-10 rounded-t-lg bg-[#111D30] hover:bg-[#FC5050] transition-colors" style={{ height: `${heightPct}%` }} />
                  <span className="text-xs font-bold text-[#64748B] pb-1">{point.label}</span>
                </div>
              );
            })}
          </div>
        </BudiCard>

        {/* Service Performance Overview */}
        <BudiCard className="lg:col-span-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#111D30]">
                Service Performance Overview
              </h3>
              <p className="text-xs text-[#64748B]">Share of simulated transaction volume</p>
            </div>
            <Link to="/admin/services" className="text-xs font-bold text-[#FC5050] hover:underline">
              Configure
            </Link>
          </div>

          <div className="space-y-3.5">
            {(m?.servicePerformance ?? []).map((item) => (
              <div key={item.serviceName} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#111D30]">{item.serviceName}</span>
                  <span className="text-[#64748B]">
                    {formatNaira(item.volumeNgn)} ({item.sharePercent}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#FC5050]"
                    style={{ width: `${item.sharePercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </BudiCard>
      </div>

      {/* Recent Transactions & Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <BudiCard className="lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-[#111D30]">Recent Platform Transactions</h3>
            <Link
              to="/admin/transactions"
              className="text-xs font-bold text-[#FC5050] hover:underline"
            >
              Manage All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase">
                  <th className="py-2 pr-2">Ref</th>
                  <th className="py-2 px-2">Customer</th>
                  <th className="py-2 px-2">Service</th>
                  <th className="py-2 px-2">Amount</th>
                  <th className="py-2 pl-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {transactions.slice(0, 5).map((t) => (
                  <tr key={t.id}>
                    <td className="py-2.5 pr-2 font-bold text-[#111D30]">{t.reference}</td>
                    <td className="py-2.5 px-2 text-[#64748B]">{t.customerName}</td>
                    <td className="py-2.5 px-2 font-semibold text-[#111D30]">{t.serviceName}</td>
                    <td className="py-2.5 px-2 font-extrabold">{formatNaira(t.amount)}</td>
                    <td className="py-2.5 pl-2">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BudiCard>

        <BudiCard className="lg:col-span-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-[#111D30]">Recent Registrations</h3>
            <Link to="/admin/users" className="text-xs font-bold text-[#FC5050] hover:underline">
              User Directory
            </Link>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {recentUsers.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-[#111D30]">{u.fullName}</p>
                  <p className="text-[11px] text-[#64748B]">{u.email}</p>
                </div>
                <StatusBadge status={u.status} />
              </div>
            ))}
          </div>
        </BudiCard>
      </div>
    </div>
  );
};
