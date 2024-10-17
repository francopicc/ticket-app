// utils/MPTokenSaver.js
import { supabase } from "@/lib/client"; // Asegúrate de que supabase esté configurado correctamente en lib/client.js

const MPTokenSaver = async (accessToken, userId, mpEmail, mpUsername) => {
  // Intenta actualizar el campo accessToken en la tabla users para el usuario dado
  const { data, error } = await supabase
    .from('users') // Asegúrate de que el nombre de la tabla es 'users'
    .update({ accessToken, mpEmail, mpUsername }) // Actualiza el campo accessToken con el nuevo valor
    .eq('id', userId); // Filtra por el userId

  if (error) {
    throw error; // Lanza un error si la operación falla
  }

  return data; // Devuelve los datos actualizados
}

export default MPTokenSaver;
