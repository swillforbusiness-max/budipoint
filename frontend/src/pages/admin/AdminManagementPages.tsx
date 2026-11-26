import React, { useEffect, useState } from 'react';
import {
  BudiButton,
  BudiCard,
  StatusBadge,
  formatNaira,
} from '../../components/ui/DesignSystem';
import { useTransactions } from '../../hooks/useTransactions';
import { useWallet } from '../../hooks/useWallet';
import { transactionService } from '../../services/transaction.service';
import type { AuditLogRecord, TransactionStatus } from '../../types/transaction.types';
import type { AccountStatus, User } from '../../types/user.types';

/**
 * 6B. Administrator User Management Page
 */
export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadUsers = async () => {
    const list = await transactionService.listRegisteredUsers(search, statusFilter);
    setUsers(list);
  };

  useEffect(() => {
    void loadUsers();
  }, [search, statusFilter]);

  const handleToggleStatus = async (u: User) => {
    const nextStatus: AccountStatus = u.status === 'suspended' ? 'active' : 'suspended';
    const updated = await transactionService.updateUserAccountStatus(
      u.id,
      nextStatus,
      `Admin console status toggle to ${nextStatus}`
    );
    setUsers((prev) => prev.map((item) => (item.id === u.id ? updated : item)));
    setFeedback(`[SIMULATED] ${updated.fullName} account status updated to ${updated.status}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#111D30]">Customer Directory & Controls</h2>
          <p className="text-sm text-[#64748B]">
            Search customers, review profiles, and activate or suspend accounts with audit logging.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
          {feedback}
        </div>
      )}

      <BudiCard padding="sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer name, email, or phone..."
            className="sm:col-span-2 rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-xs"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-xs font-semibold"
          >
            <option value="all">All Account Statuses</option>
            <option value="active">Active</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </BudiCard>

      <BudiCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase">
                <th className="py-3 pr-3">Customer</th>
                <th className="py-3 px-3">Phone</th>
                <th className="py-3 px-3">Joined</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-3.5 pr-3">
                    <p className="font-bold text-[#111D30]">{u.fullName}</p>
                    <p className="text-[11px] text-[#64748B]">{u.email}</p>
                  </td>
                  <td className="py-3.5 px-3 text-[#111D30]">{u.phoneNumber}</td>
                  <td className="py-3.5 px-3 text-[#64748B]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="py-3.5 pl-3 text-right space-x-2">
                    <BudiButton
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(u)}
                    >
                      Profile
                    </BudiButton>
                    <BudiButton
                      variant={u.status === 'suspended' ? 'navy' : 'primary'}
                      size="sm"
                      onClick={() => void handleToggleStatus(u)}
                    >
                      {u.status === 'suspended' ? 'Activate' : 'Suspend'}
                    </BudiButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BudiCard>

      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#111D30]/60 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#E2E8F0] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-base font-extrabold text-[#111D30]">Customer Profile Dossier</h3>
              <StatusBadge status={selectedUser.status} />
            </div>
            <div className="space-y-2 text-xs">
              <p>
                <span className="text-[#64748B]">Customer ID:</span>{' '}
                <span className="font-mono font-bold">{selectedUser.id}</span>
              </p>
              <p>
                <span className="text-[#64748B]">Full Name:</span>{' '}
                <span className="font-bold">{selectedUser.fullName}</span>
              </p>
              <p>
                <span className="text-[#64748B]">Email:</span>{' '}
                <span className="font-bold">{selectedUser.email}</span>
              </p>
              <p>
                <span className="text-[#64748B]">Phone:</span>{' '}
                <span className="font-bold">{selectedUser.phoneNumber}</span>
              </p>
            </div>
            <BudiButton
              variant="navy"
              className="w-full"
              onClick={() => setSelectedUser(null)}
            >
              Close Dossier
            </BudiButton>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 6C. Administrator Transaction Management & Reconciliation Page
 */
export const AdminTransactionsPage: React.FC = () => {
  const { transactions, filters, updateFilters, services } = useTransactions();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#111D30]">
          Platform Transaction Ledger & Reconciliation
        </h2>
        <p className="text-sm text-[#64748B]">
          Inspect customer transactions and provider response references across all service categories.
        </p>
      </div>

      <BudiCard padding="sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={filters.search ?? ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
            placeholder="Search reference, customer, or provider ID..."
            className="rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-xs"
          />
          <select
            value={filters.status ?? 'all'}
            onChange={(e) =>
              updateFilters({ status: e.target.value as TransactionStatus | 'all' })
            }
            className="rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-xs font-semibold"
          >
            <option value="all">All Transaction Statuses</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={filters.serviceSlug ?? 'all'}
            onChange={(e) => updateFilters({ serviceSlug: e.target.value })}
            className="rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-xs font-semibold"
          >
            <option value="all">All Services</option>
            <option value="wallet-funding">Wallet Funding</option>
            {services.map((s) => (
              <option key={s.id} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </BudiCard>

      <BudiCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase">
                <th className="py-3 pr-3">Reference</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Service</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Provider Ref</th>
                <th className="py-3 pl-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="py-3.5 pr-3 font-bold text-[#111D30]">{t.reference}</td>
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-[#111D30]">{t.customerName}</p>
                    <p className="text-[11px] text-[#64748B]">{t.customerEmail}</p>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#111D30]">{t.serviceName}</td>
                  <td className="py-3.5 px-3 font-extrabold text-[#111D30]">
                    {formatNaira(t.amount)}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#64748B]">{t.providerReference}</td>
                  <td className="py-3.5 pl-3">
                    <StatusBadge status={t.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BudiCard>
    </div>
  );
};

/**
 * 6D. Administrator Service Management Page
 */
export const AdminServicesPage: React.FC = () => {
  const { services, updateServiceConfiguration } = useTransactions();
  const [notice, setNotice] = useState<string | null>(null);

  const handleToggleEnable = async (srvId: string, currentEnabled: boolean) => {
    const updated = await updateServiceConfiguration(srvId, {
      isEnabled: !currentEnabled,
      status: !currentEnabled ? 'ready_for_api' : 'disabled',
    });
    setNotice(`[SIMULATED] Service "${updated.name}" availability updated.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#111D30]">Platform Service Catalog Management</h2>
        <p className="text-sm text-[#64748B]">
          Enable, disable, or update availability across all 10 digital service categories.
        </p>
      </div>

      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((srv) => (
          <BudiCard key={srv.id} className="flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FC5050]">
                  {srv.group} category
                </span>
                <h3 className="text-base font-extrabold text-[#111D30]">{srv.name}</h3>
                <p className="mt-1 text-xs text-[#64748B]">{srv.shortDescription}</p>
              </div>
              <StatusBadge status={srv.status} />
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-xs text-[#64748B]">
                Limits: {formatNaira(srv.minAmountNgn)} – {formatNaira(srv.maxAmountNgn)}
              </span>
              <BudiButton
                variant={srv.isEnabled ? 'outline' : 'primary'}
                size="sm"
                onClick={() => void handleToggleEnable(srv.id, srv.isEnabled)}
              >
                {srv.isEnabled ? 'Disable Service' : 'Enable Service'}
              </BudiButton>
            </div>
          </BudiCard>
        ))}
      </div>
    </div>
  );
};

