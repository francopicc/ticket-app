import generatePaymentLink from "@/utils/PaymentLink";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        const { planName, planDescription, planPrice, event_date, buyerId, accessToken, seller_id, subplan_id, subplan_name } = await request.json()
        console.log("Seller id " + seller_id)
        const link = await generatePaymentLink({planName, planDescription, planPrice, event_date, buyerId, accessToken, seller_id, subplan_id, subplan_name})
        // access token, nombre, descripcion, precio y el id del comprador
        return NextResponse.json({message: "Link enviado", paymentLink: link.sandbox_init_point})
    } catch(e) {
        return NextResponse.json({message: "Error", error: e})
    }
}