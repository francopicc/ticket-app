"use server"
import { MercadoPagoConfig, Preference } from 'mercadopago';
// Función para generar el enlace de pago
const generatePaymentLink = async ({ planName, planDescription, planPrice, event_date, buyerId, accessToken, seller_id, subplan_id, subplan_name }) => {
  console.log("Access Token del vendedor " + accessToken)
  // Validar las entradas
  if (!accessToken || !planName || !planDescription || isNaN(planPrice) || planPrice <= 0) {
    throw new Error('Invalid input parameters.');
  }
  // Inicializa el cliente de MercadoPago con el accessToken del usuario
  const client = new MercadoPagoConfig({
    accessToken: accessToken,
  });

  console.log({
    planName, planDescription, planPrice, event_date, buyerId, accessToken, seller_id, subplan_id, subplan_name
})

  try {
    // Define el cuerpo de la solicitud para la preferencia de pago
    const preferenceResponse = await new Preference(client).create({
      body: {
        items: [
          {
            id: "prueba",
            title: planName + " - " + subplan_name ,
            quantity: 1,
            unit_price: Number(planPrice),
          },
        ],
        notification_url: process.env.MERCADOPAGO_REDIRECT_URI,
        external_reference: {
          buyerId,
          seller_id,
          subplan_id,
          subplan_name
        },
        marketplace_fee: planPrice * 0.10,
        payment_methods: {
          excluded_payment_methods: [
            {
              id: 'amex'
            }
          ],
          excluded_payment_types: [
            {
              id: 'ticket'
            }
          ],
          installments: 1  // Prohibir pagos en cuotas
        },
      },
    });    
    console.log('Preference created successfully:', preferenceResponse);
    console.log(preferenceResponse.sandbox_init_point)
    return preferenceResponse;
  } catch (error) {
    console.error(`Error generating payment link: ${error.message}`);
    throw new Error(`Error generating payment link: ${error.message}`);
  }
};

export default generatePaymentLink;
