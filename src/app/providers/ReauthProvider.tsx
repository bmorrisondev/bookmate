'use client'
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'

const LOCAL_STORAGE_KEY = "bookmate_isScopeCheckComplete"

interface Props {
  children: React.ReactNode
}

function ReauthProvider({ children }: Props) {
  const [isReauthStarted, setIsReauthStarted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const { isSignedIn, user } = useUser();

  
  useEffect(() => {
    if(isReauthStarted) {
      return
    }
    const isScopeCheckComplete = localStorage.getItem(LOCAL_STORAGE_KEY)
    
    // If the user is not signed in, remove the localStorage key
    // This should also trigger on logout
    if(!isSignedIn) {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
      return
    }

    // If the flag is set, the scope check has already been completed
    if(isScopeCheckComplete) {
      setIsLoaded(true)
      return
    }

    // Check if additional scopes are required per the user metadata
    const requiredScopes = user?.publicMetadata?.additionalScopes;
    if(!requiredScopes) {
      localStorage.setItem(LOCAL_STORAGE_KEY, "true")
      setIsLoaded(true)
      return
    }

    // If the user is signed in and the scope check has not been completed, check the scopes
    const googleAccount = user?.externalAccounts.find(ea => ea.provider === "google")
    const approvedScopes = googleAccount?.approvedScopes?.split(" ")
    const hasAllRequiredScopes = requiredScopes?.every(scope => approvedScopes?.includes(scope));
  
    // If the user does not have all required scopes, trigger reauth
    if(!hasAllRequiredScopes) {
      void reauthAcct(requiredScopes)
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, "true")
      setIsLoaded(true)
    }
  }, [user])

  async function reauthAcct(scopes: string[]) {
    setIsReauthStarted(true)
    
    if(user) {
      const googleAccount = user.externalAccounts
        .find(ea => ea.provider === "google")

      const reauth = await googleAccount?.reauthorize({
        redirectUrl: window.location.href,
        additionalScopes: scopes
      })

      if(reauth?.verification?.externalVerificationRedirectURL) {
        window.location.href = reauth?.verification?.externalVerificationRedirectURL.href
      }
    }
  }

  if(!isSignedIn) {
    return children
  }

  if(!isLoaded) {
    return null
  }

  return (
    <>{children}</>
  )
}

export default ReauthProvider