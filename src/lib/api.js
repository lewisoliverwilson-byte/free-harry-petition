const BASE = 'https://py0dyheao1.execute-api.eu-west-1.amazonaws.com/prod';

export async function getSignatures() {
  const res = await fetch(`${BASE}/signatures`);
  if (!res.ok) throw new Error('Failed to load signatures');
  return res.json();
}

export async function postSignature(name, reason = null, photo = null, type = 'against', parentId = null) {
  const res = await fetch(`${BASE}/signatures`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, reason, photo, type, parent_id: parentId }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${body}`)
  }
  return res.json();
}

export async function postVote(id, direction) {
  const res = await fetch(`${BASE}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, direction }),
  });
  if (!res.ok) throw new Error('Vote failed');
  return res.json();
}

export async function getClickCount() {
  const res = await fetch(`${BASE}/clicks`);
  if (!res.ok) throw new Error('Failed to load clicks');
  return res.json();
}

export async function postClick() {
  const res = await fetch(`${BASE}/clicks`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to register click');
  return res.json();
}
