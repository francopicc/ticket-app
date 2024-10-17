import { MercadoPagoConfig, OAuth, User } from 'mercadopago'; // Importar los módulos necesarios
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import MPTokenSaver from '@/utils/MPTokenSaver';

// Configura el SDK con tus credenciales
const client = new MercadoPagoConfig({
  clientId: process.env.MERCADOPAGO_CLIENT_ID,
  clientSecret: process.env.MERCADOPAGO_CLIENT_SECRET,
  options: {
    timeout: 5000,
    idempotencyKey: 'abc' // Opcional, para prevenir solicitudes duplicadas
  }
});

// Inicializa el objeto de OAuth
const oauth = new OAuth(client);

// Función para intercambiar el código de autorización por un Access Token
export async function GET(req) {
  const session = await getServerSession(authOptions)
  console.log(session)
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  
  // Recupera el code_verifier de las cookies
  const cookieStore = cookies();
  const codeVerifier = cookieStore.get('code_verifier')?.value;

  if (!code || !codeVerifier) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Crea el objeto de solicitud para obtener el Access Token
  const requestBody = {
    grant_type: 'authorization_code', // Corregido aquí
    code,
    redirect_uri: process.env.MERCADOPAGO_REDIRECT_URI,
    client_secret: process.env.MERCADOPAGO_CLIENT_SECRET,
    code_verifier: codeVerifier
  };

  try {
    // Realiza la solicitud para obtener el Access Token
    const response = await oauth.create({
      body: requestBody
    });
    console.log(response)
    const accessToken = response.access_token;
    const userId = session.user.id

    const client = new MercadoPagoConfig({ accessToken: accessToken })
    const dataFromUser = await new User(client).get()

    const mpEmail = dataFromUser.email
    const mpUsername = dataFromUser.nickname

    await MPTokenSaver(accessToken, userId, mpEmail, mpUsername)
    // Guarda el accessToken en la sesión o base de datos
    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return NextResponse.json({ error: error.response?.data || 'Failed to exchange code for token' }, { status: 500 });
  }
}
