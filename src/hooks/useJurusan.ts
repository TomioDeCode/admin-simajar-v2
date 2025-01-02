import { useApiStore } from "@/store/useApiStore";
import { PaginatedResponse } from "@/types/PaginatedResponse";
import { Jurusan } from "@/types/jurusan";
import { useEffect } from "react";

export const useJurusan = (page: number, perPage: number) => {
  const { fetch, loading, error, data } = useApiStore();
  const url = `/majors?perPage=${perPage}&page=${page}`;

  useEffect(() => {
    fetch<PaginatedResponse<Jurusan>>(url, true);
  }, [page, perPage]);

  return {
    response: data[url] as PaginatedResponse<Jurusan> | undefined,
    isLoading: loading[url] ?? false,
    error: error[url],
    refresh: () => fetch<PaginatedResponse<Jurusan>>(url, true),
  };
};

interface JurusanInput {
  name: string;
  abbreviation: string;
}

export const useCreateJurusan = () => {
  const { post, loading, error } = useApiStore();
  const url = "/majors";

  const create = (data: Partial<JurusanInput>) => {
    const payload = {
      name: data.name,
      abbreviation: data.abbreviation,
    };

    return post<Jurusan>(url, payload);
  };

  return {
    create,
    isLoading: loading[url] ?? false,
    error: error[url],
  };
};

export const useUpdateJurusan = () => {
  const { put, loading, error } = useApiStore();
  const url = "/majors";

  const update = (data: Partial<Jurusan> & { id: string | number }) => {
    const payload = {
      ...data,
      name: data.name,
      abbreviation: data.abbreviation,
    };

    return put<Jurusan>(url, payload);
  };

  return {
    update,
    isLoading: loading[url] ?? false,
    error: error[url],
  };
};

export const useDeleteJurusan = () => {
  const { delete: destroy, loading, error } = useApiStore();
  const url = "/majors";

  return {
    remove: (id: string | number) => destroy<void>(url, id),
    isLoading: loading[url] ?? false,
    error: error[url],
  };
};
