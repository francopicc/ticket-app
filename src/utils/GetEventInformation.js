import { supabase } from "@/lib/client";

// Función para obtener la información del evento y sus subplanes
const getEventInformationAndPlans = async (eventId) => {
  // Primera consulta: obtener los datos del evento desde 'events'
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .select('id, name, description, date, created_by, image')
    .eq('id', eventId)  // Filtra por el id del evento
    .single();  // Solo queremos un evento (asumimos que el id es único)

  if (eventError) {
    throw eventError;
  }

  // Segunda consulta: obtener los subplanes relacionados con el evento desde 'event_plans'
  const { data: eventPlans, error: plansError } = await supabase
    .from('event_plans')
    .select('id, name, price, event_from, quantity, about')  // Selecciona los datos que necesites
    .eq('event_from', eventId);  // Relaciona con el mismo ID del evento

  if (plansError) {
    throw plansError;
  }

  // Retorna ambos datos en un objeto
  return {
    event: eventData,
    plans: eventPlans
  };
}

export default getEventInformationAndPlans;
