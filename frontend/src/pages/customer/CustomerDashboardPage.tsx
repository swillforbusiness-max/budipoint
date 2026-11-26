import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
import { useWallet } from '../../hooks/useWallet';
import { useTransactions } from '../../hooks/useTransactions';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { wallet, simulateFundWallet, isSubmitting } = useWallet();
  const { transactions, customerMetrics, services, isLoading } = useTransactions();
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('25000');
  const [fundChannel, setFundChannel] = useState<'bank_transfer' | 'card_simulation'>('bank_transfer');
  const [fundMessage, setFundMessage] = useState<string | null>(null);
  const [fundError, setFundError] = useState<string | null>(null);

  if (isLoading && !customerMetrics) {
    return <LoadingState label="Loading your Budipoint dashboard..." />;
  }

  const handleSimulatedFund = async (e: React.FormEvent) => {
    e.preventDefault();
    setFundError(null);
    setFundMessage(null);
    try {
      const res = await simulateFundWallet({ amount: fundAmount, channel: fundChannel });
      setFundMessage(
        `[SIMULATED] Credited ${formatNaira(res.entry.amount)} (Ref: ${res.entry.reference}).`
      );
    } catch (err) {
      setFundError(err instanceof Error ? err.message : 'Unable to simulate funding.');
    }
  };

  const quickServices = services.slice(0, 6);
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Wallet & Welcome Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl bg-[#111D30] text-white p-6 sm:p-8 flex flex-col justify-between shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FC5050]">
                NGN Sandbox Wallet #{wallet?.walletNumber ?? '9048210394'}
              </span>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/70">
                Available Balance (Simulated)
              </p>
              <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight">
                {formatNaira(wallet?.availableBalance ?? customerMetrics?.walletBalance ?? '0.00')}
              </h2>
            </div>

            <BudiButton
              variant="primary"
              icon="plus"
              onClick={() => {
                setFundMessage(null);
                setFundError(null);
                setFundModalOpen(true);
              }}
            >
              Fund Wallet
            </BudiButton>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/75">
            <div>
              <span className="block text-white/50">Account Holder</span>
              <span className="font-bold text-white">{user?.fullName}</span>
            </div>
            <div>
              <span className="block text-white/50">Ledger Balance</span>
              <span className="font-bold text-white">
                {formatNaira(wallet?.ledgerBalance ?? '189500.00')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/app/wallet"
                className="font-bold text-[#FC5050] hover:underline inline-flex items-center gap-1"
              >
                <span>Wallet Ledger</span>
                <BudiIcon name="chevron-right" size={14} active />
              </Link>
              <Link
                to="/app/profile"
                className="font-bold text-white hover:underline inline-flex items-center gap-1"
              >
                <span>Profile</span>
                <BudiIcon name="chevron-right" size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Transaction KPI Summary Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
          <BudiCard padding="sm" className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#64748B]">Total Transactions</p>
              <p className="mt-1 text-2xl font-extrabold text-[#111D30]">
                {customerMetrics?.totalTransactions ?? transactions.length}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#111D30]/5 text-[#111D30]">
              <BudiIcon name="transactions" size={22} />
            </div>
          </BudiCard>

          <BudiCard padding="sm" className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#64748B]">Successful Transactions</p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-700">
                {customerMetrics?.successfulTransactions ?? 25}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <BudiIcon name="check-circle" size={22} />
            </div>
          </BudiCard>

          <BudiCard padding="sm" className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#64748B]">Pending Transactions</p>
              <p className="mt-1 text-2xl font-extrabold text-amber-600">
                {customerMetrics?.pendingTransactions ?? 2}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <BudiIcon name="clock" size={22} />
            </div>
          </BudiCard>
        </div>
      </div>

      {/* Quick Service Shortcuts */}
      <BudiCard>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-extrabold text-[#111D30]">Quick Service Shortcuts</h3>
            <p className="text-xs text-[#64748B]">
              Instant access to Budipoint digital service categories
            </p>
          </div>
          <Link
            to="/app/services"
            className="text-xs font-bold text-[#FC5050] hover:underline inline-flex items-center gap-1"
          >
            <span>All 10 Services</span>
            <BudiIcon name="chevron-right" size={14} active />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {quickServices.map((srv) => (
            <Link
              key={srv.id}
              to={`/app/services/${srv.slug}`}
              className="group rounded-2xl border border-[#E2E8F0] bg-[#F8F9FB] p-4 hover:border-[#FC5050] hover:bg-white transition-all flex flex-col justify-between"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#E2E8F0] text-[#111D30] group-hover:border-[#FC5050]/30 group-hover:text-[#FC5050]">
                <BudiIcon name={srv.iconName} size={20} />
              </div>
              <div className="mt-3">
                <p className="text-xs font-extrabold text-[#111D30] group-hover:text-[#FC5050]">
                  {srv.name}
                </p>
                <p className="mt-0.5 text-[11px] text-[#64748B] line-clamp-1">
                  From {formatNaira(srv.minAmountNgn)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </BudiCard>

      {/* Recent Transactions & Notifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <BudiCard className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#111D30]">Recent Transactions</h3>
              <p className="text-xs text-[#64748B]">
                Simulated wallet inflows and digital service orders
              </p>
            </div>
            <Link
              to="/app/transactions"
              className="text-xs font-bold text-[#FC5050] hover:underline"
            >
              View Full History
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <EmptyState
              icon="transactions"
              title="No transactions yet"
              description="Simulated service purchases and wallet funding entries will appear here."
            />
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {recentTransactions.map((trx) => (
                <div
                  key={trx.id}
                  className="py-3.5 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        trx.type === 'credit'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-[#111D30]/5 text-[#111D30]'
                      }`}
                    >
                      <BudiIcon
                        name={trx.type === 'credit' ? 'arrow-down-left' : 'arrow-up-right'}
                        size={18}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111D30]">{trx.serviceName}</p>
                      <p className="text-xs text-[#64748B]">
                        {trx.reference} • {new Date(trx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p
                        className={`text-sm font-extrabold ${
                          trx.type === 'credit' ? 'text-emerald-700' : 'text-[#111D30]'
                        }`}
                      >
                        {trx.type === 'credit' ? '+' : '-'}
                        {formatNaira(trx.amount)}
                      </p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FC5050]">
                        Simulated
                      </span>
                    </div>
                    <StatusBadge status={trx.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </BudiCard>

        {/* Notifications & Profile Summary Card */}
        <BudiCard className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-[#111D30]">Account & Alerts</h3>
              <BudiIcon name="bell" size={18} active />
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] p-3">
                <p className="font-bold text-[#111D30]">Sanctum Token Security</p>
                <p className="mt-1 text-[#64748B]">
                  Your customer session is protected by role-isolated route middleware.
                </p>
              </div>
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] p-3">
                <p className="font-bold text-[#111D30]">Third-Party Provider Status</p>
                <p className="mt-1 text-[#64748B]">
                  All 10 service categories are scaffolded and awaiting live API credentials.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex flex-col gap-2">
            <Link to="/app/profile">
              <BudiButton variant="outline" size="sm" icon="profile" className="w-full">
                Manage Profile & Security
              </BudiButton>
            </Link>
          </div>
        </BudiCard>
      </div>

      {/* Simulated Fund Wallet Modal */}
      <AnimatePresence>
        {fundModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#111D30]/60 p-4"
            onClick={() => setFundModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#E2E8F0]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-base font-extrabold text-[#111D30]">
                    Simulate Wallet Funding
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    No live payment gateway is charged in sandbox mode.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFundModalOpen(false)}
                  className="rounded-lg p-1.5 text-[#64748B] hover:bg-slate-100"
                >
                  <BudiIcon name="close" size={18} />
                </button>
              </div>

              <form onSubmit={handleSimulatedFund} className="mt-4 space-y-4">
                {fundError && (
                  <div className="rounded-xl border border-[#FC5050]/30 bg-[#FC5050]/10 p-3 text-xs font-semibold text-[#FC5050]">
                    {fundError}
                  </div>
                )}
                {fundMessage && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                    {fundMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111D30]">
                    Amount (NGN)
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    required
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2.5 text-sm font-bold text-[#111D30]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111D30]">
                    Simulated Funding Channel
                  </label>
                  <select
                    value={fundChannel}
                    onChange={(e) =>
                      setFundChannel(e.target.value as 'bank_transfer' | 'card_simulation')
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] px-3.5 py-2.5 text-sm text-[#111D30]"
                  >
                    <option value="bank_transfer">Dedicated Virtual Bank Transfer (Mock)</option>
                    <option value="card_simulation">Card Checkout Simulation (Mock)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <BudiButton
                    type="button"
                    variant="outline"
                    onClick={() => setFundModalOpen(false)}
                  >
                    Close
                  </BudiButton>
                  <BudiButton type="submit" isLoading={isSubmitting}>
                    Credit Sandbox Wallet
                  </BudiButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
