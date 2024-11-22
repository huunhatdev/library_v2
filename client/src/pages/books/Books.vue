<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'
import { h, ref } from 'vue'
import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'
import DropdownAction from './components/DropdownAction.vue'
import BookForm from './components/BookForm.vue'
import { useAuthStore } from '../auth/auth'

export interface Book {
  _id: string
  title: string
  author: string
  publishedYear: number
  quantity: number
  categories: string[]
}
const authStore = useAuthStore()

const { data, isLoading } = useQuery({
  queryKey: ['books'],
  queryFn: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/book`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  },
  initialData: []
});

const columns: ColumnDef<Book>[] = [
  {
    id: 'index',
    header: () => h('div', { class: 'text-center' }, 'Số thứ tự'),
    cell: ({ row }) => h('div', { class: 'text-center' }, (row.index + 1).toString()),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: 'Tên sách',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'quantity',
    header: 'Số lượng',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const book = row.original
      
      if (authStore.getUserInfo?.role?.name !== 'admin') {
        return null
      }
      
      return h('div', { class: 'text-center' }, h(DropdownAction, {
        book,
        onExpand: row.toggleExpanded,
      }))
    },
  },
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  get data() { return data.value || [] },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    get expanded() { return expanded.value },
  },
  filterFns: {
    fuzzy: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (!value) return false
      return value.toString().toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  onColumnFiltersChange: (updater) => {
    columnFilters.value = typeof updater === 'function' ? updater(columnFilters.value) : updater
  },
})

const isEditModalOpenBook = ref(false);

</script>

<template>
  <div class="w-full">
    <div class="flex gap-2 items-center py-4 justify-between">
      
      <div class="flex items-center gap-2 justify-center w-full">
        <h1 class="text-2xl font-bold text-center">Sách</h1>
      </div>
      <div class="flex items-center gap-2">
        <Input
        class="max-w-52"
        placeholder="Tìm kiếm sách..."
        :model-value="table.getColumn('title')?.getFilterValue() as string"
        @update:model-value="table.getColumn('title')?.setFilterValue($event)"
      />
      <Button v-if="authStore.getUserInfo?.role?.name === 'admin'" @click="isEditModalOpenBook = true">
        Tạo mới
      </Button>
      </div>
      
    </div>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell
              :colspan="columns.length"
              class="h-24 text-center"
            >
              Không tìm thấy kết quả.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <BookForm
      :open="isEditModalOpenBook"
      :is-edit="false"
      @update:open="isEditModalOpenBook = false"
    />
  </div>
</template>