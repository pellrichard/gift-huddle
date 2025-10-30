'use client'

import { useMemo, useState, useEffect } from 'react'
import { Card, CardContent } from 'src/components/ui/card'
import { Button } from 'src/components/ui/button'
import { supabase } from '@/lib/supabase/browser'
import type { User } from '@supabase/supabase-js'
import { EditProfileModal } from './components/modals/EditProfileModal'

interface Profile {
  nickname: string | null
  full_name: string | null
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className='mb-3 flex items-center justify-between'>
      <h2 className='text-lg font-semibold tracking-tight'>{title}</h2>
    </div>
  )
}

function useAccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  const fetchUserData = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError) {
      console.error('Error fetching user:', userError)
      return
    }
    setUser(user)

    if (user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('nickname, full_name')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
      } else if (profileData) {
        setProfile(profileData)
      }
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return { user, profile, fetchUserData }
}

function AccountPage() {
  const { user, profile, fetchUserData } = useAccountPage()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const greeting = useMemo(() => {
    if (!user) return 'Welcome back!'
    if (profile?.nickname) {
      return `Hi ${profile.nickname}!`
    } else if (profile?.full_name) {
      return `Hi ${profile.full_name.split(' ')[0]}!`
    } else if (user.user_metadata.full_name) {
      return `Hi ${user.user_metadata.full_name.split(' ')[0]}!`
    } else if (user.email) {
      return `Hi ${user.email.split('@')[0]}!`
    }
    return 'Welcome back!'
  }, [user, profile])

  return (
    <div className='mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 font-sans'>
      <Card className='mb-6 overflow-hidden'>
        <CardContent className='flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center'>
          <div className='flex-1'>
            <div className='flex items-center gap-3'>
              {user?.user_metadata.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt='User Avatar'
                  className='h-10 w-10 rounded-full'
                />
              )}
              <div className='text-xl font-semibold'>{greeting}</div>
            </div>
            <div className='text-sm text-muted-foreground'>
              Here's a snapshot of your gifting world.
            </div>
          </div>
          <Button
            variant='secondary'
            onClick={() => {
              console.log('Edit profile button clicked!')
              setIsModalOpen(true)
            }}
          >
            Edit profile
          </Button>
        </CardContent>
      </Card>

      <EditProfileModal
        user={user}
        onSave={fetchUserData}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />

      <section className='mb-8'>
        <SectionHeader title='Upcoming events' />
        <div className='grid gap-3'>{/* Events will be rendered here */}</div>
      </section>
    </div>
  )
}

export default AccountPage
