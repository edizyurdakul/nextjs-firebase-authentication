import firebase from './firebase'

const firestore = firebase.firestore()

export function createUser(
  uid: string,
  data: {
    uid: string
    email: string | null
    name: string | null
    provider: string | undefined
    photoUrl: string | null
    token: string
  }
) {
  return firestore
    .collection('users')
    .doc(uid)
    .set({ ...data }, { merge: true })
}
