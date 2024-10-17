import { supabase } from "@/lib/client";
import { NextResponse } from "next/server";
import getUserProfile from "@/utils/UserSearch";

export async function GET (request) {
    const op = request.nextUrl.searchParams
    console.log(op)
    const query = op.get("username")
    try {
        const profile = await getUserProfile(query)
        console.log(profile)
        return NextResponse.json({ response: profile })
    } catch(e) {
        return NextResponse.json({ message: "Ocurrio un error", error: e })
    }
}