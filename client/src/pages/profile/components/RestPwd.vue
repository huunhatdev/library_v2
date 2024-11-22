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
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useRouter } from 'vue-router'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const formSchema = toTypedSchema(
  z.object({
    oldPassword: z.string().min(2, 'Mật khẩu cũ phải có ít nhất 2 ký tự'),
    newPassword: z.string().min(2, 'Mật khẩu mới phải có ít nhất 2 ký tự'),
    confirmPassword: z.string().min(2, 'Mật khẩu xác nhận phải có ít nhất 2 ký tự'),
  })
)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
})

const showResetModal = defineModel('open', { type: Boolean, required: true })
const token = localStorage.getItem('token')
const showAlert = ref(false)
const showLogoutConfirm = ref(false)

const router = useRouter()

const handlePasswordReset = async (values: any) => {
  if (values.newPassword !== values.confirmPassword) {
    showAlert.value = true
    return
  }
  
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/profile/change-password`, {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    showLogoutConfirm.value = true
    showAlert.value = false
  } catch (error) {
    console.error(error)
    showAlert.value = true
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const handleClose = () => {
  showResetModal.value = false
  showLogoutConfirm.value = false
}

</script>

<template>
  <div class="space-y-8">

    <Dialog v-model:open="showResetModal">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
        </DialogHeader>
        
        <Form @submit="handlePasswordReset">
          <div class="space-y-6">
            <div v-if="showAlert" class="text-sm text-red-500">
              Mật khẩu không khớp hoặc có lỗi xảy ra. Vui lòng thử lại.
            </div>
            
            <FormField v-slot="{ field }" name="oldPassword">
              <FormItem>
                <FormLabel>Mật khẩu cũ</FormLabel>
                <FormControl>
                  <Input v-bind="field" type="password" placeholder="Nhập mật khẩu cũ" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field }" name="newPassword">
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <FormControl>
                  <Input v-bind="field" type="password" placeholder="Nhập mật khẩu mới" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ field }" name="confirmPassword">
              <FormItem>
                <FormLabel>Mật khẩu xác nhận</FormLabel>
                <FormControl>
                  <Input v-bind="field" type="password" placeholder="Nhập mật khẩu xác nhận" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <DialogFooter>
              <Button type="submit">Đổi mật khẩu</Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>

    <AlertDialog v-model:open="showLogoutConfirm">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mật khẩu đã được cập nhật</AlertDialogTitle>
          <AlertDialogDescription>
            Mật khẩu đã được cập nhật. Bạn có muốn đăng xuất ngay không?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction @click="handleLogout">Đăng xuất</AlertDialogAction>
          <AlertDialogCancel @click="handleClose">Không, Đăng nhập</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>