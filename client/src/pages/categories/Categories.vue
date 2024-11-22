<script setup lang="ts">
import type { ColumnDef, ColumnFiltersState, VisibilityState, SortingState } from '@tanstack/vue-table'
import { ref } from 'vue'
import axios from "axios";
import { useQuery } from "@tanstack/vue-query";
import { h } from 'vue'
import { ArrowUpDown } from 'lucide-vue-next'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import CategoriesForm from './components/CategoriesForm.vue'
import DropdownAction from './components/DropdownAction.vue';
import { useAuthStore } from '../auth/auth';

const { data, isLoading } = useQuery({
  queryKey: ['categories'],
  queryFn: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/category`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  },
  initialData: []
});

const columns: ColumnDef<any>[] = [
  {
    id: 'index',
    header: () => h('div', { class: 'text-center' }, 'Số thứ tự'),
    cell: ({ row }) => h('div', { class: 'text-center' }, (row.index + 1).toString()),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Thể loại',
    enableColumnFilter: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original
      if (authStore.getUserInfo?.role?.name !== 'admin') {
        return null
      }

      return h('div', { class: 'relative' }, [
        h(DropdownAction, {
          category,
          onExpand: row.toggleExpanded,
        })
      ])
    },
  },
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const isEditModalOpen = ref(false)

const table = useVueTable({
  get data() { return data.value || [] },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
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

const handleSearch = (value: string) => {
  table.getColumn('name')?.setFilterValue(value)
}

const authStore = useAuthStore()
</script>

<template>
  <div class="w-full">
    <div class="flex gap-2 items-center py-4">
      <div class="flex items-center gap-2 justify-center w-full">
        <h1 class="text-2xl font-bold text-center">Thể loại</h1>
      </div>
      <div class="flex items-center gap-2">
        <Input
        class="max-w-52"
        placeholder="Tìm kiếm thể loại..."
        :model-value="table.getColumn('name')?.getFilterValue() as string"
        @update:model-value="table.getColumn('name')?.setFilterValue($event)"
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
            <TableRow 
              v-for="row in table.getRowModel().rows" 
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <TableRow v-else>
            <TableCell
              :colspan="columns.length"
              class="h-24 text-center"
            >
              Không có dữ liệu.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <CategoriesForm
      :open="isEditModalOpen"
      :is-edit="false"
      @update:open="isEditModalOpen = false"
      aria-describedby="category-form-description"
    />
  </div>
</template>
