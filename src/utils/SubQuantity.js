import { supabase } from '@/lib/client';

// Obtener la cantidad disponible de un plan y reducirla en 1
export async function reducePlanQuantity(planId) {
  console.log(planId)
  try {
    // 1. Obtener la cantidad actual del plan según el ID del plan
    const { data: planData, error: fetchError } = await supabase
      .from('event_plans')
      .select('quantity')
      .eq('id', planId)
      .single(); // Selecciona un solo registro ya que el plan es único por ID

    if (fetchError) {
      throw fetchError;
    }

    const currentQuantity = planData.quantity;

    // 2. Verificar si la cantidad es mayor que 0 antes de restar
    if (currentQuantity > 0) {
      const newQuantity = currentQuantity - 1;

      // 3. Actualizar la cantidad restada en la base de datos
      const { error: updateError } = await supabase
        .from('event_plans')
        .update({ quantity: newQuantity })
        .eq('id', planId);

      if (updateError) {
        throw updateError;
      }

      return { success: true, newQuantity }; // Devuelve la nueva cantidad actualizada
    } else {
      throw new Error('No hay suficiente cantidad disponible para este plan.');
    }
  } catch (error) {
    console.error('Error al reducir la cantidad del plan:', error);
    return { success: false, message: error.message }; // Devuelve un error si algo falla
  }
}
