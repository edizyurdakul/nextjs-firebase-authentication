/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import Head from 'next/head'
import { useAuth } from '../lib/auth'
import NextImage from 'next/image'

const Home: NextPage = () => {
  const auth = useAuth()
  console.log(auth)

  return (
    <div>
      <Head>
        <title>Next.js Firebase Authentication</title>
        <meta
          name="description"
          content="Created by create next app, Next.js Firebase Authentication"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="container mx-auto py-8">
        <h1 className="my-4 text-3xl font-bold">
          Next.js Firebase Authentication
        </h1>
        {auth !== null && (
          <>
            {auth.user !== null && (
              <div className="my-4">
                <div className="relative h-64 w-64 ">
                  {auth.user!.photoUrl !== null && (
                    <NextImage
                      className="rounded-full object-cover"
                      layout="fill"
                      src={auth.user.photoUrl}
                      alt=""
                    />
                  )}
                </div>
                <h2 className="mt-4 text-xl font-semibold">{auth.user.name}</h2>

                <p>{auth.user.email}</p>
              </div>
            )}
          </>
        )}
        {auth?.user != null ? (
          <button
            className="bg-black px-4 py-2 text-white"
            onClick={() => auth!.signout()}
          >
            Sign Out
          </button>
        ) : (
          <button
            className="bg-black px-4 py-2 text-white"
            onClick={() => auth!.signinWithGitHub('/')}
          >
            Sign in with Github
          </button>
        )}
      </section>
    </div>
  )
}

export default Home
