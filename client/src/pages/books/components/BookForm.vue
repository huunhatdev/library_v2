<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

interface Category {
  _id: string;
  name: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  categories: Category[];
  publishedYear: number;
  quantity: number;
  availableQuantity: number;
}

interface BookResponse {
  success: boolean;
  message: string;
  data: Book;
}

const props = defineProps<{
  open: boolean;
  isEdit?: boolean;
  id?: string;
}>();
const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(1, "Vui lòng nhập tên sách"),
    author: z.string().min(1, "Vui lòng nhập tên tác giả"),
    categories: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một thể loại"),
    publishedYear: z.number().min(1900).max(new Date().getFullYear()),
    quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
  })
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: "",
    author: "",
    categories: [],
    publishedYear: new Date().getFullYear(),
    quantity: 1,
  },
});

const router = useRouter();

const token = localStorage.getItem('token');

const { data } = useQuery({
  queryKey: ['categories'],
  queryFn: async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/category`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert('You are not authorized to access this resource');
        router.push('/login');
      }
      return [];
    }
  },
  enabled: !!token,
  initialData: {
    data: {
      success: false,
      message: '',
      data: []
    }
  }
});

// Add book detail query
const bookQuery = useQuery({
  queryKey: ['book', props.id],
  queryFn: async () => {
    try {
      const response = await axios.get<BookResponse>(`${import.meta.env.VITE_API_URL}/book/${props.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert('You are not authorized to access this resource');
        router.push('/login');
      }
      throw error;
    }
  },
  enabled: !!props.id && props.isEdit && props.open && !!token,
  retry: false,
});

// Watch for changes in book data and update form
watch(
  () => bookQuery.data.value,
  (newData) => {
    if (newData?.data && props.isEdit) {
      const bookData = newData.data;
      form.setValues({
        title: bookData.title,
        author: bookData.author,
        categories: bookData.categories.map(cat => cat._id),
        publishedYear: bookData.publishedYear,
        quantity: bookData.quantity,
      });
    }
  },
  { immediate: true }
);

const queryClient = useQueryClient();

// Update mutation to handle both create and edit
const mutation = useMutation({
  mutationFn: async (values: typeof form.values) => {
    const url = `${import.meta.env.VITE_API_URL}/book${props.id ? `/${props.id}` : ''}`;
    const method = props.id ? 'put' : 'post';
    return axios[method](url, {
      ...values,
      availableQuantity: values.quantity
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  onSuccess: async () => {
    alert(props.isEdit ? 'Cập nhật sách thành công!' : 'Thêm sách thành công!');
    await queryClient.invalidateQueries({ queryKey: ['books'] });
    await router.push('/books');
  },
  onError: (error: any) => {
    alert(error.response?.data?.message || `Đã xảy ra lỗi khi ${props.isEdit ? 'cập nhật' : 'thêm'} sách`);
  }
});

const onSubmit = form.handleSubmit((values) => {
  mutation.mutate(values);
  emit('update:open', false);
});
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ props.isEdit ? 'Sửa sách' : 'Thêm sách' }}</DialogTitle>
      </DialogHeader>
      
      <form @submit="onSubmit" class="flex flex-col gap-4">
        <FormField v-slot="{ componentField }" name="title">
          <FormItem class="flex flex-col items-start gap-2">
            <FormLabel>Tên sách</FormLabel>
            <FormControl>
              <Input
                class="w-full mt-0"
                type="text"
                placeholder="Enter book title"
                v-bind="componentField"
                :value="form.values.title"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="author">
          <FormItem class="flex flex-col items-start gap-2">
            <FormLabel>Tác giả</FormLabel>
            <FormControl>
              <Input
                class="w-full mt-0"
                type="text"
                placeholder="Enter author name"
                v-bind="componentField"
                :value="form.values.author"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="publishedYear">
          <FormItem class="flex flex-col items-start gap-2">
            <FormLabel>Năm xuất bản</FormLabel>
            <FormControl>
              <Input
                class="w-full mt-0"
                type="number"
                min="1900"
                :max="new Date().getFullYear()"
                v-bind="componentField"
                :value="form.values.publishedYear"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="quantity">
          <FormItem class="flex flex-col items-start gap-2">
            <FormLabel>Số lượng</FormLabel>
            <FormControl>
              <Input
                class="w-full mt-0"
                type="number"
                min="1"
                v-bind="componentField"
                :value="form.values.quantity"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="categories">
          <FormItem class="flex flex-col items-start gap-2">
            <FormLabel>Thể loại</FormLabel>
            <FormControl>
              <select
                multiple
                class="w-full mt-0 p-2 border rounded-md"
                v-bind="componentField"
                :value="form.values.categories"
              >
                <option v-for="category in data" :key="category._id" :value="category._id">
                  {{ category.name }}
                </option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit">{{ props.isEdit ? 'Cập nhật' : 'Thêm sách' }}</Button>
      </form>
    </DialogContent>
  </Dialog>
</template>
