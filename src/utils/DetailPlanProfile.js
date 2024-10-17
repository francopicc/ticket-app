import { supabase } from '@/lib/client';

export async function DetailPlanFromHome(seller_id) {
  const { data, error } = await supabase
    .from('users')
    .select('image, name') // Asegúrate de que estás seleccionando los campos necesarios
    .eq('id', seller_id) // Filtra por el ID del usuario
    .single(); // Obtiene un solo registro

  if (error) {
    throw error; // Lanza un error si la operación falla
  }

  return data; // Devuelve la información del usuario
}
