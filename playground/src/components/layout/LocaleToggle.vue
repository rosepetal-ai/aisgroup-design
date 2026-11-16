<script setup lang="ts">
import type { Locale } from '@/i18n'
import { CheckIcon, LanguagesIcon } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { setLocale } from '@/i18n'

const { locale, t } = useI18n()
const options: { value: Locale, label: string }[] = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
]
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="sm" :aria-label="t('Language')">
        <LanguagesIcon data-icon="inline-start" />
        <span class="uppercase">{{ locale }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuGroup>
        <DropdownMenuItem v-for="o in options" :key="o.value" @select="setLocale(o.value)">
          {{ o.label }}
          <CheckIcon v-if="locale === o.value" class="ml-auto" />
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
