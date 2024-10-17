# Gestion y Venta de Tickets

Aplicacion basada en NextJS 14, y usando Supabase como base de datos principal, ademas se uso la funcion de Buckets de Supabase, para almacenar como CDN las imagenes de perfil, eventos, etc.

<img src="/public/chrome-capture-2024-9-17.png" width="500" alt=""/>
<img src="/public/chrome-capture-2024-9-17.gif" width="500" alt=""/>

Las tecnologias que usa esta app son:
<ul>
	<li>NextJS</li>
    <li>NextAuth</li>
    <li>Supabase</li>
    <li>Supabase Buckets</li>
    <li>MercadoPago</li>
</ul>

Antes de iniciar el proyecto, hay que crear un .env, con las siguientes variables:

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=
MERCADOPAGO_CLIENT_ID=
MERCADOPAGO_CLIENT_SECRET=
MERCADOPAGO_REDIRECT_URI=
MERCADOPAGO_APP_ID=
MERCADOPAGO_ACCESS_TOKEN=
```

Para manejar el OAuth de MercadoPago (necesario para recibir los pagos, en caso de ser el organizador), hay que usar una aplicacion de puente, por ejemplo ngrok, ya que en el redireccionamiento de la URL no acepta en local, sino que abriremos la aplicacion en una URL mediante una aplicacion puente, en este caso yo use ngrok.
