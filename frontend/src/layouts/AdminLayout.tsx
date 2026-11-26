import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BudiIcon } from '../components/icons/BudiIcon';
import { SimulationBanner } from '../components/ui/DesignSystem';
import { useAuth } from '../hooks/useAuth';
import type { IconName } from '../types/service.types';

interface AdminNavItem {
  label: string;
  to: string;
  icon: IconName;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: 'Overview', to: '/admin/dashboard', icon: 'dashboard' },
  { label: 'User Management', to: '/admin/users', icon: 'users' },
  { label: 'Transactions', to: '/admin/transactions', icon: 'transactions' },
  { label: 'Service Catalog', to: '/admin/services', icon: 'services' },
  { label: 'Wallet & Ledger', to: '/admin/wallets', icon: 'wallet' },
  { label: 'Settings & Audit', to: '/admin/settings', icon: 'settings' },
];

/**
 * Completely separate Administrator Environment with dark-navy (#111D30) collapsible sidebar.
 */
export const AdminLayout: React.FC = () => {
  const { user, logout, switchEnvironmentRole } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleSwitchToCustomer = async () => {
    await switchEnvironmentRole('customer');
    navigate('/app/dashboard');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#111D30] flex">
      {/* Collapsible Desktop Admin Sidebar (#111D30 Dark Navy) */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-[#111D30] text-white z-30 transition-all duration-200 ${
          collapsed ? 'lg:w-20' : 'lg:w-68'
        }`}
      >
        <div className="flex h-18 items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FC5050] text-white font-extrabold text-lg">
              B
            </div>
            {!collapsed && (
              <div>
                <span className="text-base font-extrabold tracking-tight text-white">
                  Budipoint
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-[#FC5050]">
                  Admin Console
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="cursor-pointer rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <BudiIcon name="menu" size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 px-3 py-6">
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#FC5050] text-white'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <BudiIcon name={item.icon} size={19} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-2">
          {!collapsed && (
            <div className="rounded-xl bg-white/5 px-3 py-2.5 border border-white/10">
              <p className="text-xs font-bold text-white truncate">{user?.fullName}</p>
              <p className="text-[11px] text-white/60 truncate">{user?.email}</p>
            </div>
          )}
          <button
            type="button"
            onClick={handleSwitchToCustomer}
            className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
            title="Switch to Customer Portal"
          >
            <BudiIcon name="profile" size={15} />
            {!collapsed && <span>Customer View</span>}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#FC5050] hover:bg-[#FC5050]/15"
            title="Sign Out"
          >
            <BudiIcon name="logout" size={15} active />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-68'
        }`}
      >
        <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-[#E2E8F0] bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden rounded-xl border border-[#E2E8F0] p-2 text-[#111D30]"
              aria-label="Open admin navigation"
            >
              <BudiIcon name="menu" size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-[#111D30] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Administrator Environment
                </span>
                <h1 className="text-base sm:text-lg font-extrabold text-[#111D30]">
                  Operations & Reconciliation Center
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SimulationBanner compact />
            <NavLink
              to="/admin/settings"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-bold text-[#111D30] hover:bg-slate-50"
            >
              <BudiIcon name="audit" size={16} active />
              <span>Audit Logs</span>
            </NavLink>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto space-y-6">
          <SimulationBanner />
          <Outlet />
        </main>
      </div>

      {/* Mobile Admin Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#111D30]/60 lg:hidden"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2 }}
              className="h-full w-72 bg-[#111D30] text-white p-5 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FC5050] text-white font-extrabold">
                      B
                    </div>
                    <span className="font-extrabold">Budipoint Admin</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="rounded-lg p-1.5 text-white/70 hover:bg-white/10"
                  >
                    <BudiIcon name="close" size={18} />
                  </button>
                </div>

                <nav className="mt-5 space-y-1.5">
                  {ADMIN_NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold ${
                          isActive ? 'bg-[#FC5050] text-white' : 'text-white/80 hover:bg-white/10'
                        }`
                      }
                    >
                      <BudiIcon name={item.icon} size={18} />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="space-y-2 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    void handleSwitchToCustomer();
                  }}
                  className="w-full rounded-xl bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-white"
                >
                  Switch to Customer Portal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    void handleLogout();
                  }}
                  className="w-full rounded-xl border border-[#FC5050]/40 px-3.5 py-2 text-xs font-semibold text-[#FC5050]"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
