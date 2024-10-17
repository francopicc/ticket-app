'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function UsernamePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user?.username) {
      // Si ya hay un username, redirige al inicio
      router.push('/');
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!username.trim()) {
        throw new Error('Username cannot be empty');
      }

      const response = await fetch('/api/profile/username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      router.push('/'); // Redirige al inicio después de actualizar
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (session?.user?.username) {
    // Si ya hay un username, redirige al inicio
    return null; // Puedes mostrar un loading spinner aquí si prefieres
  }

  return (
    <div className="container">
      <h1>Set Your Username</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
