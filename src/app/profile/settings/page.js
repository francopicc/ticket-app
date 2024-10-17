"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getMPLinkInfo } from "@/utils/MPLinkInfo";
import { useEffect, useState } from "react";

export default function ProfileSettings() {
  const { data: session, status } = useSession();
  const [mpLinkInfo, setMpLinkInfo] = useState(null);

  useEffect(() => {
    // Ejecuta el efecto solo si la sesión está disponible
    if (session?.user?.id) {
      const fetchMPLinkInfo = async () => {
        try {
          const dataMp = await getMPLinkInfo(session.user.id);
          setMpLinkInfo(dataMp);
        } catch (error) {
          console.error('Error fetching MP link info:', error);
        }
      };

      fetchMPLinkInfo();
    }
  }, [session]); // Solo vuelve a ejecutar si `session` cambia

  if (status === "loading") {
    return <p>Loading...</p>; // Opcional: Muestra un mensaje mientras se carga la sesión
  }

  if (!session) {
    return <p>No estás autenticado.</p>; // Opcional: Mensaje para usuarios no autenticados
  }

  return (
    <main>
      <Navbar />
      <div>
        {session.user.hasMP ? (
          <div>
            <p className="font-semibold">Mercadopago enlazado</p>
            <p>Está MP Conectado: {session.user.hasMP ? 'Sí' : 'No'}</p>
            {mpLinkInfo ? (
              <div>
                <p>Email: {mpLinkInfo.mpEmail}</p>
                <p>User: {mpLinkInfo.mpUsername}</p>
              </div>
            ) : (
              <p>Loading MP link info...</p> // Mensaje mientras se carga la información de MP
            )}
          </div>
        ) : (
          <div>
            <p>Enlazar Mercadopago</p>
            <Link href={`/api/payment/auth`}>
              <p>Ir a MP</p>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
