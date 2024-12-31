import { create } from "zustand";
import { getCookie, removeCookie } from "@/lib/cookies";

interface RequestConfig {
  headers?: Record<string, string>;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface ApiState {
  loading: Record<string, boolean>;
  error: Record<string, any>;
  data: Record<string, any>;
  fetch: <T>(url: string, requiresAuth?: boolean) => Promise<T>;
  post: <T>(
    url: string,
    payload: unknown,
    requiresAuth?: boolean
  ) => Promise<T>;
  put: <T>(
    url: string,
    payload: { id: string | number } & unknown,
    requiresAuth?: boolean
  ) => Promise<T>;
  delete: <T>(
    url: string,
    id: string | number,
    requiresAuth?: boolean
  ) => Promise<T>;
  setLoading: (key: string, value: boolean) => void;
  setError: (key: string, error: any) => void;
  setData: (key: string, data: any) => void;
}

const getAuthConfig = (requiresAuth: boolean): RequestConfig => {
  if (!requiresAuth) return {};
  const token = getCookie("token");
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const request = async <T>(
  method: string,
  url: string,
  config?: RequestConfig,
  body?: unknown
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...config?.headers,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${url}`, options);

  if (!response.ok) {
    if (response.status === 401) {
      removeCookie("token");
      window.location.href = "/login";
    }
    if (response.status === 422) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const useApiStore = create<ApiState>((set) => ({
  loading: {},
  error: {},
  data: {},
  setLoading: (key: string, value: boolean) =>
    set((state) => ({
      loading: { ...state.loading, [key]: value },
    })),
  setError: (key: string, error: any) =>
    set((state) => ({
      error: { ...state.error, [key]: error },
    })),
  setData: (key: string, data: any) =>
    set((state) => ({
      data: { ...state.data, [key]: data },
    })),
  fetch: async <T>(url: string, requiresAuth = true) => {
    const store = useApiStore.getState();
    store.setLoading(url, true);
    store.setError(url, null);

    try {
      const config = getAuthConfig(requiresAuth);
      const data = await request<T>("GET", url, config);
      store.setData(url, data);
      return data;
    } catch (error) {
      store.setError(url, error);
      throw error;
    } finally {
      store.setLoading(url, false);
    }
  },
  post: async <T>(url: string, payload: unknown, requiresAuth = true) => {
    const store = useApiStore.getState();
    store.setLoading(url, true);
    store.setError(url, null);

    try {
      const config = getAuthConfig(requiresAuth);
      const data = await request<T>("POST", url, config, payload);
      return data;
    } catch (error) {
      store.setError(url, error);
      throw error;
    } finally {
      store.setLoading(url, false);
    }
  },
  put: async <T>(
    url: string,
    payload: { id: string | number } & unknown,
    requiresAuth = true
  ) => {
    const store = useApiStore.getState();
    const fullUrl = `${url}/${payload.id}`;
    store.setLoading(fullUrl, true);
    store.setError(fullUrl, null);

    try {
      const config = getAuthConfig(requiresAuth);
      const data = await request<T>("PUT", fullUrl, config, payload);
      return data;
    } catch (error) {
      store.setError(fullUrl, error);
      throw error;
    } finally {
      store.setLoading(fullUrl, false);
    }
  },
  delete: async <T>(url: string, id: string | number, requiresAuth = true) => {
    const store = useApiStore.getState();
    const fullUrl = `${url}/${id}`;
    store.setLoading(fullUrl, true);
    store.setError(fullUrl, null);

    try {
      const config = getAuthConfig(requiresAuth);
      const data = await request<T>("DELETE", fullUrl, config);
      return data;
    } catch (error) {
      store.setError(fullUrl, error);
      throw error;
    } finally {
      store.setLoading(fullUrl, false);
    }
  },
}));
