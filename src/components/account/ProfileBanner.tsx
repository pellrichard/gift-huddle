import React, { useState } from 'react'

type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  banner_url: string | null
}

export default function ProfileBanner({ profile }: { profile: Profile }) {
  const [bannerUploading, setBannerUploading] = useState<boolean>(false)
  const [avatarUploading, setAvatarUploading] = useState<boolean>(false)

  const onBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBannerUploading(true)
    try {
      // TODO: upload file to storage, update profile.banner_url
      await new Promise((r) => setTimeout(r, 300))
    } finally {
      setBannerUploading(false)
    }
  }

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    try {
      // TODO: upload file to storage, update profile.avatar_url
      await new Promise((r) => setTimeout(r, 300))
    } finally {
      setAvatarUploading(false)
    }
  }

  return (
    <div className='flex flex-col items-start gap-3'>
      <div className='sr-only'>
        Profile owner: {profile.full_name ?? 'Unknown'}
      </div>
      <div className='flex items-center gap-2'>
        <label className='font-medium'>Banner:</label>
        <input type='file' onChange={onBannerChange} />
        {bannerUploading && (
          <span className='text-sm text-gray-500'>Uploading…</span>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <label className='font-medium'>Avatar:</label>
        <input type='file' onChange={onAvatarChange} />
        {avatarUploading && (
          <span className='text-sm text-gray-500'>Uploading…</span>
        )}
      </div>
    </div>
  )
}
