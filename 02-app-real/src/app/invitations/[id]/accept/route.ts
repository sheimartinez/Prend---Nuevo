import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const { error } = await supabase.rpc('accept_invitation', {
    invitation_id: id,
  })

  if (error) {
    const message = encodeURIComponent(error.message)
    return NextResponse.redirect(
      new URL(`/dashboard?error=accept_invitation_failed&message=${message}`, req.url)
    )
  }

  return NextResponse.redirect(
    new URL('/dashboard?success=invitation_accepted', req.url)
  )
}