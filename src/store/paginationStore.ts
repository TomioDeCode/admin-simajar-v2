import { create } from "zustand";

interface PaginationState {
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
}

export const usePaginationStore = create<PaginationState>((set) => ({
  page: 1,
  perPage: 5,
  setPage: (page) => set({ page }),
  setPerPage: (perPage) => set({ perPage }),
}));
