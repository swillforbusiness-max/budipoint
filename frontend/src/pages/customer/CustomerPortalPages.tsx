import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BudiIcon } from '../../components/icons/BudiIcon';
import {
  BudiButton,
  BudiCard,
  EmptyState,
  LoadingState,
  StatusBadge,
  formatNaira,
} from '../../components/ui/DesignSystem';
import { useAuth } from '../../hooks/useAuth';
import { useTransactions } from '../../hooks/useTransactions';
import { useWallet } from '../../hooks/useWallet';
import { authService } from '../../services/auth.service';
import type { ServiceSlug } from '../../types/service.types';
import type { TransactionRecord, TransactionStatus } from '../../types/transaction.types';

/**
 * 5C. Service Dashboard — Displays all 10 platform services (7 Main + 3 Additional)
 */
export const CustomerServicesPage: React.FC = () => {
  const { services, isLoading } = useTransactions();
  const [groupFilter, setGroupFilter] = useState<'all' | 'main' | 'additional'>('all');

  if (isLoading && services.length === 0) {
    return <LoadingState label="Loading Budipoint service catalog..." />;
  }

  const filtered = services.filter((s) =>
    groupFilter === 'all' ? true : s.group === groupFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#111D30]">Digital Services Catalog</h2>
          <p className="text-sm text-[#64748B]">
            Explore all 10 Budipoint services. Third-party provider connections are modularly decoupled.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-[#E2E8F0] bg-white p-1">
          {(['all', 'main', 'additional'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setGroupFilter(tab)}
              className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold capitalize transition-colors ${
                groupFilter === tab
                  ? 'bg-[#FC5050] text-white'
                  : 'text-[#64748B] hover:text-[#111D30]'
              }`}
            >
              {tab === 'all' ? 'All Services (10)' : `${tab} Services`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((srv) => (
          <BudiCard key={srv.id} className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111D30] text-white">
                  <BudiIcon name={srv.iconName} size={22} />
                </div>
                <StatusBadge status={srv.status} />
              </div>

              <div className="mt-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FC5050]">
                  {srv.group === 'main' ? 'Core Service' : 'Additional Service'}
                </span>
                <h3 className="mt-0.5 text-base font-extrabold text-[#111D30]">{srv.name}</h3>
                <p className="mt-1.5 text-xs text-[#64748B] leading-relaxed">
                  {srv.shortDescription}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Transaction Limits</span>
                <span className="font-bold text-[#111D30]">
                  {formatNaira(srv.minAmountNgn)} – {formatNaira(srv.maxAmountNgn)}
                </span>
              </div>
              <Link to={`/app/services/${srv.slug}`} className="block">
                <BudiButton variant="primary" size="sm" className="w-full">
                  Open Service Workspace
                </BudiButton>
              </Link>
            </div>
          </BudiCard>
        ))}
      </div>
    </div>
  );
};

/**
 * Placeholder Service Page for each of the 10 services.
 * Clearly shows the dedicated structure and validation rules without inventing imaginary third-party API calls.
 */
export const ServicePlaceholderPage: React.FC = () => {
  const { slug } = useParams<{ slug: ServiceSlug }>();
  const { services } = useTransactions();
  const service = services.find((s) => s.slug === slug) ?? services[0];
  const [recipientInput, setRecipientInput] = useState('');
  const [amountInput, setAmountInput] = useState(service?.minAmountNgn ?? '1000.00');
  const [notice, setNotice] = useState<string | null>(null);

  if (!service) {
    return (
      <EmptyState
        icon="services"
        title="Service category not found"
        description="Return to the service catalog to select an available category."
      />
    );
  }

  const handlePreviewValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientInput.trim()) {
      setNotice('Validation check: Recipient identifier / phone / meter number is required.');
      return;
    }
    setNotice(
      `[SIMULATION BOUNDARY] Form validated for ${service.name} (${formatNaira(
        amountInput
      )}). Live execution is paused until third-party provider API credentials and documentation are supplied.`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/app/services"
          className="text-xs font-bold text-[#111D30] hover:text-[#FC5050] inline-flex items-center gap-1.5"
        >
          <span>← Back to Service Catalog</span>
        </Link>
        <StatusBadge status={service.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <BudiCard className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111D30] text-white">
              <BudiIcon name={service.iconName} size={24} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#111D30]">{service.name}</h2>
              <p className="text-xs text-[#64748B]">{service.shortDescription}</p>
            </div>
          </div>

          <form onSubmit={handlePreviewValidation} className="space-y-4 pt-2">
            {notice && (
              <div className="rounded-xl border border-[#FC5050]/30 bg-[#FC5050]/10 p-3.5 text-xs font-semibold text-[#111D30]">
                {notice}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111D30]">
                Recipient / Account Identifier
              </label>
              <input
                type="text"
                required
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                placeholder="Enter phone number, meter ID, or beneficiary handle"
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111D30]">
                Amount (NGN)
              </label>
              <input
                type="number"
                required
                min={parseFloat(service.minAmountNgn)}
                max={parseFloat(service.maxAmountNgn)}
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2.5 text-sm font-bold"
              />
              <p className="mt-1 text-[11px] text-[#64748B]">
                Allowed range: {formatNaira(service.minAmountNgn)} to{' '}
                {formatNaira(service.maxAmountNgn)}
              </p>
            </div>

            <BudiButton type="submit" className="w-full">
              Validate Request (Provider Integration Pending)
            </BudiButton>
          </form>
        </BudiCard>

        <BudiCard className="lg:col-span-5 space-y-4 bg-[#111D30] text-white">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#FC5050]">
            API Integration Readiness
          </h3>
          <p className="text-xs text-[#64748B]">{service.providerStatusNote}</p>
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] p-4 text-xs space-y-2 text-[#111D30]">
            <p className="font-bold">Planned Integration Contract:</p>
            <ul className="list-disc pl-4 space-y-1 text-[#64748B]">
              <li>Frontend Hook → `servicesApi.getServiceBySlug('{service.slug}')`</li>
              <li>Laravel Endpoint → `POST /api/v1/customer/services/{service.slug}/purchase`</li>
              <li>Database Lock → PostgreSQL `DECIMAL(15,2)` atomic wallet debit</li>
              <li>External Adapter → Ready for third-party provider credentials</li>
            </ul>
          </div>
        </BudiCard>
      </div>
    </div>
  );
};

/**
 * 5D. Customer Wallet Page
 */
export const CustomerWalletPage: React.FC = () => {
  const { wallet, ledger, simulateFundWallet, isSubmitting, isLoading } = useWallet();
  const [amount, setAmount] = useState('50000');
  const [channel, setChannel] = useState<'bank_transfer' | 'card_simulation'>('bank_transfer');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (isLoading && !wallet) {
    return <LoadingState label="Loading wallet balance and ledger..." />;
  }

  const handleFund = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const res = await simulateFundWallet({ amount, channel });
    setFeedback(
      `[SIMULATED] Wallet credited with ${formatNaira(res.entry.amount)} (${res.entry.reference}).`
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <BudiCard className="lg:col-span-5 space-y-4">
          <span className="inline-flex items-center rounded-full bg-[#FC5050]/10 px-3 py-1 text-xs font-bold text-[#FC5050]">
            Simulated NGN Wallet
          </span>
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Available Balance</p>
            <h2 className="text-3xl font-extrabold text-[#111D30]">
              {formatNaira(wallet?.availableBalance ?? '0.00')}
            </h2>
            <p className="mt-1 text-xs text-[#64748B]">
              Ledger Balance: {formatNaira(wallet?.ledgerBalance ?? '0.00')} • Wallet #
              {wallet?.walletNumber}
            </p>
          </div>

          <form onSubmit={handleFund} className="space-y-3 pt-3 border-t border-[#E2E8F0]">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#111D30]">
              Simulate Wallet Top-Up
            </p>
            {feedback && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800">
                {feedback}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="number"
                min="100"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3 py-2 text-sm font-bold"
                placeholder="Amount (NGN)"
              />
              <select
                value={channel}
                onChange={(e) =>
                  setChannel(e.target.value as 'bank_transfer' | 'card_simulation')
                }
                className="rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3 py-2 text-xs font-semibold"
              >
                <option value="bank_transfer">Bank Transfer (Sim)</option>
                <option value="card_simulation">Card Payment (Sim)</option>
              </select>
            </div>
            <BudiButton type="submit" isLoading={isSubmitting} icon="plus" className="w-full">
              Simulate Wallet Funding
            </BudiButton>
          </form>
        </BudiCard>

        <BudiCard className="lg:col-span-7">
          <h3 className="text-base font-extrabold text-[#111D30] mb-4">
            Wallet Funding & Debit/Credit Ledger
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase">
                  <th className="py-2.5 pr-3">Reference</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Balance After</th>
                  <th className="py-2.5 pl-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {ledger.map((entry) => (
                  <tr key={entry.id}>
                    <td className="py-3 pr-3">
                      <p className="font-bold text-[#111D30]">{entry.reference}</p>
                      <p className="text-[11px] text-[#64748B]">{entry.narration}</p>
                    </td>
                    <td className="py-3 px-3 uppercase font-bold">
                      <span
                        className={
                          entry.type === 'credit' ? 'text-emerald-700' : 'text-[#111D30]'
                        }
                      >
                        {entry.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-[#111D30]">
                      {formatNaira(entry.amount)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#64748B]">
                      {formatNaira(entry.balanceAfter)}
                    </td>
                    <td className="py-3 pl-3">
                      <StatusBadge status={entry.status} />
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
 * 5E. Customer Transactions History Page with Search, Date Filters, Status Filters, Modal Details, and Pagination
 */
export const CustomerTransactionsPage: React.FC = () => {
  const { transactions, filters, updateFilters, services } = useTransactions();
  const [selectedTrx, setSelectedTrx] = useState<TransactionRecord | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 5;

  const totalPages = Math.max(1, Math.ceil(transactions.length / perPage));
  const paginated = transactions.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#111D30]">Transaction History</h2>
        <p className="text-sm text-[#64748B]">
          Search and filter your simulated digital service orders and wallet transactions.
        </p>
      </div>

      {/* Filters Bar */}
      <BudiCard padding="sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <input
              type="text"
              value={filters.search ?? ''}
              onChange={(e) => {
                setPage(1);
                updateFilters({ search: e.target.value });
              }}
              placeholder="Search reference or service..."
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-xs"
            />
          </div>

          <select
            value={filters.status ?? 'all'}
            onChange={(e) => {
              setPage(1);
              updateFilters({ status: e.target.value as TransactionStatus | 'all' });
            }}
            className="rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-xs font-semibold"
          >
            <option value="all">All Statuses</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={filters.serviceSlug ?? 'all'}
            onChange={(e) => {
              setPage(1);
              updateFilters({ serviceSlug: e.target.value });
            }}
            className="rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-xs font-semibold"
          >
            <option value="all">All Service Categories</option>
            <option value="wallet-funding">Wallet Funding</option>
            {services.map((s) => (
              <option key={s.id} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filters.dateFrom ?? ''}
            onChange={(e) => {
              setPage(1);
              updateFilters({ dateFrom: e.target.value });
            }}
            className="rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-xs"
          />
        </div>
      </BudiCard>

      {/* Transactions Table */}
      <BudiCard>
        {paginated.length === 0 ? (
          <EmptyState
            icon="search"
            title="No matching transactions"
            description="Try adjusting your search query or status filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase">
                  <th className="py-3 pr-3">Reference</th>
                  <th className="py-3 px-3">Service Category</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 pl-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {paginated.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 pr-3 font-bold text-[#111D30]">{trx.reference}</td>
                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-[#111D30]">{trx.serviceName}</p>
                      <p className="text-[11px] text-[#64748B]">{trx.recipient}</p>
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-[#111D30]">
                      {formatNaira(trx.amount)}
                    </td>
                    <td className="py-3.5 px-3 text-[#64748B]">
                      {new Date(trx.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={trx.status} />
                    </td>
                    <td className="py-3.5 pl-3 text-right">
                      <BudiButton
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTrx(trx)}
                      >
                        Inspect
                      </BudiButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <span>
            Page {page} of {totalPages} ({transactions.length} records)
          </span>
          <div className="flex gap-2">
            <BudiButton
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </BudiButton>
            <BudiButton
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </BudiButton>
          </div>
        </div>
      </BudiCard>

      {/* Transaction Detail Modal */}
      {selectedTrx && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#111D30]/60 p-4"
          onClick={() => setSelectedTrx(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#E2E8F0] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-base font-extrabold text-[#111D30]">
                Simulated Transaction Receipt
              </h3>
              <StatusBadge status={selectedTrx.status} />
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Reference</span>
                <span className="font-bold text-[#111D30]">{selectedTrx.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Service</span>
                <span className="font-bold text-[#111D30]">{selectedTrx.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Amount</span>
                <span className="font-extrabold text-[#111D30]">
                  {formatNaira(selectedTrx.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Recipient</span>
                <span className="font-semibold text-[#111D30]">{selectedTrx.recipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Provider Reference</span>
                <span className="font-mono text-[#111D30]">{selectedTrx.providerReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Mode</span>
                <span className="font-bold text-[#FC5050]">SIMULATED / MOCK</span>
              </div>
            </div>
            <BudiButton
              variant="navy"
              className="w-full"
              onClick={() => setSelectedTrx(null)}
            >
              Close Receipt
            </BudiButton>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 5F. Customer User Profile & Settings Page
 */
export const CustomerProfilePage: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? '');
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ fullName, phoneNumber });
    setProfileMsg('[SIMULATED] Personal profile updated.');
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = await authService.changePassword({
      currentPassword,
      newPassword,
      newPasswordConfirmation,
    });
    setPasswordMsg(msg);
    setCurrentPassword('');
    setNewPassword('');
    setNewPasswordConfirmation('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <BudiCard className="lg:col-span-6 space-y-4">
        <h3 className="text-base font-extrabold text-[#111D30]">Personal & Account Information</h3>
        {profileMsg && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800">
            {profileMsg}
          </div>
        )}
        <form onSubmit={handleProfileSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold uppercase text-[#111D30]">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-[#111D30]">
              Email Address (Verified)
            </label>
            <input
              type="email"
              disabled
              value={user?.email ?? ''}
              className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-slate-100 px-3.5 py-2 text-sm text-[#64748B]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-[#111D30]">Phone Number</label>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-sm"
            />
          </div>
          <BudiButton type="submit" isLoading={isLoading}>
            Save Profile Changes
          </BudiButton>
        </form>
      </BudiCard>

      <div className="lg:col-span-6 space-y-6">
        <BudiCard className="space-y-4">
          <h3 className="text-base font-extrabold text-[#111D30]">Change Password & Security</h3>
          {passwordMsg && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800">
              {passwordMsg}
            </div>
          )}
          <form onSubmit={handlePasswordSave} className="space-y-3">
            <input
              type="password"
              required
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-sm"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="password"
                required
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-sm"
              />
              <input
                type="password"
                required
                placeholder="Confirm new password"
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2 text-sm"
              />
            </div>
            <BudiButton type="submit" variant="navy" size="sm">
              Update Security Credentials
            </BudiButton>
          </form>
        </BudiCard>

        <BudiCard className="space-y-3">
          <h3 className="text-base font-extrabold text-[#111D30]">Notification Preferences</h3>
          {[
            { label: 'Email Transaction Receipts', checked: emailAlerts, set: setEmailAlerts },
            { label: 'SMS Wallet Alerts', checked: smsAlerts, set: setSmsAlerts },
            { label: 'Sanctum Login Security Alerts', checked: loginAlerts, set: setLoginAlerts },
          ].map((pref) => (
            <label
              key={pref.label}
              className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2.5 text-xs font-semibold"
            >
              <span>{pref.label}</span>
              <input
                type="checkbox"
                checked={pref.checked}
                onChange={(e) => pref.set(e.target.checked)}
                className="h-4 w-4 accent-[#FC5050]"
              />
            </label>
          ))}
        </BudiCard>
      </div>
    </div>
  );
};
