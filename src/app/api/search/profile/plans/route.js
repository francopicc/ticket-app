// app/api/plans/route.js
import { NextResponse } from "next/server";
import getPlansByUser from "@/utils/FindPlans";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

export async function GET(request) {
  const op = request.nextUrl.searchParams
  console.log(op)
  const query = op.get("id")
  try {
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Obtener los planes creados por el usuario
    const plans = await getPlansByUser(query);

    return NextResponse.json({ plans }, { status: 200 });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
