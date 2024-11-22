<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from 'vue-router';

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/pages/auth/auth";

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(3),
  })
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    username: "",
    password: "",
  },
});

const router = useRouter();
const authStore = useAuthStore();
const onSubmit = form.handleSubmit(async (values) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/login`, 
      {
        username: values.username,
        password: values.password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      const token = response.data.data.token;
      localStorage.setItem('token', token);
      authStore.setToken(token);

      // Gọi API profile và cập nhật store
      try {
        const profileResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        localStorage.setItem('userInfo', JSON.stringify(profileResponse.data.data));
        authStore.setUserInfo(profileResponse.data.data);
      } catch (profileError) {
        console.error('Failed to fetch profile:', profileError);
      }

      router.push({ name: 'Books' });
    }
  } catch (error: any) {
    console.error('Login failed:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <form @submit="onSubmit" class="flex flex-col gap-4 w-full max-w-md">
      <FormField v-slot="{ componentField }" name="username">
        <FormItem class="flex flex-col items-start gap-2">
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input
              class="w-full mt-0"
              type="text"
              placeholder="username"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="password">
        <FormItem class="flex flex-col items-start gap-2">
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input
              class="w-full mt-0"
              type="password"
              placeholder="password"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="submit"> Login </Button>
      <Button type="button" @click="router.push({ name: 'Register' })"> Register </Button>
    </form>
  </div>
</template>