/**
 * 6E. Administrator Wallet Management & Audited Manual Adjustment Page
 */
export const AdminWalletsPage: React.FC = () => {
  const { wallet, ledger, submitManualAdjustment, isSubmitting } = useWallet();
  const [type, setType] = useState<'credit' | 'debit'>('credit');
  const [amount, setAmount] = useState('5000');
  const [reason, setReason] = useState('');
  const [authCode, setAuthCode] = useState('ADM-AUTH-2026');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [formErr, setFormErr] = useState<string | null>(null);

  const handleManualAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setFormErr(null);
    try {
      const entry = await submitManualAdjustment({
        walletId: wallet?.id ?? 'wal-001',
        type,
        amount,
        reason,
        authorizationCode: authCode,
      });
      setFeedback(`[SIMULATED AUDIT] Manual ${type} logged under reference ${entry.reference}.`);
      setReason('');
    } catch (err) {
      setFormErr(err instanceof Error ? err.message : 'Manual adjustment rejected.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#111D30]">
          Customer Wallet Records & Audited Adjustments
        </h2>
        <p className="text-sm text-[#64748B]">
          Every manual wallet adjustment requires supervisor authorization, an audit record, and a mandatory reason.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <BudiCard className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-extrabold text-[#111D30]">
            Manual Wallet Adjustment (Audited)
          </h3>
          {formErr && (
            <div className="rounded-xl border border-[#FC5050]/30 bg-[#FC5050]/10 p-3 text-xs font-semibold text-[#FC5050]">
              {formErr}
            </div>
          )}
          {feedback && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
              {feedback}
            </div>
          )}
          <form onSubmit={handleManualAdjustment} className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase text-[#111D30]">
                Target Customer Wallet
              </label>
              <input
                type="text"
                disabled
                value={`#${wallet?.walletNumber ?? '9048210394'} — Adebayo Ogunlesi (${formatNaira(
                  wallet?.availableBalance ?? '184500.00'
                )})`}
                className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-slate-100 px-3 py-2 text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold uppercase text-[#111D30]">Action</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'credit' | 'debit')}
                  className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3 py-2 text-xs font-bold"
                >
                  <option value="credit">Credit (+)</option>
                  <option value="debit">Debit (-)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#111D30]">
                  Amount (NGN)
                </label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#111D30]">
                Authorization Code
              </label>
              <input
                type="text"
                required
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#111D30]">
                Mandatory Audit Reason (Min 10 chars)
              </label>
              <textarea
                rows={2}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="State reconciliation reference and reason for manual adjustment..."
                className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3 py-2 text-xs"
              />
            </div>

            <BudiButton type="submit" isLoading={isSubmitting} className="w-full">
              Execute Audited Wallet Adjustment
            </BudiButton>
          </form>
        </BudiCard>

        <BudiCard className="lg:col-span-7">
          <h3 className="text-base font-extrabold text-[#111D30] mb-4">
            Wallet Funding & Adjustment Ledger
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase">
                  <th className="py-2.5 pr-2">Reference</th>
                  <th className="py-2.5 px-2">Channel</th>
                  <th className="py-2.5 px-2">Amount</th>
                  <th className="py-2.5 pl-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {ledger.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 pr-2">
                      <p className="font-bold text-[#111D30]">{item.reference}</p>
                      <p className="text-[11px] text-[#64748B]">{item.narration}</p>
                    </td>
                    <td className="py-3 px-2 uppercase font-semibold text-[#64748B]">
                      {item.channel.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-2 font-extrabold text-[#111D30]">
                      {item.type === 'credit' ? '+' : '-'}
                      {formatNaira(item.amount)}
                    </td>
                    <td className="py-3 pl-2">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BudiCard>
      </div>
    </div>
  );
};

/**
 * 6F. Administrative Settings, Audit Logs, and API Configuration Placeholders
 * Never exposes secret API keys in frontend code.
 */
export const AdminSettingsPage: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);

  useEffect(() => {
    void transactionService.listAuditLogs().then(setAuditLogs);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#111D30]">
          Administrative Settings, Audit Trail & Provider Slots
        </h2>
        <p className="text-sm text-[#64748B]">
          Secret API keys are stored exclusively in backend server environment variables (`backend/.env`) and never exposed to the browser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <BudiCard className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-extrabold text-[#111D30]">
            Third-Party Provider Configuration Slots
          </h3>
          <p className="text-xs text-[#64748B]">
            Ready for future backend credential injection via Laravel service providers:
          </p>
          <div className="space-y-2.5 text-xs">
            {[
              { slot: 'VTU Airtime & Data Aggregator', envKey: 'PROVIDER_VTU_API_URL' },
              { slot: 'Electricity & Cable TV Biller', envKey: 'PROVIDER_BILLS_API_URL' },
              { slot: 'Global Gift Card & eSIM Carrier', envKey: 'PROVIDER_ESIM_API_URL' },
              { slot: 'SMS Verification & Number Rental', envKey: 'PROVIDER_SMS_VERIFY_URL' },
              { slot: 'Virtual Card & Payment Gateway', envKey: 'PAYMENT_GATEWAY_WEBHOOK_URL' },
            ].map((item) => (
              <div
                key={item.envKey}
                className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2.5"
              >
                <div>
                  <p className="font-bold text-[#111D30]">{item.slot}</p>
                  <p className="font-mono text-[11px] text-[#64748B]">{item.envKey}</p>
                </div>
                <StatusBadge status="ready_for_api" />
              </div>
            ))}
          </div>
        </BudiCard>

        <BudiCard className="lg:col-span-7">
          <h3 className="text-base font-extrabold text-[#111D30] mb-4">
            Immutable Administrative Audit Logs
          </h3>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] p-3.5 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#111D30]">{log.action}</span>
                  <span className="text-[11px] text-[#64748B]">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-[#111D30]">{log.reason}</p>
                <p className="text-[11px] text-[#64748B]">
                  Actor: {log.actorName} ({log.actorRole}) • Target: {log.entityType} [
                  {log.entityId}] • IP: {log.ipAddress}
                </p>
              </div>
            ))}
          </div>
        </BudiCard>
      </div>
    </div>
  );
};
