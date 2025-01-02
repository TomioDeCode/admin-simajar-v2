"use client";

import {
  useAngkatan,
  useCreateAngkatan,
  useDeleteAngkatan,
  useUpdateAngkatan,
} from "@/hooks/useAngkatan";
import {
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
  FilterFn,
} from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Angkatan } from "@/types/angkatan";
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
import { formFields } from "@/forms/formAngkatan";

export default function GenerationsTable() {
  const { page, perPage, setPage } = usePaginationStore();
  const {
    response: responseData,
    isLoading,
    error,
    refresh,
  } = useAngkatan(page, perPage);
  const createMutation = useCreateAngkatan();
  const updateMutation = useUpdateAngkatan();
  const deleteMutation = useDeleteAngkatan();

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

  const columns: ColumnDef<Angkatan>[] = [
    {
      accessorKey: "number",
      header: "Number",
      enableGlobalFilter: true,
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      enableGlobalFilter: true,
      cell: ({ getValue }) =>
        new Date(getValue() as string).toLocaleDateString(),
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      enableGlobalFilter: true,
      cell: ({ getValue }) =>
        new Date(getValue() as string).toLocaleDateString(),
    },
    {
      accessorKey: "is_graduated",
      header: "Graduated",
      enableGlobalFilter: true,
      cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <TableActions
          row={row.original}
          onUpdate={async (data) => {
            await updateMutation.update(data);
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
          <CreateModal<Angkatan>
            btnTitle="Create Angkatan"
            initialData={{
              number: undefined,
              start_date: "",
              end_date: "",
              is_graduated: false,
            }}
            title="Create Angkatan"
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
