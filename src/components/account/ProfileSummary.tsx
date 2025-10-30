import React, { useEffect } from 'react'

export default function ProfileSummary() {
  useEffect(() => {
    // load profile extras...
  }, []) // outer scoped clients shouldn't be deps; keeping empty per rule

  return <div>Profile Summary</div>
}
