<!-- Right-click or long press opens the actions of an object. Keep them on a visible button too: never only here. -->
<script setup>
import { DownloadIcon, ExpandIcon, TagIcon, Trash2Icon } from '@lucide/vue';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@aisgroup/design/ui/context-menu';
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger class="flex h-40 w-72 items-center justify-center rounded-lg border border-dashed text-muted-foreground">Right-click this image</ContextMenuTrigger>
    <ContextMenuContent class="w-52">
      <ContextMenuItem><ExpandIcon />Open</ContextMenuItem>
      <ContextMenuItem><TagIcon />Change tag</ContextMenuItem>
      <ContextMenuItem><DownloadIcon />Download</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive"><Trash2Icon />Delete image</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
