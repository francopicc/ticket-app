// pages/api/authorize-mercadopago.js
import { NextResponse } from 'next/server';
import { generateCodeVerifier, generateCodeChallenge } from '@/utils/pkce';

export async function GET() {
  const clientId = process.env.MERCADOPAGO_CLIENT_ID;
  const redirectUri = process.env.MERCADOPAGO_REDIRECT_URI; // Debe ser HTTPS
  const appId = process.env.MERCADOPAGO_APP_ID
  const state = 'SUSCRIPCIONETCETCf'; // Genera un estado único, puede ser un UUID o un hash

  // Generar el code_verifier y code_challenge
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Guarda el code_verifier en una sesión o almacenamiento temporal adecuado
  // Por ejemplo, guardar en una cookie:
  const response = NextResponse.redirect(
    `https://auth.mercadopago.com.ar/authorization?client_id=${appId}&response_type=code&platform_id=mp&state=${state}&redirect_uri=${redirectUri}&code_challenge=${codeChallenge}&code_challenge_method=S256`
  );
  response.cookies.set('code_verifier', codeVerifier, { httpOnly: true, secure: true }); // Guarda el code_verifier en una cookie
  return response;
}
