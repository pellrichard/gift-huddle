'use client';
import React from 'react';
import { saveProfile } from '@/actions/profile';
import { EditProfileModal } from '@/components/account/EditProfileModal';

type InitialProfile = {
  full_name: string | null;
  dob: string | null;
  show_dob_year: boolean | null;
  notify_mobile: boolean | null;
  notify_email: boolean | null;
  unsubscribe_all: boolean | null;
  preferred_currency: string | null;
  avatar_url: string | null;
  email: string | null;
};

export default function AccountDashboard(props: {
  user: { name: string; avatar?: string | null };
  initialProfile?: InitialProfile;
  currencyOptions?: string[];
  currencyOptionsDetailed?: Array<{ code: string; label: string }>;
}) {
  const { user, initialProfile, currencyOptions, currencyOptionsDetailed } = props;
  const [open, setOpen] = React.useState(false);

  const fallbackInitial: InitialProfile = {
    full_name: user.name ?? null,
    dob: null,
    show_dob_year: true,
    notify_mobile: true,
    notify_email: true,
    unsubscribe_all: false,
    preferred_currency: 'GBP',
    avatar_url: user.avatar ?? null,
    email: null,
  };

  return (
    <div className="p-4">
      <EditProfileModal open={open} onOpenChange={setOpen}
        initial={initialProfile ?? fallbackInitial}
        onSave={saveProfile}
        currencyOptions={currencyOptions}
        currencyOptionsDetailed={currencyOptionsDetailed}
      />
    </div>
  );
}
