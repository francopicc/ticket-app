import { supabase } from "@/lib/client";

const getPlansByUser = async (userId) => {
  const { data, error } = await supabase
    .from('events')
    .select('id, name, description, price, created_by, image')
    .eq('created_by', userId); // Filtra por la columna 'created_by'

  if (error) {
    throw error;
  }

  return data;
}

export default getPlansByUser;
