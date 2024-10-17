// utils/UserSearch.js
import { supabase } from "@/lib/client"

const CreatePlan = async ( name, description, price, userId ) => {
    const { data, error } = await supabase
    .from('events')
    .insert([{ name, description, price, created_by: userId}]);
  
  if (error) {
    throw error;
  }

  return data
}

export default CreatePlan