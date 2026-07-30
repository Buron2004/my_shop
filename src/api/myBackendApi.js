const BASE_URL = import.meta.env.VITE_API_URL;

// helper to build headers, optionally including the auth token
function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      // no Content-Type here — the browser sets it automatically for FormData
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Image upload failed');
  return data.url;
}

export async function getMyProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function getMyProductById(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function createMyProduct(product) {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function deleteMyProduct(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function createOrder({ items, total, shippingAddress }) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ items, total, shippingAddress }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to place order');
  return data;
}

export async function payForOrder(orderId) {
  const res = await fetch(`${BASE_URL}/orders/${orderId}/pay`, {
    method: 'POST',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Payment failed');
  return data;
}

export async function updateMyProduct(id, updates) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function getPosts() {
  const res = await fetch(`${BASE_URL}/posts`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function getPostById(id) {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function createPost(post) {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(post),
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function deletePost(id) {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function updatePost(id, updates) {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}


// --- Auth ---

export async function registerUser({ name, email, password }) {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  } catch (err) {
    if (err.message === 'Failed to fetch') {
      throw new Error('Unable to reach the server. Please check your connection and try again.');
    }
    throw err;
  }
}

export async function loginUser({ email, password }) {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  } catch (err) {
    if (err.message === 'Failed to fetch') {
      throw new Error('Unable to reach the server. Please check your connection and try again.');
    }
    throw err;
  }
}

export async function verifyOtp({ email, otp }) {
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Verification failed');
  return data; // { token, user }
}

export async function resendOtp({ email }) {
  const res = await fetch(`${BASE_URL}/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to resend code');
  return data;
}

export async function requestPasswordReset({ email }) {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send reset link');
  return data;
}

export async function resetPassword({ email, token, newPassword }) {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to reset password');
  return data;
}

export async function googleLogin(credential) {
  const res = await fetch(`${BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Google sign-in failed');
  return data;
}