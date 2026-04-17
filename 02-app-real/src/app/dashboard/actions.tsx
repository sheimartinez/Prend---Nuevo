'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=true')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard') // Or main route, based on future development
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/login?error=true')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function createClub(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { count: existingClubsCount } = await supabase
    .from('clubs')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user.id)

  if ((existingClubsCount ?? 0) >= 1) {
    redirect('/dashboard?limit=true')
  }

  const { data: club, error: clubError } = await supabase
    .from('clubs')
    .insert({
      name,
      owner_id: user.id,
    })
    .select()
    .single()

  if (clubError || !club) {
    console.log(clubError)
    redirect('/dashboard?error=true')
  }

  const { error: membershipError } = await supabase
    .from('memberships')
    .insert({
      user_id: user.id,
      club_id: club.id,
      role: 'admin',
    })

  if (membershipError) {
    console.log(membershipError)
    redirect('/dashboard?error=true')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}