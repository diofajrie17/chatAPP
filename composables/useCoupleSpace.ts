import { doc, getDoc, updateDoc } from 'firebase/firestore'
import type { Couple, UserProfile } from '~/types/couple'

export type CoupleAccessErrorCode =
  | 'missing-profile'
  | 'missing-couple'
  | 'malformed-couple'
  | 'not-member'
  | 'unknown'

interface CoupleAccessError {
  code: CoupleAccessErrorCode
  message: string
}

const accessMessages: Record<CoupleAccessErrorCode, string> = {
  'missing-profile':
    'Ask the app owner to run the trusted setup script for this account, then sign in again.',
  'missing-couple':
    'Check the seeded couple record or rerun the Firebase setup script, then refresh this page.',
  'malformed-couple':
    'Check the seeded couple record or rerun the Firebase setup script, then refresh this page.',
  'not-member':
    'This account is not one of the two configured members for this private space.',
  unknown:
    'Try refreshing, or sign out and check the Firebase setup before returning.'
}

const createAccessError = (code: CoupleAccessErrorCode): CoupleAccessError => ({
  code,
  message: accessMessages[code]
})

const isValidAnniversaryDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value)

const isValidCouple = (value: Couple, uid: string) =>
  Array.isArray(value.memberIds) &&
  value.memberIds.length === 2 &&
  value.memberIds.every((memberId) => typeof memberId === 'string') &&
  value.memberIds[0] !== value.memberIds[1] &&
  value.memberIds.includes(uid) &&
  typeof value.anniversaryDate === 'string'

export const useCoupleSpace = () => {
  const profile = useState<UserProfile | null>('couple:profile', () => null)
  const couple = useState<Couple | null>('couple:current', () => null)
  const isLoading = useState('couple:isLoading', () => false)
  const isUpdating = useState('couple:isUpdating', () => false)
  const error = useState<string | null>('couple:error', () => null)
  const accessErrorCode = useState<CoupleAccessErrorCode | null>(
    'couple:accessErrorCode',
    () => null
  )
  const nuxtApp = useNuxtApp()
  const { user } = useFirebaseAuth()

  const loadCoupleSpace = async () => {
    if (!user.value) {
      profile.value = null
      couple.value = null
      accessErrorCode.value = null
      return
    }

    isLoading.value = true
    error.value = null
    accessErrorCode.value = null

    try {
      const profileRef = doc(nuxtApp.$firebase.db, 'users', user.value.uid)
      const profileSnap = await getDoc(profileRef)

      if (!profileSnap.exists()) {
        throw createAccessError('missing-profile')
      }

      const nextProfile = profileSnap.data() as UserProfile

      if (nextProfile.uid !== user.value.uid) {
        throw createAccessError('malformed-couple')
      }

      const coupleRef = doc(nuxtApp.$firebase.db, 'couples', nextProfile.coupleId)
      const coupleSnap = await getDoc(coupleRef)

      if (!coupleSnap.exists()) {
        throw createAccessError('missing-couple')
      }

      const nextCouple = coupleSnap.data() as Couple

      if (!isValidCouple(nextCouple, user.value.uid)) {
        throw createAccessError(
          Array.isArray(nextCouple.memberIds) &&
            nextCouple.memberIds.length === 2 &&
            !nextCouple.memberIds.includes(user.value.uid)
            ? 'not-member'
            : 'malformed-couple'
        )
      }

      profile.value = nextProfile
      couple.value = nextCouple
    } catch (loadError) {
      console.error('Unable to load couple space', loadError)
      const accessError =
        loadError &&
        typeof loadError === 'object' &&
        'code' in loadError &&
        'message' in loadError
          ? (loadError as CoupleAccessError)
          : createAccessError('unknown')

      accessErrorCode.value = accessError.code
      error.value = accessError.message
    } finally {
      isLoading.value = false
    }
  }

  const updateCoupleMetadata = async (input: {
    displayName: string
    anniversaryDate: string
  }) => {
    if (!profile.value?.coupleId) {
      throw createAccessError('missing-profile')
    }

    const displayName = input.displayName.trim()
    const anniversaryDate = input.anniversaryDate.trim()

    if (!displayName || !isValidAnniversaryDate(anniversaryDate)) {
      throw new Error('Couple metadata is invalid.')
    }

    isUpdating.value = true
    error.value = null

    try {
      const coupleRef = doc(nuxtApp.$firebase.db, 'couples', profile.value.coupleId)
      await updateDoc(coupleRef, {
        anniversaryDate,
        displayName
      })

      couple.value = couple.value
        ? {
            ...couple.value,
            anniversaryDate,
            displayName
          }
        : couple.value
    } catch (updateError) {
      console.error('Unable to update couple metadata', updateError)
      error.value = 'We could not update your private space. Try again in a moment.'
      throw updateError
    } finally {
      isUpdating.value = false
    }
  }

  return {
    accessErrorCode,
    couple,
    error,
    isLoading,
    isUpdating,
    loadCoupleSpace,
    profile,
    updateCoupleMetadata
  }
}
