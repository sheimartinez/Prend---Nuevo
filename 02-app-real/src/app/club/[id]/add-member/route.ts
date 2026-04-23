import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const formData = await req.formData()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const role = String(formData.get('role') ?? 'member').trim()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    const msg = encodeURIComponent(userError.message)
    return NextResponse.redirect(
      new URL(`/club/${id}?error=auth_user_failed&message=${msg}`, req.url)
    )
  }

  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const { data: membership, error: membershipError } = await supabase
    .from('memberships')
    .select('*')
    .eq('club_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (membershipError) {
    const msg = encodeURIComponent(membershipError.message)
    return NextResponse.redirect(
      new URL(`/club/${id}?error=membership_lookup_failed&message=${msg}`, req.url)
    )
  }

  if (!membership || membership.role !== 'admin') {
    return NextResponse.redirect(new URL(`/club/${id}?error=not_admin`, req.url))
  }

  const { data: foundProfile, error: foundProfileError } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('email', email)
    .maybeSingle()

  if (foundProfileError) {
    const msg = encodeURIComponent(foundProfileError.message)
    return NextResponse.redirect(
      new URL(`/club/${id}?error=profile_lookup_failed&message=${msg}`, req.url)
    )
  }

  if (!foundProfile) {
    return NextResponse.redirect(
      new URL(`/club/${id}?error=user_not_found`, req.url)
    )
  }

  const { data: existingMembership, error: existingMembershipError } =
    await supabase
      .from('memberships')
      .select('id')
      .eq('club_id', id)
      .eq('user_id', foundProfile.id)
      .maybeSingle()

  if (existingMembershipError) {
    const msg = encodeURIComponent(existingMembershipError.message)
    return NextResponse.redirect(
      new URL(
        `/club/${id}?error=existing_membership_lookup_failed&message=${msg}`,
        req.url
      )
    )
  }

  if (existingMembership) {
    return NextResponse.redirect(
      new URL(`/club/${id}?error=already_member`, req.url)
    )
  }

  const { error: insertError } = await supabase.from('memberships').insert({
    user_id: foundProfile.id,
    club_id: id,
    role,
    status: 'active',
  })

  if (insertError) {
    const msg = encodeURIComponent(insertError.message)
    const code = encodeURIComponent(insertError.code ?? 'unknown')
    return NextResponse.redirect(
      new URL(
        `/club/${id}?error=create_membership&code=${code}&message=${msg}`,
        req.url
      )
    )
  }

  return NextResponse.redirect(
    new URL(`/club/${id}?success=member_created`, req.url)
  )
}