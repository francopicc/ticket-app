import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getUser } from '@/utils/getUser';
import { supabase } from '@/lib/client';

export async function POST(request) {
  const formData = await request.formData();  // Cambiamos a formData para manejar la imagen
  const name = formData.get('name');
  const description = formData.get('description');
  const date = formData.get('date');
  const tickets = JSON.parse(formData.get('tickets'));  // Los tickets están en formato JSON
  const image = formData.get('image');  // Obtenemos la imagen

  // Obtén la sesión del usuario
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  const userId = session.user.id; // ID del usuario que crea el plan

  // Validar los datos del request
  if (!name || !description || !date || !tickets || tickets.length === 0) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  let imageUrl = null; // Variable para almacenar la URL de la imagen

  // Si hay una imagen, la subimos a Supabase Storage
  if (image) {
    const fileName = `${userId}-${Date.now()}-${image.name}`;
    
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('event-cdn') // Asegúrate de que este bucket exista en Supabase
      .upload(fileName, image);

    if (storageError) {
      return new Response(JSON.stringify({ error: 'Failed to upload image' }), { status: 500 });
    }

    // Obtener la URL pública de la imagen subida
    imageUrl = supabase.storage.from('event-cdn').getPublicUrl(fileName).data.publicUrl;
  }

  try {
    // Inserta el nuevo evento en la tabla `events` (plan principal)
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert([{ name, description, date, created_by: userId, image: imageUrl }])  // Incluimos la URL de la imagen
      .select(); // .select() es necesario para obtener los datos insertados, incluido el ID del evento

    if (eventError) {
      throw new Error(eventError.message);
    }

    // Obtén el ID del evento recién creado
    const eventId = eventData[0].id;

    // Inserta los subplanes (entradas VIP, Básico, etc.) en la tabla `event_plans`
    const ticketPromises = tickets.map(ticket => {
      return supabase
        .from('event_plans')
        .insert({
          event_from: eventId,  // Asocia el subplan al evento recién creado
          name: ticket.type,
          price: ticket.price,
          quantity: ticket.quantity,
          about: ticket.info,
        });
    });

    await Promise.all(ticketPromises);

    return new Response(JSON.stringify({ message: 'Event and subplans created successfully', eventData }), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
