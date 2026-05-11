const BASE = import.meta.env.VITE_API_URL;

export async function getSignatures() {
  const res = await fetch(`${BASE}/signatures`);
  if (!res.ok) throw new Error('Failed to load signatures');
  return res.json();
}

export async function postSignature(name) {
  const res = await fetch(`${BASE}/signatures`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to sign');
  return res.json();
}
