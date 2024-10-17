import { supabase } from '@/lib/client'; // Asegúrate de tener Supabase configurado

export async function GET(req) {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true }) // Ordenar los eventos por fecha ascendente
      .gte('date', new Date().toISOString()); // Filtra los eventos que no han pasado

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch events' }), { status: 500 });
  }
}
