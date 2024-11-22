<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from 'vue-router';
import { useMutation, useQueryClient, useQuery } from "@tanstack/vue-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { watch } from 'vue';

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Add this interface before the formSchema
interface CategoryResponse {
  data: {
    name: string;
    description: string;
    id: string;
    // Add other fields if needed
  }
}

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "Vui lòng nhập tên danh mục"),
    description: z.string().min(1, "Vui lòng nhập mô tả"),
  })
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: "",
    description: "",
  },
});

const router = useRouter();
const token = localStorage.getItem('token');

// Add props
const props = defineProps<{
  open: boolean;
  isEdit?: boolean;
  id?: string;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

// Add queryClient
const queryClient = useQueryClient();

// Add query to get category detail
// const categoryQuery = useQuery({
//   queryKey: ['category', props.id],
//   queryFn: async () => {
//     if (!props.id) return null;
//     const response = await axios.get(`${import.meta.env.VITE_API_URL}/category/${props.id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return response.data;
//   },
//   enabled: !!props.id,
// });
const categoryQuery = useQuery({
  queryKey: ['category', props.id],
  queryFn: async () => {
    try {
      const response = await axios.get<CategoryResponse>(`${import.meta.env.VITE_API_URL}/category/${props.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert('Bạn không có quyền truy cập');
        router.push('/login');
      }
      throw error;
    }
  },
  enabled: !!props.id,
  retry: false,
});
watch(
  () => categoryQuery.data.value,
  (newData) => {
    if (newData?.data && props.isEdit) {
      const categoryData = newData.data;
      form.setValues({
        name: categoryData.name,
        description: categoryData.description,
      });
    }
  },
  { immediate: true }
);
// Update form initialization with watch
// watch(categoryQuery.data, (newData) => {
//   if (newData) {
//     form.setValues({
//       name: newData.name,
//       description: newData.description,
//     });
//   }
// });

// Create/Edit mutation
const mutation = useMutation({
  mutationFn: async (values: typeof form.values) => {
    const url = `${import.meta.env.VITE_API_URL}/category${props.isEdit ? `/${props.id}` : ''}`;
    const method = props.isEdit ? 'put' : 'post';
    return axios[method](url, values, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  onSuccess: async () => {
    alert(props.isEdit ? 'Cập nhật danh mục thành công!' : 'Thêm danh mục thành công!');
    await queryClient.invalidateQueries({ queryKey: ['categories'] });
    emit('update:open', false);
    router.push('/categories');
  },
  onError: (error: any) => {
    alert(error.response?.data?.message || `Đã xảy ra lỗi khi ${props.isEdit ? 'cập nhật' : 'thêm'} danh mục`);
  }
});

const onSubmit = form.handleSubmit((values) => {
  mutation.mutate(values);
});
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới' }}</DialogTitle>
      </DialogHeader>

      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem class="flex flex-col items-start gap-2">
            <FormLabel>Tên danh mục</FormLabel>
            <FormControl>
              <Input
                class="w-full mt-0"
                type="text"
                placeholder="Nhập tên danh mục"
                v-bind="componentField"
                :value="form.values.name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem class="flex flex-col items-start gap-2">
            <FormLabel>Mô tả</FormLabel>
            <FormControl>
              <Input
                class="w-full mt-0"
                type="text"
                placeholder="Nhập mô tả"
                v-bind="componentField"
                :value="form.values.description"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit">{{ isEdit ? 'Cập nhật' : 'Thêm danh mục' }}</Button>
      </form>
    </DialogContent>
  </Dialog>
</template>
