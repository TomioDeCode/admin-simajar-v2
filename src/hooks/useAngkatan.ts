import { useApiStore } from "@/store/useApiStore";
import { Angkatan } from "@/types/angkatan";
import { PaginatedResponse } from "@/types/PaginatedResponse";
import { useEffect } from "react";

export const useAngkatan = (page: number, perPage: number) => {
  const { fetch, loading, error, data } = useApiStore();
  const url = `/generations?perPage=${perPage}&page=${page}`;

  useEffect(() => {
    fetch<PaginatedResponse<Angkatan>>(url, true);
  }, [page, perPage]);

  return {
    response: data[url] as PaginatedResponse<Angkatan> | undefined,
    isLoading: loading[url] ?? false,
    error: error[url],
    refresh: () => fetch<PaginatedResponse<Angkatan>>(url, true),
  };
};

export const useCreateAngkatan = () => {
  const { post, loading, error } = useApiStore();
  const url = "/generations";

  return {
    create: (data: Partial<Angkatan>) => post<Angkatan>(url, data),
    isLoading: loading[url] ?? false,
    error: error[url],
  };
};

export const useUpdateAngkatan = () => {
  const { put, loading, error } = useApiStore();
  const url = "/generations";

  return {
    update: (data: Partial<Angkatan> & { id: string | number }) =>
      put<Angkatan>(url, data),
    isLoading: loading[url] ?? false,
    error: error[url],
  };
};

export const useDeleteAngkatan = () => {
  const { delete: destroy, loading, error } = useApiStore();
  const url = "/generations";

  return {
    remove: (id: string | number) => destroy<void>(url, id),
    isLoading: loading[url] ?? false,
    error: error[url],
  };
};
