<!-- Links, some grouped in a dropdown. -->
<script setup>
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@aisgroup/design/ui/navigation-menu';
</script>

<template>
  <NavigationMenu :viewport="false">
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Information</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="flex w-48 flex-col">
            <li><NavigationMenuLink as="button" class="w-full text-left" active>Dashboard</NavigationMenuLink></li>
            <li><NavigationMenuLink as="button" class="w-full text-left">Metrics</NavigationMenuLink></li>
            <li><NavigationMenuLink as="button" class="w-full text-left">Logs</NavigationMenuLink></li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink as="button">Settings</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
