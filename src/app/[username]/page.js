// pages/profile/[profile].js
"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { getUser } from "@/utils/getUser";

export default function ProfilePage() {
  const { data: session } = useSession()
  const { username } = useParams();
  const router = useRouter(); // Para redirigir al usuario
  const [profileData, setProfileData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellerId, setSellerId] = useState(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (username) {
          const response = await axios.get(`/api/search/profile?username=${username}`);
          console.log(response);
          setProfileData(response.data.response);
          const userId = response.data.response.id;
          setSellerId(userId)
          if (userId) {
            const plansResponse = await axios.get(`/api/search/profile/plans?id=${userId}`);
            setPlans(plansResponse.data.plans);
            console.log(plansResponse.data.plans)
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Error fetching profile data");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  const handleBuyPlan = async (plan) => {
    try {
      const response = await fetch('/api/create/preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName: plan.name,
          planDescription: plan.description,
          planPrice: plan.price,
          buyerId: session.user.id, // Aquí pasamos el ID del usuario
          accessToken: (await getUser(sellerId)).accessToken,
          seller_id: await plans[0].created_by
        }),
      })
      console.log(await plans[0].created_by);
    
      if (!response.ok) {
        throw new Error('Error al crear la preferencia');
      }
      
      const data = await response.json();
      router.push(data.paymentLink)
    } catch (error) {
      console.error('Error al crear la preferencia:', error);
    }
  };

  if (loading) {
    return (
      <main>
        <Navbar />
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <Navbar />
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar />
      <div className="mt-10">
        <p>info de perfil</p>
        <p>{profileData.name}</p>
        <img src={profileData.image} width={80} />
        <p>{profileData.username}</p>
        <p>{profileData.email}</p>
      </div>
      <div>
        <p>planes del usuario</p>
        {plans.map((plan) => (
          <li key={plan.id}>
            <p>Name: {plan.name}</p>
            <p>Description: {plan.description}</p>
            <p>Price: ${plan.price}</p>
            <button
              onClick={() => handleBuyPlan(plan)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Comprar plan
            </button>
          </li>
        ))}
      </div>
    </main>
  );
}
