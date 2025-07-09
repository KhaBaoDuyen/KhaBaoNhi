let comments = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(comments);
  } else if (req.method === 'POST') {
    const { name, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: 'Missing name or message' });
    }
    comments.push({ name, message, createdAt: new Date().toISOString() });
    res.status(201).json({ success: true });
  }
}
