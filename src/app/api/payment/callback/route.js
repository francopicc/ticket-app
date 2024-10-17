import { NextResponse } from "next/server";
import MercadoPagoConfig, { Payment } from "mercadopago";
import CreateTicket from "@/utils/CreateTicket";
import { reducePlanQuantity } from "@/utils/SubQuantity";

export async function POST(request) {
  try {
    console.log("Iniciando solicitud POST"); // Log inicial
    const mercadopago = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });

    // Obtén el cuerpo de la solicitud
    const body = await request.json();
    console.log("Cuerpo de la solicitud recibido:", body); // Log del cuerpo de la solicitud

    // Asegúrate de que body.data y body.data.id estén definidos
    if (!body.data || !body.data.id) {
      console.error("ID de pago no proporcionado"); // Log de error en caso de que falte el ID
      return NextResponse.json(
        {
          success: false,
          error: "ID de pago no proporcionado",
        },
        { status: 400 }
      );
    }

    // Obtener el pago de MercadoPago
    const payment = await new Payment(mercadopago).get({ id: body.data.id });
    console.log(body.data.id)
    const ext = JSON.parse(payment.external_reference);
    console.log("Información de pago obtenida:", payment); // Log de la información del pago

    // Preparar la información para crear la suscripción
    const planPayment = {
      plan_name: payment.description,
      subplan_name: ext.subplan_name,
      created_at: new Date(),
      order_id_mp: payment.order.id,
      buyer_id: ext.buyerId, // Extraído del external_reference
      seller_id: ext.seller_id,
      subplan_id: ext.subplan_id
    };

    console.log("Datos del plan de pago preparados:", planPayment); // Log de los datos del plan de pago
    
    const sub = await CreateTicket(planPayment);
    console.log(sub)

    await reducePlanQuantity(planPayment.subplan_id)


    return NextResponse.json({ success: true, planPayment });
  } catch (e) {
    console.error("Error durante la ejecución:", e.message); // Log del error
    return NextResponse.json({ success: false, error: e.message });
  }
}
