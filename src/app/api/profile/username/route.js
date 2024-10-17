import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { supabase } from '@/lib/client';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  console.log(session)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { username } = await request.json();

  if (!username.trim()) {
    return NextResponse.json({ error: 'Username cannot be empty' }, { status: 400 });
  }

  const { error } = await supabase
    .from('users')
    .update({ username })
    .eq('id', session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Username updated successfully' });
}
