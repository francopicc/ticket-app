import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { supabase } from '@/lib/client';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {},
      },
      checks: ['none'],
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
  }),
  callbacks: {
    async session({ session }) {
      // Aquí se obtiene el ID del usuario desde la sesión
      const userEmail = session.user.email;
      
      // Realiza una consulta a Supabase para obtener el ID y el campo isCompany desde el esquema users
      const { data, error } = await supabase
        .from('users') // Especifica la tabla users
        .select('id, username, accessToken') // Incluye el campo accessToken si está en la tabla
        .eq('email', userEmail)
        .single();
        
      if (error) {
        console.error('Error al obtener el perfil:', error.message);
      } else {
        // Añade id, username y hasMP a la sesión
        session.user.id = data.id;
        session.user.username = data.username;
        session.user.hasMP = data.accessToken ? true : false; // Establece hasMP basado en el valor de accessToken
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
