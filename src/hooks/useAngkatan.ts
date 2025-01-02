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

interface AngkatanInput {
  number: number;
  start_date: Date | string;
  end_date: Date | string;
}

export const useCreateAngkatan = () => {
  const { post, loading, error } = useApiStore();
  const url = "/generations";

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    return dateObj.toISOString().replace("Z", "+02:00");
  };

  const create = (data: Partial<AngkatanInput>) => {
    const payload = {
      number: data.number ? Number(data.number) : undefined,
      start_date: data.start_date ? formatDate(data.start_date) : undefined,
      end_date: data.end_date ? formatDate(data.end_date) : undefined,
    };

    return post<Angkatan>(url, payload);
  };

  return {
    create,
    isLoading: loading[url] ?? false,
    error: error[url],
  };
};

export const useUpdateAngkatan = () => {
  const { put, loading, error } = useApiStore();
  const url = "/generations";

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    return dateObj.toISOString().replace("Z", "+02:00");
  };

  const update = (data: Partial<Angkatan> & { id: string | number }) => {
    const payload = {
      ...data,
      number: data.number ? Number(data.number) : undefined,
      start_date: data.start_date ? formatDate(data.start_date) : undefined,
      end_date: data.end_date ? formatDate(data.end_date) : undefined,
    };

    return put<Angkatan>(url, payload);
  };

  return {
    update,
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
