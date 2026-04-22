'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '').trim()

  if (!email || !password) {
    redirect('/login?error=missing_fields')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.log('LOGIN ERROR:', error)
    redirect('/login?error=invalid_credentials')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '').trim()

  if (!email || !password) {
    redirect('/login?error=missing_fields')
  }

  if (password.length < 6) {
    redirect('/login?error=weak_password')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.log('SIGNUP ERROR:', error)
    redirect('/login?error=signup_failed')
  }

  if (!data.user) {
    redirect('/login?error=signup_failed')
  }

  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: data.user.id,
      email,
    },
    {
      onConflict: 'id',
    }
  )

  if (profileError) {
    console.log('PROFILE UPSERT ERROR AFTER SIGNUP:', profileError)
  }

  revalidatePath('/', 'layout')

  if (!data.session) {
    redirect('/login?success=check_email')
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}