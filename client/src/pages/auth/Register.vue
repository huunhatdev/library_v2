<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from 'vue-router';

// Add interface for API response
interface Role {
  _id: string;
  name: string;
  permissions: any[]; // You can make this more specific based on your permissions structure
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(5).max(50),
    email: z.string().email(),
    password: z.string().min(5),
    confirmPassword: z.string().min(5),
    fullName: z.string().min(5)
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  })
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: ""
  },
});

const router = useRouter();

const onSubmit = form.handleSubmit(async (values) => {
  try {
    const response = await axios.post<RegisterResponse>(
      `${import.meta.env.VITE_API_URL}/auth/register`, 
      {
        username: values.username,
        email: values.email,
        password: values.password,
        fullName: values.fullName
      }
    );

    if (response.data.success || response.status === 200) {
      alert('Đăng ký thành công!');
      await router.push('/login');
    } else {
      alert(response.data.message || 'Đăng ký không thành công');
    }
  } catch (error: any) {
    alert(error.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký');
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <form @submit="onSubmit" class="flex flex-col gap-4 w-full max-w-md">
      <FormField v-slot="{ componentField }" name="username">
        <FormItem class="flex flex-col items-start gap-2">
          <FormLabel>Tên đăng nhập</FormLabel>
          <FormControl>
            <Input
              class="w-full mt-0"
              type="text"
              placeholder="Tên đăng nhập"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="fullName">
        <FormItem class="flex flex-col items-start gap-2">
          <FormLabel>Họ tên</FormLabel>
          <FormControl>
            <Input
              class="w-full mt-0"
              type="text"
              placeholder="Họ tên"
              v-bind="componentField"
            />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="email">
        <FormItem class="flex flex-col items-start gap-2">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              class="w-full mt-0"
              type="email"
              placeholder="Email"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="password">
        <FormItem class="flex flex-col items-start gap-2">
          <FormLabel>Mật khẩu</FormLabel>
          <FormControl>
            <Input
              class="w-full mt-0"
              type="password"
              placeholder="Mật khẩu"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="confirmPassword">
        <FormItem class="flex flex-col items-start gap-2">
          <FormLabel>Xác nhận mật khẩu</FormLabel>
          <FormControl>
            <Input
              class="w-full mt-0"
              type="password"
              placeholder="Xác nhận mật khẩu"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit">Đăng ký</Button>
    </form>
  </div>
</template>
