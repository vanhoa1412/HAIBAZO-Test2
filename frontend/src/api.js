const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    if (payload && Array.isArray(payload.detail)) {
      throw new Error(payload.detail.map((item) => item.msg || item.message || 'Request failed').join(', '));
    }
    if (payload) {
      const message =
        payload.message ||
        payload.error ||
        payload.detail ||
        payload.title ||
        (Array.isArray(payload.errors) ? payload.errors.map((item) => item.defaultMessage || item.message).filter(Boolean).join(', ') : '');
      throw new Error(message || `Request failed (${response.status})`);
    }
    throw new Error(`Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function buildQuery(params) {
  return new URLSearchParams(params).toString();
}

function createResourceApi(resource) {
  return {
    list(page = 1, pageSize = 5) {
      return request(`/api/${resource}?${buildQuery({ page, pageSize })}`);
    },
    all() {
      return request(`/api/${resource}?${buildQuery({ page: 1, pageSize: 100 })}`);
    },
    create(payload) {
      return request(`/api/${resource}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    update(id, payload) {
      return request(`/api/${resource}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },
    remove(id) {
      return request(`/api/${resource}/${id}`, {
        method: 'DELETE',
      });
    },
  };
}

export const authorsApi = createResourceApi('authors');
export const booksApi = createResourceApi('books');
export const reviewsApi = createResourceApi('reviews');
