'use client'

import { useState, useEffect } from 'react'
import { Modal, ModalHeader, ModalTitle } from 'src/components/ui/modal'
import { Button } from 'src/components/ui/button'
import { Input } from 'src/components/ui/input'

import { supabase } from '@/lib/supabase/browser'
import type { User } from '@supabase/supabase-js'

interface Currency {
  code: string
  name: string
}

interface EditProfileModalProps {
  user: User | null
  onSave: () => void
}

export function EditProfileModal({ user, onSave }: EditProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [nickname, setNickname] = useState('')
  const [fullName, setFullName] = useState('')
  const [dobDay, setDobDay] = useState('')
  const [dobMonth, setDobMonth] = useState('')
  const [dobYear, setDobYear] = useState('')
  const [showDobYear, setShowDobYear] = useState(false)
  const [preferredCurrency, setPreferredCurrency] = useState('')
  const [notifyChannel, setNotifyChannel] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [preferredShops, setPreferredShops] = useState<string[]>([])
  const [currencies, setCurrencies] = useState<Currency[]>([])

  useEffect(() => {
    const fetchCurrencies = async () => {
      const { data, error } = await supabase
        .from('fx_rates')
        .select('code, name')
      if (error) {
        console.error('Error fetching currencies:', error)
      } else {
        setCurrencies(data || [])
      }
    }
    fetchCurrencies()
  }, [])

  useEffect(() => {
    if (user) {
      // Fetch profile data from Supabase and pre-fill the form
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select(
            'nickname, full_name, dob, show_dob_year, preferred_currency, notify_channel, categories, preferred_shops'
          )
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
        } else if (data) {
          setNickname(data.nickname || '')
          setFullName(data.full_name || '')
          if (data.dob) {
            const [year, month, day] = data.dob.split('-')
            setDobDay(day)
            setDobMonth(month)
            setDobYear(year)
          }
          setShowDobYear(data.show_dob_year || false)
          setPreferredCurrency(data.preferred_currency || '')
          setNotifyChannel(data.notify_channel || '')
          setCategories(data.categories || [])
          setPreferredShops(data.preferred_shops || [])
        }
      }
      fetchProfile()
    }
  }, [user, isOpen])

  const handleSave = async () => {
    const { error } = await supabase.from('profiles').upsert({
      id: user?.id,
      nickname,
      full_name: fullName,
      dob: `${dobYear}-${dobMonth}-${dobDay}`,
      show_dob_year: showDobYear,
      preferred_currency: preferredCurrency,
      notify_channel: notifyChannel,
      categories,
      preferred_shops: preferredShops,
    })

    if (error) {
      console.error('Error saving profile:', error)
    } else {
      onSave()
      setIsOpen(false)
    }
  }

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <Button variant='secondary' onClick={() => setIsOpen(true)}>
        Edit profile
      </Button>
      <div className='sm:max-w-[425px]'>
        <ModalHeader>
          <ModalTitle>Edit Profile</ModalTitle>
        </ModalHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='nickname' className='text-right'>
              Nickname
            </label>
            <Input
              id='nickname'
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='full_name' className='text-right'>
              Full Name
            </label>
            <Input
              id='full_name'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='email' className='text-right'>
              Email
            </label>
            <Input
              id='email'
              value={user?.email || ''}
              disabled
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='dobDay' className='text-right'>
              Date of Birth
            </label>
            <div className='col-span-3 flex gap-2'>
              <Input
                id='dobDay'
                type='number'
                placeholder='DD'
                value={dobDay}
                onChange={(e) => setDobDay(e.target.value)}
                className='w-1/3'
                max={31}
                min={1}
              />
              <Input
                id='dobMonth'
                type='number'
                placeholder='MM'
                value={dobMonth}
                onChange={(e) => setDobMonth(e.target.value)}
                className='w-1/3'
                max={12}
                min={1}
              />
              <Input
                id='dobYear'
                type='number'
                placeholder='YYYY'
                value={dobYear}
                onChange={(e) => setDobYear(e.target.value)}
                className='w-1/3'
                max={new Date().getFullYear()}
                min={new Date().getFullYear() - 100}
              />
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <div className='col-start-2 col-span-3 flex items-center space-x-2'>
              <input
                type='checkbox'
                id='showDobYear'
                checked={showDobYear}
                onChange={(e) => setShowDobYear(e.target.checked)}
              />
              <label htmlFor='showDobYear'>Show year of birth to others</label>
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='preferredCurrency' className='text-right'>
              Preferred Currency
            </label>
            <select
              id='preferredCurrency'
              value={preferredCurrency}
              onChange={(e) => setPreferredCurrency(e.target.value)}
              className='col-span-3 p-2 border rounded-md'
            >
              <option value=''>Select a currency</option>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='categories' className='text-right'>
              Interests
            </label>
            <Input
              id='categories'
              value={categories.join(', ')}
              onChange={(e) =>
                setCategories(e.target.value.split(',').map((s) => s.trim()))
              }
              className='col-span-3'
              placeholder='e.g., Books, Electronics, Travel'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='preferredShops' className='text-right'>
              Preferred Shops
            </label>
            <Input
              id='preferredShops'
              value={preferredShops.join(', ')}
              onChange={(e) =>
                setPreferredShops(
                  e.target.value.split(',').map((s) => s.trim())
                )
              }
              className='col-span-3'
              placeholder='e.g., Amazon, Etsy, Target'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='notifyChannel' className='text-right'>
              Notify Channel
            </label>
            <select
              id='notifyChannel'
              value={notifyChannel}
              onChange={(e) => setNotifyChannel(e.target.value)}
              className='col-span-3 p-2 border rounded-md'
            >
              <option value=''>Select a channel</option>
              <option value='email'>Email</option>
              <option value='phone'>Phone</option>
              <option value='both'>Both</option>
              <option value='none'>None</option>
            </select>
          </div>
        </div>
        <Button onClick={handleSave}>Save changes</Button>
      </div>
    </Modal>
  )
}
