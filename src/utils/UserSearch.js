// utils/UserSearch.js
import { supabase } from "@/lib/client"

const getUserProfile = async (username) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, email, image, name')
    .eq('username', username)
    .single()

  if (error) {
    throw error
  }

  return data
}

export default getUserProfile