"use client"

import Navbar from "@/components/Navbar";
import { getTickets } from "@/utils/GetTickets";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function SubscriptionProfilePage() {
    const [subData, setSubData] = useState(null);
    const { data: session, status } = useSession();
    
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            const fetchTickets = async () => {
                const data = await getTickets(session.user.id);
                setSubData(data);
            };
            
            fetchTickets();  
        }
    }, [status, session?.user?.id]);

    return (
        <main>
            <Navbar />
            {subData ? (
                <div>
                    <p>Tienes {subData.length} suscripciones.</p>
                    {
                        subData.map((sub, i) => {
                            return (
                                <div key={i}>
                                    <p>{sub.plan_name}</p>
                                </div>
                            )
                        })
                    }
                </div>
            ) : (
                <div>
                    <p>No hay suscripciones</p>
                </div>
            )}
        </main>
    );
}
