import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export async function GET() {
  const commentsRef = collection(db, 'comments');
  const q = query(commentsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  const comments = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return Response.json(comments);
}

export async function POST(req) {
  const { name, message } = await req.json();

  if (!name || !message) {
    return new Response(JSON.stringify({ error: 'Name and message are required' }), { status: 400 });
  }

  try {
    await addDoc(collection(db, 'comments'), {
      name,
      message,
      createdAt: serverTimestamp(),
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return new Response(JSON.stringify({ error: 'Failed to add comment' }), { status: 500 });
  }
}
