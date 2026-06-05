import type { Timestamp } from 'firebase/firestore'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  coupleId: string
  role: 'partner'
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Couple {
  memberIds: [string, string]
  anniversaryDate: string
  displayName?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}
