<!-- The texts come from each app, already translated. Checking the password is the app's job: it listens to submit. The language and theme controls and the legal line go in their slots, as in Rosepetal's login. -->
<script setup>
import { LanguagesIcon, MoonIcon, SunIcon } from '@lucide/vue';
import { ref } from 'vue';
import LoginPage from '@aisgroup/design/blocks/LoginPage.vue';
import { Button } from '@aisgroup/design/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@aisgroup/design/ui/dropdown-menu';

const email = ref('');
const password = ref('');
const loading = ref(false);
const locale = ref('es');
const dark = ref(document.documentElement.classList.contains('dark'));
function login() {
  loading.value = true;
  setTimeout(() => (loading.value = false), 1500);
}
function toggleTheme() {
  dark.value = document.documentElement.classList.toggle('dark');
}
</script>

<template>
  <div class="w-full overflow-hidden rounded-md border">
    <LoginPage v-model:email="email" v-model:password="password" class="min-h-160!" :loading="loading" @submit="login">
      <template #controls>
        <DropdownMenu :modal="false">
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="sm" aria-label="Language"><LanguagesIcon data-icon="inline-start" />{{ locale.toUpperCase() }}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-36">
            <DropdownMenuRadioGroup v-model="locale">
              <DropdownMenuRadioItem value="es">Español</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon-sm" :aria-label="dark ? 'Light mode' : 'Dark mode'" @click="toggleTheme">
          <SunIcon v-if="dark" />
          <MoonIcon v-else />
        </Button>
      </template>
      <template #legal>
        By login, I accept the
        <Button as-child variant="link" size="inline"><a href="#">Terms of Service</a></Button>
        and the
        <Button as-child variant="link" size="inline"><a href="#">Privacy Policy</a></Button>.
      </template>
    </LoginPage>
  </div>
</template>
