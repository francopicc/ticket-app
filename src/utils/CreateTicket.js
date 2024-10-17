import { supabase } from '@/lib/client';

const createTicket = async (planPayment) => {
  const { data, error } = await supabase
    .from('tickets')
    .insert([
      {
        plan_name: planPayment.plan_name,
        subplan_name: planPayment.subplan_name,
        created_at: planPayment.created_at,
        order_id_mp: planPayment.order_id_mp,
        buyer_id: planPayment.buyer_id,
        seller_id: planPayment.seller_id,
        subplan_id: planPayment.subplan_id
      }
    ]);

  if (error) {
    console.log(error)
    throw new Error(`Error creando el ticket: ${error.message}`);

  }

  return data;
}

export default createTicket;
