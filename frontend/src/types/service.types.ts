export type ServiceGroup = 'main' | 'additional';
export type ServiceAvailabilityStatus = 'active' | 'ready_for_api' | 'maintenance' | 'disabled';

export type ServiceSlug =
  | 'airtime'
  | 'data-subscriptions'
  | 'gift-cards'
  | 'utility-bills'
  | 'esim-services'
  | 'number-verification'
  | 'airtime-to-naira'
  | 'virtual-debit-cards'
  | 'gaming-betting'
  | 'educational-pins';

export type IconName =
  | 'airtime'
  | 'data'
  | 'giftcard'
  | 'utility'
  | 'esim'
  | 'verification'
  | 'convert'
  | 'virtualcard'
  | 'gaming'
  | 'education'
  | 'dashboard'
  | 'wallet'
  | 'transactions'
  | 'services'
  | 'profile'
  | 'users'
  | 'settings'
  | 'audit'
  | 'bell'
  | 'search'
  | 'filter'
  | 'plus'
  | 'arrow-up-right'
  | 'arrow-down-left'
  | 'check-circle'
  | 'clock'
  | 'alert-circle'
  | 'shield'
  | 'logout'
  | 'menu'
  | 'close'
  | 'chevron-right'
  | 'chevron-down'
  | 'lock'
  | 'eye'
  | 'refresh';

export interface PlatformServiceCategory {
  id: string;
  slug: ServiceSlug;
  name: string;
  shortDescription: string;
  group: ServiceGroup;
  iconName: IconName;
  status: ServiceAvailabilityStatus;
  isEnabled: boolean;
  isVisible: boolean;
  providerStatusNote: string;
  minAmountNgn: string;
  maxAmountNgn: string;
}
