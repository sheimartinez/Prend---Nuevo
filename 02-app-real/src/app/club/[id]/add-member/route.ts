import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const formData = await req.formData()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const role = formData.get('role') as string

  console.log('--- ADD MEMBER START ---')
  console.log('CLUB ID:', id)
  console.log('EMAIL INGRESADO:', email)
  console.log('ROLE INGRESADO:', role)

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  console.log('AUTH USER:', user)
  console.log('AUTH USER ERROR:', userError)

  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const { data: membership, error: membershipError } = await supabase
    .from('memberships')
    .select('*')
    .eq('club_id', id)
    .eq('user_id', user.id)
    .single()

  console.log('ADMIN MEMBERSHIP:', membership)
  console.log('ADMIN MEMBERSHIP ERROR:', membershipError)

  if (!membership || membership.role !== 'admin') {
    return NextResponse.redirect(new URL(`/club/${id}?error=not_admin`, req.url))
  }

  const { data: foundProfile, error: foundProfileError } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('email', email)
    .maybeSingle()

  console.log('PROFILE BUSCADO POR EMAIL:', email)
  console.log('FOUND PROFILE:', foundProfile)
  console.log('FOUND PROFILE ERROR:', foundProfileError)

  if (foundProfileError) {
    console.log('ERROR AL BUSCAR PROFILE:', foundProfileError)

    return NextResponse.redirect(
      new URL(`/club/${id}?error=profile_lookup_failed`, req.url)
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

  console.log('EXISTING MEMBERSHIP:', existingMembership)
  console.log('EXISTING MEMBERSHIP ERROR:', existingMembershipError)

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

  console.log('INSERT MEMBERSHIP ERROR:', insertError)

  if (insertError) {
    return NextResponse.redirect(
      new URL(`/club/${id}?error=create_membership`, req.url)
    )
  }

  return NextResponse.redirect(
    new URL(`/club/${id}?success=member_created`, req.url)
  )
}