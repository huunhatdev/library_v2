<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Sun, Moon, Bell, Package2, Book, LayoutGrid, User, Users } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import UserNav from "@/layout/UserNav.vue";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from '@/pages/auth/auth';

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark');
};

const authStore = useAuthStore()

const navigationItems = [
  { path: '/books', icon: Book, label: 'Sách' },
  { path: '/categories', icon: LayoutGrid, label: 'Thể loại', adminOnly: true },
  { path: '/profile', icon: User, label: 'Thông tin cá nhân' },
  { path: '/customers', icon: Users, label: 'Thành viên', adminOnly: true },
];

onMounted(() => {
  if (!isDark.value) {
    document.documentElement.classList.remove('dark');
  }
});
</script>

<template>
  <div class="min-h-screen w-full flex bg-background dark:bg-slate-900">
    <aside class="hidden md:flex md:w-[auto] lg:w-[auto] border-r border-slate-200 dark:border-slate-700 bg-muted/40 dark:bg-slate-800 flex-col">
      <div class="h-14 lg:h-[60px] border-b border-slate-200 dark:border-slate-700 px-4 lg:px-6 flex items-center justify-between">
        <router-link to="/books" class="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <Package2 class="h-6 w-6" />
        </router-link>
      </div>

      <nav class="flex-1 px-2 lg:px-4 py-4">
        <ul class="space-y-1">
          <li v-for="item in navigationItems" :key="item.path">
            <router-link
              v-if="!item.adminOnly || authStore.getUserInfo?.role?.name === 'admin'"
              :to="item.path"
              :title="item.label"
              class="flex items-center justify-center gap-3 rounded-lg py-2 text-slate-600 dark:text-slate-300 transition-all hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
              active-class="bg-muted text-primary"
            >
            <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <a
                  href="#"
                  class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <component :is="item.icon" class="h-5 w-5" />
                  <span class="sr-only">{{ item.label }}</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="right" class="z-50">
                  {{ item.label }}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="flex-1 flex flex-col">
      <header class="h-14 lg:h-[60px] border-b bg-muted/40 px-4 lg:px-6 flex items-center justify-end">
        <div class="flex gap-2">
          <Button variant="outline" size="icon" class="h-8 w-8 dark:border-slate-700 dark:hover:bg-slate-700" @click="toggleTheme">
            <Sun v-if="isDark" class="h-4 w-4 text-yellow-500" />
            <Moon v-else class="h-4 w-4 text-slate-400" />
          </Button>
          <UserNav />
        </div>
      </header>
      
      <div class="flex-1 p-4 overflow-auto">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
