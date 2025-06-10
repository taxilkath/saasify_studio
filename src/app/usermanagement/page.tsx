'use client';

import { UserProfile, useUser } from '@clerk/nextjs';
import { Badge } from '@/components/ui/badge';

export default function UserManagementPage() {
  const { user } = useUser();

  // We'll assume the user is a "pro" user for this example.
  // In a real app, you would check this against your database or user metadata.
  const isProUser = true; 

  return (
    <div className="p-4 sm:p-8 text-white min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">
            {user ? user.fullName : 'Account'}
          </h1>
          {isProUser && (
            <Badge
              variant="default"
              className="bg-gradient-to-r from-purple-500 to-indigo-600 border-none text-sm font-semibold"
            >
              Pro
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-1">
          Manage your account, security, and connected services.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-0.5 shadow-2xl shadow-zinc-950/50">
        <UserProfile
          path="/user-management"
          routing="path"
          appearance={{
            baseTheme: undefined, // Let our custom styles take over
            variables: {
              colorPrimary: '#6366f1', // Indigo
              colorText: '#e2e8f0', // Slate 200
              colorTextSecondary: '#94a3b8', // Slate 400
              colorBackground: '#18181b', // Zinc 900
              colorInputBackground: '#27272a', // Zinc 800
              colorInputText: '#e2e8f0',
            },
            elements: {
              rootBox: 'w-full',
              card: 'w-full shadow-none bg-transparent',
              pageScrollBox: 'p-0',
              navbar: 'hidden', // Hide the default Clerk navbar inside the profile
              headerTitle: 'text-2xl font-bold text-white',
              headerSubtitle: 'text-base text-muted-foreground',
              profileSection: 'flow-root p-6 transition-all rounded-lg border border-zinc-800 hover:bg-zinc-800/50',
              profileSection__titleText: 'text-lg font-semibold text-white mb-4',
              profileSection__profile: 'p-6',
              profileSection__activeDevices: 'p-6',
              accordionTriggerButton: 'py-3 text-base',
              accordionContent: 'pb-4',
              button__primary: 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg',
              button__secondary: 'bg-zinc-700 hover:bg-zinc-600 rounded-lg',
              badge: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md',
              _internal_input: 'bg-zinc-800 border-zinc-700 rounded-lg focus:ring-primary focus:border-primary',
            },
          }}
        />
      </div>
    </div>
  );
} 