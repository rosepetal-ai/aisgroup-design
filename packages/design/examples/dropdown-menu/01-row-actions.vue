<!-- Row actions sit behind a ghost more button, each with a name; the destructive one last. -->
<script setup>
import { CopyIcon, EllipsisIcon, PencilIcon, Trash2Icon } from '@lucide/vue';
import { Button } from '@aisgroup/design/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@aisgroup/design/ui/dropdown-menu';
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child><Button variant="ghost" size="icon-sm" aria-label="Actions for PCB inspection"><EllipsisIcon /></Button></DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem><PencilIcon />Rename</DropdownMenuItem>
      <DropdownMenuItem><CopyIcon />Duplicate</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive"><Trash2Icon />Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
