<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import axios from 'axios'
import RestPwd from './components/RestPwd.vue'
import { useAuthStore } from '../auth/auth'
const formSchema = toTypedSchema(
  z.object({
    fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
  })
)
const token = localStorage.getItem('token')


const isEditing = ref(false)
const authStore = useAuthStore()
const userInfo = ref(authStore.getUserInfo || {})
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    fullName: userInfo.value?.fullName || '',
    email: userInfo.value?.email || '',
  },
})

interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const queryClient = useQueryClient()
const mutation = useMutation({
  mutationFn: async (values: typeof form.values) => {
    const url = `${import.meta.env.VITE_API_URL}/profile`;
    return axios.put(url, {
      ...values,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  onSuccess: async () => {
    alert('Cập nhật thông tin thành công!');
    isEditing.value = false
    await queryClient.invalidateQueries({ queryKey: ['profile'] });
  },
  onError: (error: any) => {
    alert(error.response?.data?.message || `Đã xảy ra lỗi khi cập nhật thông tin`);
  }
});

const onSubmit = form.handleSubmit((values) => {
  mutation.mutate(values);
});

const showResetPasswordModal = ref(false)

const handlePasswordReset = () => {
  showResetPasswordModal.value = true
}

</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center gap-2 justify-center w-full">
      <h1 class="text-2xl font-bold">Thông tin cá nhân</h1>
    </div>

    <form @submit="onSubmit" class="space-y-6">
      <FormField v-slot="{ field }" name="fullName">
        <FormItem>
          <FormLabel>Họ và tên</FormLabel>
          <FormControl>
            <Input v-bind="field" v-model="form.values.fullName" placeholder="Nhập họ và tên" :disabled="!isEditing" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input v-bind="field" v-model="form.values.email" type="email" placeholder="Select an email" :disabled="!isEditing" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="flex items-center justify-center space-x-2">
        <Button type="submit" v-if="isEditing">Lưu thay đổi</Button>
        <Button type="button" v-else @click="isEditing = true">Cập nhật thông tin</Button>
        <Button type="button" @click="handlePasswordReset">Đổi mật khẩu</Button>
      </div>
    </form>

    <RestPwd v-if="showResetPasswordModal" v-model:open="showResetPasswordModal" @handlePasswordReset="handlePasswordReset" />
  </div>
</template>