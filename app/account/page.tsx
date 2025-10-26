
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/browser'
import EditProfileModal from '@/components/EditProfileModal'
import type { Profile } from '@/types'

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('[Account] Failed to fetch profile', error)
        return
      }

      setProfile(data)
      if (!data.dob || !data.currency) setShowModal(true)
    }

    fetchProfile()
  }, [])

  const showProfileWarning = profile && (!profile.dob || !profile.currency)

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Account</h1>

      {showProfileWarning && (
        <p className="text-yellow-600 font-medium mb-4">
          ⚠️ Please complete your profile (Date of Birth or Currency missing)
        </p>
      )}

      {profile && (
        <EditProfileModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          initialProfile={profile}
          onSave={(updatedProfile: Profile) => {
            setProfile(updatedProfile)
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}
