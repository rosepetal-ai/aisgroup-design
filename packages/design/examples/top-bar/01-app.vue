<!-- The main bar of an app: the logo by default, its links and its actions. -->
<script setup>
import { HomeIcon, MoonIcon, SettingsIcon } from '@lucide/vue';
import { ref } from 'vue';
import TopBar from '@rosepetal/design/blocks/TopBar.vue';
import { Avatar, AvatarFallback } from '@rosepetal/design/ui/avatar';
import { Button } from '@rosepetal/design/ui/button';

const current = ref('home');
</script>

<template>
  <div class="w-full">
    <TopBar>
      <nav class="flex h-full items-center gap-1" aria-label="Main menu">
        <Button variant="topbar-tab" :aria-current="current === 'home' ? 'page' : undefined" @click="current = 'home'"><HomeIcon />Home</Button>
        <Button variant="topbar-tab" :aria-current="current === 'settings' ? 'page' : undefined" @click="current = 'settings'"><SettingsIcon />Settings</Button>
      </nav>
      <template #actions>
        <Button variant="topbar" size="icon-round" aria-label="Dark mode"><MoonIcon /></Button>
        <Button variant="topbar" size="icon-round" aria-label="Account">
          <Avatar class="size-8"><AvatarFallback class="bg-topbar-foreground text-xs font-semibold text-brand">SB</AvatarFallback></Avatar>
        </Button>
      </template>
    </TopBar>
  </div>
</template>
