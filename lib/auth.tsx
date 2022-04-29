import React, { useState, useEffect, useContext, createContext } from 'react'
import firebase from './firebase'

interface IAuthContext {
  user: firebase.User | null
  signinWithGithub: () => Promise<firebase.User | null>
  signout: () => Promise<void>
}

type TProvideAuth = {
  children?: React.ReactNode
}

const authContext = createContext<IAuthContext | null>(null)

export function ProvideAuth({ children }: TProvideAuth) {
  const auth = useProvideAuth()

  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth() {
  const [user, setUser] = useState<firebase.User | null>(null)

  const signinWithGithub = () => {
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then((response) => {
        setUser(response.user)
        return response.user
      })
  }

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null)
      })
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  return { user, signinWithGithub, signout }
}
