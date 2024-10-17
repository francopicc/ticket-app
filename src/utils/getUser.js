import { supabase } from '@/lib/client';

export async function getUser(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('id, accessToken') // Asegúrate de que estás seleccionando los campos necesarios
    .eq('id', userId) // Filtra por el ID del usuario
    .single(); // Obtiene un solo registro

  if (error) {
    throw error; // Lanza un error si la operación falla
  }

  return data; // Devuelve la información del usuario
}
