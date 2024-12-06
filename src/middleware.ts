import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/app(.*)', '/dashboard(.*)', '/forum(.*)', '/settings(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
    // const { userId, sessionClaims, redirectToSignIn } = await auth()
    // if(!userId) {
    //   return redirectToSignIn()
    // }

    // // Check if the user has the required scopes
    // if(!sessionClaims?.metadata?.additionalScopes?.includes("https://www.googleapis.com/auth/calendar.events")) {
    //   const onboardingUrl = new URL('/handle_scopes', req.url)
    //   return NextResponse.redirect(onboardingUrl)
    // }

    // return NextResponse.next()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}