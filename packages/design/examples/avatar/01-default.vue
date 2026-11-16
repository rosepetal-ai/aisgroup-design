<!-- A picture when there is one, the initials otherwise. -->
<script setup>
import { Avatar, AvatarFallback } from '@rosepetal/design/ui/avatar';
</script>

<template>
  <Avatar><AvatarFallback>AM</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>JL</AvatarFallback></Avatar>
  <Avatar class="size-8"><AvatarFallback>RS</AvatarFallback></Avatar>
</template>
