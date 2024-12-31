import { useQuery, useMutation } from "@tanstack/react-query";
import { getCookie, removeCookie } from "@/lib/cookies";

interface RequestConfig {
  headers?: Record<string, string>;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

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

const handleError = (operation: string, error: any) => {
  console.error(`${operation} error:`, error);
  throw error;
};

export const useFetch = <T>(
  queryKey: string[],
  url: string,
  options = {},
  requiresAuth = true
) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const config = getAuthConfig(requiresAuth);
        const data = await request<T>("GET", url, config);
        return data;
      } catch (error) {
        handleError("Fetch", error);
      }
    },
    ...options,
  });
};

export const usePost = <T>(url: string, options = {}, requiresAuth = true) => {
  return useMutation({
    mutationFn: async (payload: unknown) => {
      try {
        const config = getAuthConfig(requiresAuth);
        const data = await request<T>("POST", url, config, payload);
        return data;
      } catch (error) {
        handleError("Post", error);
      }
    },
    ...options,
  });
};

export const usePut = <T>(url: string, options = {}, requiresAuth = true) => {
  return useMutation({
    mutationFn: async (payload: { id: string | number } & unknown) => {
      try {
        const config = getAuthConfig(requiresAuth);
        const data = await request<T>("PUT", `${url}/${payload.id}`, config, payload);
        return data;
      } catch (error) {
        handleError("Put", error);
      }
    },
    ...options,
  });
};

export const useDelete = <T>(
  url: string,
  options = {},
  requiresAuth = true
) => {
  return useMutation({
    mutationFn: async (id: string | number) => {
      try {
        const config = getAuthConfig(requiresAuth);
        const data = await request<T>("DELETE", `${url}/${id}`, config);
        return data;
      } catch (error) {
        handleError("Delete", error);
      }
    },
    ...options,
  });
};
