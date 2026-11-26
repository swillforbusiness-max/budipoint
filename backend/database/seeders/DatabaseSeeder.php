<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\ServiceCategory;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $customerRole = Role::firstOrCreate(
            ['slug' => 'customer'],
            ['name' => 'Customer', 'description' => 'Registered Budipoint customer']
        );

        $adminRole = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Administrator', 'description' => 'Platform administrator']
        );

        $admin = User::firstOrCreate(
            ['email' => 'admin@budipoint.ng'],
            [
                'full_name' => 'Chidinma Nwosu (System Admin)',
                'phone_number' => '+234 809 110 4400',
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => now(),
                'password' => Hash::make('Budipoint#2026'),
            ]
        );
        $admin->roles()->syncWithoutDetaching([$adminRole->id]);

        $customer = User::firstOrCreate(
            ['email' => 'adebayo.ogunlesi@budipoint.ng'],
            [
                'full_name' => 'Adebayo Ogunlesi',
                'phone_number' => '+234 803 481 9200',
                'role' => 'customer',
                'status' => 'active',
                'email_verified_at' => now(),
                'password' => Hash::make('Budipoint#2026'),
            ]
        );
        $customer->roles()->syncWithoutDetaching([$customerRole->id]);

        Wallet::firstOrCreate(
            ['user_id' => $customer->id],
            [
                'wallet_number' => '9048210394',
                'available_balance' => '184500.00',
                'ledger_balance' => '189500.00',
                'currency' => 'NGN',
                'is_active' => true,
                'is_simulated' => true,
            ]
        );

        $services = [
            ['airtime', 'Airtime Top-Up', 'Instant VTU airtime recharge across MTN, Airtel, Glo, and 9mobile networks.', 'main', 'airtime', '50.00', '50000.00'],
            ['data-subscriptions', 'Data Subscriptions', 'SME, corporate gifting, and direct mobile data bundles for all Nigerian telcos.', 'main', 'data', '100.00', '100000.00'],
            ['gift-cards', 'Gift Cards', 'Purchase and redeem global digital gift cards across retail, entertainment, and cloud.', 'main', 'giftcard', '1500.00', '500000.00'],
            ['utility-bills', 'Utility Bill Payments', 'Prepaid and postpaid electricity tokens (DISCOs), cable TV, and internet bills.', 'main', 'utility', '500.00', '250000.00'],
            ['esim-services', 'eSIM Services', 'Instant international travel and roaming eSIM profiles with QR provisioning.', 'main', 'esim', '3500.00', '150000.00'],
            ['number-verification', 'Number Verification & Rentals', 'Virtual SMS verification numbers and dedicated short/long-term number rentals.', 'main', 'verification', '800.00', '75000.00'],
            ['airtime-to-naira', 'Airtime-to-Naira Conversion', 'Convert excess mobile airtime directly into withdrawable Budipoint wallet balance.', 'main', 'convert', '1000.00', '100000.00'],
            ['virtual-debit-cards', 'Virtual Debit Cards', 'Create and fund USD/NGN virtual debit cards for seamless global online payments.', 'additional', 'virtualcard', '2000.00', '1000000.00'],
            ['gaming-betting', 'Gaming & Betting Wallet Funding', 'Instant customer ID validation and wallet top-up for supported gaming platforms.', 'additional', 'gaming', '200.00', '200000.00'],
            ['educational-pins', 'Educational Pins & Vouchers', 'WAEC, NECO, JAMB, and NABTEB result checker pins and registration scratch tokens.', 'additional', 'education', '1000.00', '50000.00'],
        ];

        foreach ($services as [$slug, $name, $desc, $group, $icon, $min, $max]) {
            ServiceCategory::firstOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'short_description' => $desc,
                    'group' => $group,
                    'icon_name' => $icon,
                    'status' => 'ready_for_api',
                    'is_enabled' => true,
                    'is_visible' => true,
                    'min_amount_ngn' => $min,
                    'max_amount_ngn' => $max,
                    'provider_status_note' => 'Awaiting live third-party provider API credentials.',
                ]
            );
        }
    }
}
