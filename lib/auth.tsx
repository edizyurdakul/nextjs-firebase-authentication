import React, { useState, useEffect, useContext, createContext } from 'react'
import Router from 'next/router'
// import cookie from 'js-cookie'
import firebase from './firebase'
import { UrlObject } from 'url'
import { createUser } from './db'

interface IAuthContext {
  user: IUser | null
  // eslint-disable-next-line no-unused-vars
  signinWithGitHub: (redirect: string | UrlObject) => Promise<void>
  // eslint-disable-next-line no-unused-vars
  signinWithGoogle: (redirect: string | UrlObject) => Promise<void>
  // eslint-disable-next-line no-unused-vars
  signinWithEmail: (email: any, password: any) => Promise<void>
  signout: () => Promise<
    | false
    | {
        uid: string
        email: string | null
        name: string | null
        provider: string | undefined
        photoUrl: string | null
        token: string
      }
  >
}

interface IUser {
  uid: string
  email: string | null
  name: string | null
  provider: string | undefined
  photoUrl: string | null
  token: string
}

type TProvideAuth = {
  children?: React.ReactNode
}

const authContext = createContext<IAuthContext | null>(null)

export function AuthProvider({ children }: TProvideAuth) {
  const auth = useProvideAuth()

  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth() {
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)

  const handleUser = async (rawUser: firebase.User | null) => {
    if (rawUser) {
      const user = await formatUser(rawUser)
      createUser(user.uid, user)
      setUser(user)
      setLoading(false)
      return user
    } else {
      setUser(null)
      setLoading(false)
      return false
    }
  }

  const signinWithEmail = (email: any, password: any) => {
    setLoading(true)
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        handleUser(response.user)
        Router.push('/sites')
      })
  }

  const signinWithGitHub = (redirect: string | UrlObject) => {
    setLoading(true)
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then((response) => {
        handleUser(response.user)
        if (redirect) {
          Router.push(redirect)
        }
      })
  }

  const signinWithGoogle = (redirect: string | UrlObject) => {
    setLoading(true)
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((response) => {
        handleUser(response.user)

        if (redirect) {
          Router.push(redirect)
        }
      })
  }

  const signout = () => {
    Router.push('/')
    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(null))
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged(handleUser)

    return () => unsubscribe()
  }, [])

  return {
    user,
    loading,
    signinWithEmail,
    signinWithGitHub,
    signinWithGoogle,
    signout,
  }
}

const formatUser = async (user: firebase.User) => {
  const token = await user.getIdToken()
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0]?.providerId,
    photoUrl: user.photoURL,
    token,
  }
}
