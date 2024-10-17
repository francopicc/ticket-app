// funcionamiento suscripciones

import { supabase } from '@/lib/client';

export async function getTickets(userId) {
  const { data, error } = await supabase
    .from('tickets')
    .select('id, plan_name, start_date, buyer_id, seller_id') // Asegúrate de que estás seleccionando los campos necesarios
    .eq('buyer_id', userId) // Filtra por el ID del usuario

  if (error) {
    throw error; // Lanza un error si la operación falla
  }

  return data; // Devuelve la información del usuario
}
