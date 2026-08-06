"use client";

import { useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { VehicleStatus } from "@prisma/client";
import { VehicleStatusBadge } from "@/components/vehicles/status-badge";

export type VehicleListItem = {
  id: string;
  stockNumber: string | null;
  vin: string | null;
  make: string;
  model: string;
  year: number;
  status: VehicleStatus;
  listPrice: string | null;
  mileage: number | null;
  updatedAt: string;
};

const columns: ColumnDef<VehicleListItem>[] = [
  {
    header: "Stock #",
    accessorKey: "stockNumber",
    cell: ({ getValue }) => (getValue<string | null>() ?? "—")
  },
  {
    header: "Vehicle",
    id: "vehicle",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">
        {row.original.year} {row.original.make} {row.original.model}
      </span>
    )
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => <VehicleStatusBadge status={getValue<VehicleStatus>()} />
  },
  {
    header: "Mileage",
    accessorKey: "mileage",
    cell: ({ getValue }) => {
      const v = getValue<number | null>();
      return v === null ? "—" : `${v.toLocaleString()} mi`;
    }
  },
  {
    header: "List Price",
    accessorKey: "listPrice",
    cell: ({ getValue }) => {
      const v = getValue<string | null>();
      return v === null ? "—" : `$${Number(v).toLocaleString()}`;
    }
  },
  {
    header: "Updated",
    accessorKey: "updatedAt",
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString()
  }
];

export function VehicleTable({ data }: { data: VehicleListItem[] }) {
  const router = useRouter();
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center text-sm text-gray-500">
        No vehicles found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 font-medium text-gray-500">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => router.push(`/vehicles/${row.original.id}`)}
              className="cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
