"use client";

import {
  useJurusan,
  useCreateJurusan,
  useDeleteJurusan,
  useUpdateJurusan,
} from "@/hooks/useJurusan";
import {
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
  FilterFn,
} from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Jurusan } from "@/types/jurusan";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { usePaginationStore } from "@/store/paginationStore";
import { TableActions } from "./TableActions";
import { TableSearch } from "../commons/TableSearch";
import { CreateModal } from "../commons/CreateModal";
import { formFields } from "@/forms/formJurusan";

export default function JurusanTable() {
  const { page, perPage, setPage } = usePaginationStore();
  const {
    response: responseData,
    isLoading,
    error,
    refresh,
  } = useJurusan(page, perPage);
  const createMutation = useCreateJurusan();
  const updateMutation = useUpdateJurusan();
  const deleteMutation = useDeleteJurusan();

  const [search, setSearch] = useState("");

  useEffect(() => {
    refresh();
  }, [page, perPage]);

  const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
    const itemValue = row.getValue(columnId) as string;

    if (typeof itemValue !== "string") {
      return String(itemValue).toLowerCase().includes(value.toLowerCase());
    }

    return itemValue.toLowerCase().includes(value.toLowerCase());
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const columns: ColumnDef<Jurusan>[] = [
    {
      accessorKey: "name",
      header: "Name",
      enableGlobalFilter: true,
    },
    {
      accessorKey: "abbreviation",
      header: "Abbreviation",
      enableGlobalFilter: true,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <TableActions<Jurusan>
          row={row.original}
          formFields={formFields}
          title="Jurusan"
          onUpdate={async (data) => {
            await updateMutation.update({ ...data, id: row.original.id });
            refresh();
          }}
          onDelete={async (id) => {
            await deleteMutation.remove(id);
            refresh();
          }}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: responseData?.data.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter: search,
    },
    onGlobalFilterChange: setSearch,
    globalFilterFn: fuzzyFilter,
    pageCount: Math.ceil((responseData?.data.total_data ?? 0) / perPage),
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="text-red-500">
            Error loading data: {error.message}
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => refresh()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPages = Math.ceil((responseData?.data.total_data ?? 0) / perPage);

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <TableSearch value={search} onChange={setSearch} />
          <CreateModal<Jurusan>
            btnTitle="Create Jurusan"
            initialData={{
              name: "",
              abbreviation: "",
            }}
            title="Create Jurusan"
            fields={formFields}
            onSubmit={async (data) => {
              await createMutation.create(data);
              refresh();
            }}
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <Button
                key={index + 1}
                variant={page === index + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
