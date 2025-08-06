

"use client";

import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Import Button for action icons
import { Pencil, Trash2 } from 'lucide-react'; // Import Lucide icons for actions
import { format } from 'date-fns';

import { Todo } from '@/types';

interface TodoListTableProps {
  data: Todo[];
  title?: string;
  // Add props for action handlers
  onUpdate?: (todoId: number) => void;
  onDelete?: (todoId: number) => void;
}

const columns: ColumnDef<Todo>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Task",
    cell: ({ row }) => {
      const todo = row.original;
      return (
        <div className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
          {todo.title}
        </div>
      );
    },
  },
  {
    accessorKey: "todoList.title", // Access the title nested under todoList
    header: "List Category",
    cell: ({ row }) => {
      const todoListTitle = row.original.todoList?.title; // Safely access nested property
      return todoListTitle || "No List"; // Display title or "No List" if undefined
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as Todo['priority'];
      let variant: "default" | "secondary" | "destructive" | "outline" = "default";
      let colorClass = "";

      switch (priority) {
        case "URGENT":
          variant = "destructive";
          colorClass = "bg-red-500 hover:bg-red-600";
          break;
        case "HIGH":
          variant = "default";
          colorClass = "bg-yellow-500 hover:bg-yellow-600";
          break;
        case "MEDIUM":
          variant = "secondary";
          colorClass = "bg-blue-500 hover:bg-blue-600";
          break;
        case "LOW":
          variant = "outline";
          colorClass = "text-green-700 border-green-500";
          break;
      }

      return (
        <Badge variant={variant} className={`${colorClass} rounded-full px-2 py-1 text-xs`}>
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as Date | null;
      if (!dueDate) return "N/A";
      return format(new Date(dueDate), 'MMM dd, yyyy');
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Todo['status'];
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
      let colorClass = "";

      switch (status) {
        case "Completed":
          variant = "default";
          colorClass = "bg-green-500 hover:bg-green-600 text-white";
          break;
        case "Overdue":
          variant = "destructive";
          colorClass = "bg-red-700 hover:bg-red-800 text-white";
          break;
        case "Today":
          variant = "secondary";
          colorClass = "bg-orange-500 hover:bg-orange-600 text-white";
          break;
        case "Upcoming":
          variant = "outline";
          colorClass = "border-blue-500 text-blue-700";
          break;
        case "Pending":
        default:
          variant = "outline";
          colorClass = "border-gray-400 text-gray-700";
          break;
      }

      return (
        <Badge variant={variant} className={`${colorClass} rounded-full px-2 py-1 text-xs`}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions", // Unique ID for the actions column
    header: "Actions",
    cell: ({ row, table }) => {
      const todo = row.original;
      const { onUpdate, onDelete } = table.options.meta as {
        onUpdate?: (id: number) => void;
        onDelete?: (id: number) => void;
      };

      return (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-500 hover:text-blue-600"
            onClick={() => onUpdate && onUpdate(todo.id)}
            title="Update Task"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Update</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600"
            onClick={() => onDelete && onDelete(todo.id)}
            title="Delete Task"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

const TodoListTable: React.FC<TodoListTableProps> = ({ data, title, onUpdate, onDelete }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Pass action handlers via table meta for access in cell rendering
    meta: {
      onUpdate,
      onDelete,
    },
  });

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TodoListTable;
