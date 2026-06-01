"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import * as React from "react";

interface RecentProject {
  id: string;
  name: string;
  type: string;
  description?: string;
  lastOpened: number;
  openCount: number;
  starred: boolean;
}

interface ProjectsReportProps {
  projects: RecentProject[];
  onProjectClick?: (projectId: string) => void;
  onToggleStar?: (projectId: string) => void;
}

export function ProjectsReport({
  projects,
  onProjectClick,
  onToggleStar,
}: ProjectsReportProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<RecentProject>[]>(
    () => [
      {
        id: "star",
        header: "",
        size: 50,
        cell: ({ row }) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar?.(row.original.id);
            }}
            className={`transition-colors ${
              row.original.starred
                ? "text-yellow-500 hover:text-yellow-400"
                : "text-gray-400 hover:text-yellow-500"
            }`}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill={row.original.starred ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          </button>
        ),
      },
      {
        accessorKey: "name",
        header: "Project Name",
        size: 300,
      },
      {
        accessorKey: "type",
        header: "Type",
        size: 120,
        cell: ({ row }) => (
          <span className="uppercase text-xs font-medium text-muted-foreground">
            {row.original.type}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        size: 400,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.description || "—"}
          </span>
        ),
      },
      {
        accessorKey: "openCount",
        header: "Opens",
        size: 100,
        cell: ({ row }) => (
          <span className="text-sm font-medium">{row.original.openCount}</span>
        ),
      },
      {
        accessorKey: "lastOpened",
        header: "Last Opened",
        size: 180,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {new Date(row.original.lastOpened).toLocaleDateString()}
          </span>
        ),
      },
    ],
    [onToggleStar]
  );

  const table = useReactTable({
    columns,
    data: projects,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (projects.length === 0) {
    return (
      <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl p-8 text-center">
        <p className="text-muted-foreground">
          No projects yet. Create your first project above!
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl shadow-lg overflow-hidden"
    >
      <div className="border-b border-border/50 px-6 py-4">
        <h2 className="text-lg font-semibold">All Projects</h2>
        <p className="text-sm text-muted-foreground">
          Total: {projects.length}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                    style={{ width: header.column.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onProjectClick?.(row.original.id)}
                className="border-t border-border/30 hover:bg-muted/20 cursor-pointer transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
