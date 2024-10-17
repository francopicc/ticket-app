'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';  // Importar Framer Motion

export default function Home() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para formatear la fecha desde el formato "YYYY-MM-DD"
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    return { day, month };
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/search/event/general');
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <motion.main 
      className="flex min-h-screen pl-[25em] pr-[25em] flex-col p-6"
      initial={{ opacity: 0 }} // Animación de opacidad para el fondo
      animate={{ opacity: 1 }} // Estado final de opacidad
      transition={{ duration: 0.5 }} // Duración de la transición
    >
      <Navbar />
      <div className="mt-10">
        <h1 className="font-extrabold text-[18px]">Próximos Eventos</h1>
        {events.length > 0 ? (
          <motion.ul 
            className="mt-4 grid grid-cols-3 gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  staggerChildren: 0.2 // Aplica un pequeño retardo a cada evento
                }
              }
            }}
          >
            {events.map((event) => {
              const { day, month } = formatEventDate(event.date);
              return (
                <Link href={'/event/'+event.id} key={event.id}>
                  <motion.li 
                    className="relative rounded-lg shadow-md overflow-hidden max-h-[12em] min-h-[12em] bg-black"
                    initial={{ opacity: 0, scale: 0.95 }} // Estado inicial de la animación
                    animate={{ opacity: 1, scale: 1 }} // Estado final de la animación
                    transition={{ duration: 0.3, ease: 'easeInOut' }} // Configuración de la animación
                  >
                    {/* Imagen del evento */}
                    <div className="h-28 max-h-28 w-full">
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Contenedor de información con fondo negro */}
                    <div className="bg-black p-2">
                      {/* Fecha del evento */}
                      <div className="flex items-center text-white mb-2 ml-[1em]">
                        <div className="text-center mr-4">
                          <p className="text-2xl -mb-2 font-bold">{day}</p>
                          <p className="text-sm font-semibold">{month}</p>
                        </div>

                        {/* Detalles del evento */}
                        <div className="mt-1">
                          <p className="text-white font-semibold text-md leading-[13.5px]">{event?.name?.toUpperCase()}</p>
                          <p className="text-gray-400 text-xs">{event?.description?.toUpperCase()}</p>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                </Link>
              );
            })}
          </motion.ul>
        ) : (
          <p>No hay eventos próximos.</p>
        )}
      </div>
    </motion.main>
  );
}
