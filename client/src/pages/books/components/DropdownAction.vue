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
import BookForm from '@/pages/books/components/BookForm.vue'
import { ref } from 'vue'

const props = defineProps<{
  book: any
}>()

const emit = defineEmits<{
  expand: []
  close: []
  select: [any]
  reload: []
}>()

const isEditModalOpenBook = ref(false)

const handleEdit = () => {
  isEditModalOpenBook.value = true
  emit('select', props.book)
}

const token = localStorage.getItem('token');

const queryClient = useQueryClient();

const deleteMutation = useMutation({
  mutationFn: async () => {
    return axios.delete(`${import.meta.env.VITE_API_URL}/book/${props.book._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['books'] });
    emit('close');
  },
  onError: (error) => {
    console.error('Error deleting book:', error);
    alert('Có lỗi xảy ra khi xóa sách');
  }
})

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this book?')) {
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

    <BookForm
      v-if="isEditModalOpenBook"
      @close="isEditModalOpenBook = false"
      :open="isEditModalOpenBook"
      :is-edit="true"
      :id="props.book._id"
      @select="emit('select', $event)"
      @update:open="isEditModalOpenBook = false"
    />
  </div>
</template>
