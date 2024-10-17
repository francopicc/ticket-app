"use client"
import { useEffect, useState } from "react";
import { getUser } from "@/utils/getUser";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import Navbar from "@/components/Navbar";

export default function EventPage() {
  const { data: session } = useSession()
  const router = useRouter(); // Para redirigir al usuario
  const { event } = useParams(); // Obtenemos el ID del evento desde la URL dinámica
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // para obtener id de usuario await getUser(eventData?.event?.created_by)
  useEffect(() => {
    console.log("ID del evento:", event); // Verifica que el id sea correcto

    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`/api/search/event?id=${event}`);
        console.log("Respuesta de la API:", response); // Verifica la estructura de los datos recibidos

        if (response.data && response.data.plans) {
          setEventData(response.data.plans); // Asegúrate de que `plans` exista en `response.data`
        } else {
          throw new Error("No se encontraron los planes en los datos");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event data:", error.message);
        setError("Error fetching event data");
        setLoading(false);
      }
    };

    if (event) {
      fetchEventDetails();
    } else {
      setError("No se encontró el ID del evento");
      setLoading(false);
    }

    
  }, [event]);

  // getUserInformation se le pasa id del creador del evento trae array con datos del creador
  const handleBuyPlan = async (eventData, subplan) => {
    try {
      const datatest = {
        planName: eventData.event.name,
          planDescription: eventData.event.description,
          planPrice: subplan.price,
          event_date: eventData.event.date,
          buyerId: session.user.id, // Aquí pasamos el ID del usuario
          accessToken: (await getUser(eventData?.event?.created_by)).accessToken,
          seller_id: await eventData?.event?.created_by,
          subplan_id: subplan.id,
          subplan_name: subplan.name
      }

      console.log(datatest)
      const response = await fetch('/api/create/preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName: eventData.event.name,
          planDescription: eventData.event.description,
          planPrice: subplan.price,
          event_date: eventData.event.date,
          buyerId: session.user.id, // Aquí pasamos el ID del usuario
          accessToken: (await getUser(eventData?.event?.created_by)).accessToken,
          seller_id: await eventData?.event?.created_by,
          subplan_id: subplan.id,
          subplan_name: subplan.name
        }),
      })

      if (!response.ok) {
        throw new Error('Error al crear la preferencia');
      }
      
      const data = await response.json();
      console.log(data)
      router.push(data.paymentLink)
    } catch (error) {
      console.error('Error al crear la preferencia:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <main className="flex min-h-screen pl-[25em] pr-[25em] flex-col p-6">
  <Navbar />
  <div className="mt-[2em]"> {/* Añadí max-width para limitar el tamaño total */}
    <img src={eventData.event.image} alt="" width={50} className="w-full h-[12em] object-cover rounded" />
    <div>
      <h1 className="text-3xl mt-4 font-bold">{eventData?.event?.name.toUpperCase()}</h1>
      <div className="flex flex-row space-x-[3em] mt-[1.5em] justify-start items-start">
        
        {/* Sección de información del evento */}
        <div className="flex flex-col space-y-4 max-w-[50%]">
          <div>
            <h4 className="text-lg font-semibold">Acerca del evento</h4>
            <span>{eventData.event.description}</span>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Ubicación y fecha</h4>
            <span>{eventData.event.date}</span>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-l-2 h-auto border-gray-500"></div> {/* Línea vertical */}
        
        {/* Sección de compra de entradas */}
        <div className="flex flex-col space-y-4 max-w-[40%]">
          <h2 className="text-lg font-semibold">Comprar entradas</h2>
          {eventData.plans.slice().reverse().map((subplan) => (
          <div key={subplan.id} className="border-[1px] border-stone-400 p-5 rounded flex flex-col w-[30em]">
            <span className="text-md font-semibold">{subplan.name}</span>
            <span className="text-xs text-stone-600 font-semibold">{subplan.about}</span>
            {subplan.quantity > 0 ? (
              <div>
                <span className="text-xs text-stone-500">Quedan aproximadamente {subplan.quantity} entradas</span>
                <button 
                  className="bg-stone-900 text-white px-4 py-2 rounded mt-4 w-full" 
                  onClick={() => handleBuyPlan(eventData, subplan)}>
                  Comprar {subplan.name}
                </button>
              </div>
            ) : (
              <span className="text-stone-800 font-bold mt-4 w-full text-center">SOLD OUT</span>
            )}
          </div>
        ))}

        </div>
      </div>
    </div>
  </div>
</main>

  );
}
