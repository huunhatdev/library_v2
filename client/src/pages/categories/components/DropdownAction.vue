<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-vue-next'
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import axios from 'axios';
import CategoriesForm from '@/pages/categories/components/CategoriesForm.vue'
import { ref } from 'vue'

const props = defineProps<{
  category: any
}>()

const emit = defineEmits<{
  expand: []
  close: []
  select: [any]
}>()

const isEditModalOpen = ref(false)
const handleEdit = () => {
  isEditModalOpen.value = true
  emit('select', props.category)
}

const token = localStorage.getItem('token');

const queryClient = useQueryClient()

const deleteMutation = useMutation({
  mutationFn: async () => {
    return axios.delete(`${import.meta.env.VITE_API_URL}/category/${props.category._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['categories'] })
    emit('close')
  }
})

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this category?')) {
    deleteMutation.mutate()
  }
}
</script>

<template>
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" class="h-8 w-8 p-0">
          <span class="sr-only">Mở menu</span>
          <MoreHorizontal class="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="handleEdit">
          Sửa
        </DropdownMenuItem>
        <DropdownMenuItem @click="handleDelete">
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <CategoriesForm
      v-if="isEditModalOpen"
      @close="isEditModalOpen = false"
      :open="isEditModalOpen"
      :is-edit="true"
      :id="props.category._id"
      @select="emit('select', $event)"
      @update:open="isEditModalOpen = false"
    />
  </div>
</template>
