<!-- Software the whole group uses: the app mark, the white Λ at 24 px, and the app's name in the link home. The mark is decorative there (alt=""), so the link is named by what people read. Nothing follows the name, so there is no separator. -->
<script setup>
import { MoonIcon } from '@lucide/vue';
import BrandLogo from '@aisgroup/design/blocks/BrandLogo.vue';
import TopBar from '@aisgroup/design/blocks/TopBar.vue';
import { Avatar, AvatarFallback } from '@aisgroup/design/ui/avatar';
import { Button } from '@aisgroup/design/ui/button';
</script>

<template>
  <div class="w-full">
    <TopBar full>
      <template #logo>
        <a href="#" class="flex h-full min-w-0 items-center gap-2">
          <BrandLogo brand="ais" alt="" />
          <span class="truncate text-base leading-5 font-semibold">Nexus ERP</span>
        </a>
      </template>
      <template #actions>
        <Button variant="topbar" size="icon-round" aria-label="Dark mode"><MoonIcon /></Button>
        <Button variant="topbar" size="icon-round" aria-label="Account">
          <Avatar class="size-8 after:hidden"><AvatarFallback class="bg-topbar-foreground text-sm font-semibold text-brand">SB</AvatarFallback></Avatar>
        </Button>
      </template>
    </TopBar>
  </div>
</template>
