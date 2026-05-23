import jwt from 'jsonwebtoken';

const JWT_SECRET = 'crm-secret-key-that-matches-boq';
const token = jwt.sign(
  { id: '123', username: 'test@example.com', role: 'admin' },
  JWT_SECRET,
  { expiresIn: '24h' }
);

async function main() {
  try {
    const res = await fetch('http://localhost:3001/api/crm/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'API Test Project',
        client: 'API Client'
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Success:", data);
  } catch (err: any) {
    console.error("Failed:", err.message);
  }
}
main();
