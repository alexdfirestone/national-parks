import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // No logic yet — simply continue the request
  return NextResponse.next()
}


// Optional: specify which routes this middleware applies to
export const config = {
  matcher: ['/'], // or remove entirely to apply to all routes
}