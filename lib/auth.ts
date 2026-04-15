import { supabase } from '@/lib/supabase';

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }

  return data.session ?? null;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting user:', error.message);
    return null;
  }

  return data.user ?? null;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error getting profile:', error.message);
    return null;
  }

  return data;
}