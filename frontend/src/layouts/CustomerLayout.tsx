import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BudiIcon } from '../components/icons/BudiIcon';
import { SimulationBanner } from '../components/ui/DesignSystem';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';
import type { IconName } from '../types/service.types';
import type { PlatformNotification } from '../types/user.types';

interface NavItem {
  label: string;
  to: string;
  icon: IconName;
}

const CUSTOMER_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/app/dashboard', icon: 'dashboard' },
  { label: 'Services', to: '/app/services', icon: 'services' },
  { label: 'Wallet', to: '/app/wallet', icon: 'wallet' },
  { label: 'Transactions', to: '/app/transactions', icon: 'transactions' },
  { label: 'Profile & Settings', to: '/app/profile', icon: 'profile' },
];

export const CustomerLayout: React.FC = () => {
  const { user, logout, switchEnvironmentRole } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<PlatformNotification[]>([]);

  useEffect(() => {
    void authService.getNotifications().then(setNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSwitchToAdmin = async () => {
    await switchEnvironmentRole('admin');
    navigate('/admin/dashboard');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#111D30] flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-68 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-[#E2E8F0] z-30">
        <div className="flex h-18 items-center justify-between px-6 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FC5050] text-white font-extrabold text-lg">
              B
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-[#111D30]">
                Budipoint
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Customer Portal
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {CUSTOMER_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#FC5050]/10 text-[#FC5050]'
                    : 'text-[#111D30]/80 hover:bg-slate-100 hover:text-[#111D30]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <BudiIcon name={item.icon} size={19} active={isActive} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#E2E8F0] space-y-2.5">
          <div className="rounded-xl bg-[#F8F9FB] p-3 border border-[#E2E8F0]">
            <p className="text-xs font-bold text-[#111D30] truncate">{user?.fullName}</p>
            <p className="text-[11px] text-[#64748B] truncate">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleSwitchToAdmin}
            className="w-full cursor-pointer flex items-center justify-between rounded-xl border border-[#111D30]/20 bg-[#111D30] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1A2B45] transition-colors"
          >
            <span>Switch to Admin Console</span>
            <BudiIcon name="chevron-right" size={15} />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full cursor-pointer flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-[#FC5050] hover:bg-[#FC5050]/10 transition-colors"
          >
            <BudiIcon name="logout" size={16} active />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:pl-68 flex flex-col min-h-screen pb-18 lg:pb-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-[#E2E8F0] bg-white/95 backdrop-blur-xs px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden rounded-xl border border-[#E2E8F0] p-2 text-[#111D30] hover:bg-slate-100"
              aria-label="Open menu"
            >
              <BudiIcon name="menu" size={20} />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-[#111D30]">
                Welcome back, {user?.fullName?.split(' ')[0] ?? 'Customer'}
              </h1>
              <p className="hidden sm:block text-xs text-[#64748B]">
                Digital Services & Wallet Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <SimulationBanner compact />

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative cursor-pointer rounded-xl border border-[#E2E8F0] bg-white p-2.5 text-[#111D30] hover:bg-slate-50"
                aria-label="View notifications"
              >
                <BudiIcon name="bell" size={19} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FC5050] text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-lg z-40"
                  >
                    <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8F0]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#111D30]">
                        Notifications
                      </span>
                      <span className="text-[11px] font-semibold text-[#FC5050]">
                        {unreadCount} unread
                      </span>
                    </div>
                    <div className="mt-2.5 space-y-2.5 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="rounded-xl bg-[#F8F9FB] p-2.5 text-xs border border-[#E2E8F0]"
                        >
                          <p className="font-bold text-[#111D30]">{n.title}</p>
                          <p className="mt-0.5 text-[#64748B]">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Shortcut */}
            <NavLink
              to="/app/profile"
              className="flex items-center gap-2.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-bold text-[#111D30] hover:bg-slate-50"
            >
              <BudiIcon name="profile" size={17} active />
              <span className="hidden sm:inline">Profile</span>
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto space-y-6">
          <SimulationBanner />
          <Outlet />
        </main>
      </div>

      {/* Mobile Slide-Out Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#111D30]/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2 }}
              className="h-full w-72 bg-white p-5 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FC5050] text-white font-extrabold">
                      B
                    </div>
                    <span className="font-extrabold text-[#111D30]">Budipoint</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg p-1.5 text-[#64748B] hover:bg-slate-100"
                  >
                    <BudiIcon name="close" size={18} />
                  </button>
                </div>

                <nav className="mt-5 space-y-1.5">
                  {CUSTOMER_NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold ${
                          isActive
                            ? 'bg-[#FC5050]/10 text-[#FC5050]'
                            : 'text-[#111D30] hover:bg-slate-100'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <BudiIcon name={item.icon} size={18} active={isActive} />
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="space-y-2 border-t border-[#E2E8F0] pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    void handleSwitchToAdmin();
                  }}
                  className="w-full rounded-xl bg-[#111D30] px-3.5 py-2.5 text-xs font-semibold text-white"
                >
                  Switch to Admin Console
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    void handleLogout();
                  }}
                  className="w-full rounded-xl border border-[#FC5050]/30 px-3.5 py-2 text-xs font-semibold text-[#FC5050]"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-30 flex items-center justify-around border-t border-[#E2E8F0] bg-white py-2 lg:hidden">
        {CUSTOMER_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-1 text-[11px] font-semibold ${
                isActive ? 'text-[#FC5050]' : 'text-[#64748B]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <BudiIcon name={item.icon} size={18} active={isActive} />
                <span>{item.label.split(' ')[0]}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
