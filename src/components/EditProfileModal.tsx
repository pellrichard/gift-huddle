import React, { useState } from 'react'
import { Profile } from '@/types'

type EditProfileModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (updatedProfile: Profile) => void
  initialProfile: Profile
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProfile,
}) => {
  const [formData, setFormData] = useState<Profile>(initialProfile)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='modal'>
      <div className='modal-content'>
        <h2>Edit Profile</h2>
        <label>
          Date of Birth:
          <input
            type='date'
            name='dob'
            value={formData.dob || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          Currency:
          <input
            type='text'
            name='currency'
            value={formData.currency || ''}
            onChange={handleChange}
          />
        </label>
        <button onClick={handleSubmit}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

export default EditProfileModal
