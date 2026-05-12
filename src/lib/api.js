const BASE = 'https://py0dyheao1.execute-api.eu-west-1.amazonaws.com/prod';

export async function getSignatures() {
  const res = await fetch(`${BASE}/signatures`);
  if (!res.ok) throw new Error('Failed to load signatures');
  return res.json();
}

export async function postSignature(name, reason = null) {
  const res = await fetch(`${BASE}/signatures`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, reason }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${body}`)
  }
  return res.json();
}
