import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('bnUser') || '{}');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

// ── Auth ────────────────────────────────────────────────────
export const login    = (d) => API.post('/auth/login', d);
export const register = (d) => API.post('/auth/register', d);
export const getMe    = ()  => API.get('/auth/me');
export const updateProfile = (d) => API.put('/auth/profile', d);

// ── Categories ──────────────────────────────────────────────
export const getCategories = () => API.get('/categories');

// ── Vendors ─────────────────────────────────────────────────
export const getVendors      = (p) => API.get('/vendors', { params: p });
export const getVendor       = (id) => API.get(`/vendors/${id}`);
export const createVendor    = (d)  => API.post('/vendors', d);
export const updateVendor    = (id, d) => API.put(`/vendors/${id}`, d);
export const getMyVendors    = () => API.get('/vendors/my/listings');

// ── Products ────────────────────────────────────────────────
export const getProducts  = (p)     => API.get('/products', { params: p });
export const getProduct   = (id)    => API.get(`/products/${id}`);
export const createProduct= (d)     => API.post('/products', d);
export const updateProduct= (id, d) => API.put(`/products/${id}`, d);
export const deleteProduct= (id)    => API.delete(`/products/${id}`);

// ── Bookings ────────────────────────────────────────────────
export const createBooking    = (d)  => API.post('/bookings', d);
export const getMyBookings    = ()   => API.get('/bookings/my');
export const getVendorBookings= (id) => API.get(`/bookings/vendor/${id}`);
export const getBooking       = (id) => API.get(`/bookings/${id}`);
export const updateBookingStatus = (id, d) => API.patch(`/bookings/${id}/status`, d);
export const cancelBooking    = (id) => API.delete(`/bookings/${id}`);

// ── Reviews ─────────────────────────────────────────────────
export const getReviews   = (vendorId) => API.get(`/reviews/vendor/${vendorId}`);
export const createReview = (d)        => API.post('/reviews', d);

// ── Admin ───────────────────────────────────────────────────
export const getAdminStats   = ()  => API.get('/admin/stats');
export const getAdminUsers   = ()  => API.get('/admin/users');
export const getAdminBookings= ()  => API.get('/admin/bookings');
export const verifyVendor    = (id)=> API.patch(`/admin/vendors/${id}/verify`);
export const featureVendor   = (id)=> API.patch(`/admin/vendors/${id}/feature`);

export default API;
