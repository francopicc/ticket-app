// utils/pkce.js
import crypto from 'crypto';

// Función para generar un código verificador
export function generateCodeVerifier() {
    const length = 43 + Math.floor(Math.random() * (128 - 43 + 1)); // Longitud entre 43 y 128
    return crypto.randomBytes(length).toString('base64url').slice(0, length); // Asegúrate de que sea de la longitud correcta
}

// Función para generar el código de desafío usando S256
export function generateCodeChallenge(codeVerifier) {
    return crypto.createHash('sha256')
        .update(codeVerifier, 'utf8')
        .digest('base64url');
}
