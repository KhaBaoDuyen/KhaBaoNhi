import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const filePath = path.join(process.cwd(), 'public/data/comments.json');

export async function GET() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading comments.json:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newComment = await request.json();
    if (!newComment.name || !newComment.message) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

     const data = await fs.readFile(filePath, 'utf-8');
    const comments = JSON.parse(data);

     comments.push(newComment);

     await fs.writeFile(filePath, JSON.stringify(comments, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Comment saved' });
  } catch (error) {
    console.error('Error writing comments.json:', error);
    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 });
  }
}
