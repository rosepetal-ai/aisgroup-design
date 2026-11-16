<script setup lang="ts">
import { CircleAlertIcon, EyeIcon, EyeOffIcon, PauseIcon, PlayIcon } from '@lucide/vue'
import { computed, ref } from 'vue'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../ui/input-group'
import { Spinner } from '../ui/spinner'
import InspectionGrid from './InspectionGrid.vue'
import logo from './rosepetal.svg'

const props = withDefaults(defineProps<{
  panel?: boolean
  panelTitle?: string
  panelSubtitle?: string
  title?: string
  subtitle?: string
  emailLabel?: string
  emailPlaceholder?: string
  passwordLabel?: string
  showPasswordLabel?: string
  hidePasswordLabel?: string
  rememberLabel?: string
  showRemember?: boolean
  submitLabel?: string
  submittingLabel?: string
  footer?: string
  playLabel?: string
  pauseLabel?: string
  loading?: boolean
  error?: { title: string, text: string } | null
  passwordInvalid?: boolean
}>(), {
  panel: true,
  panelTitle: 'AI Visual Inspection Platform',
  panelSubtitle: 'Login to access your management panel',
  title: 'Welcome',
  subtitle: 'Sign in with your email and password',
  emailLabel: 'Email',
  emailPlaceholder: 'name@company.com',
  passwordLabel: 'Password',
  showPasswordLabel: 'Show password',
  hidePasswordLabel: 'Hide password',
  rememberLabel: 'Remember',
  showRemember: true,
  submitLabel: 'Log in',
  submittingLabel: 'Signing in...',
  footer: '© Rosepetal, Part of AIS Group',
  playLabel: 'Play animation',
  pauseLabel: 'Pause animation',
  error: null,
})
const emit = defineEmits<{ submit: [] }>()

const email = defineModel<string>('email', { default: '' })
const password = defineModel<string>('password', { default: '' })
const remember = defineModel<boolean>('remember', { default: true })

const showPassword = ref(false)
const paused = ref(false)
const canSubmit = computed(() => !props.loading && !!email.value.trim() && !!password.value)
</script>

<template>
  <div class="relative grid min-h-svh bg-background text-foreground" :class="panel && 'lg:grid-cols-2'">
    <div v-if="panel" class="relative hidden h-full flex-col overflow-hidden bg-brand text-brand-foreground lg:flex">
      <InspectionGrid :paused="paused" />
      <div class="relative p-10">
        <img :src="logo" alt="Rosepetal" class="h-auto w-44">
      </div>
      <div class="relative mt-auto flex max-w-lg flex-col gap-4 p-10 pb-9">
        <h1 class="text-4xl leading-tight font-medium text-balance">{{ panelTitle }}</h1>
        <p class="text-lg text-brand-foreground/70">{{ panelSubtitle }}</p>
      </div>
    </div>

    <div class="relative flex flex-col">
      <header class="flex justify-end p-6">
        <div class="-mr-2 flex items-center gap-1"><slot name="controls" /></div>
      </header>
      <main class="flex flex-1 flex-col items-center justify-center px-6 py-6">
        <div class="flex w-full max-w-sm flex-col gap-7">
          <div class="flex flex-col items-center gap-3 text-center">
            <svg viewBox="0 0 256 256" class="size-14 text-primary" aria-hidden="true">
              <mask id="rp-login-ring">
                <rect width="256" height="256" fill="white" />
                <circle cx="128" cy="128" r="52" fill="black" />
                <circle cx="169" cy="74" r="17" fill="black" />
              </mask>
              <circle cx="128" cy="128" r="93" fill="currentColor" mask="url(#rp-login-ring)" />
            </svg>
            <h1 class="text-4xl font-medium text-heading">{{ title }}</h1>
            <p class="text-sm text-muted-foreground">{{ subtitle }}</p>
          </div>

          <form class="flex flex-col gap-6" @submit.prevent="canSubmit && emit('submit')">
            <Alert v-if="error" variant="destructive" class="animate-in fade-in slide-in-from-top-2 duration-240 motion-reduce:animate-none">
              <CircleAlertIcon />
              <AlertTitle>{{ error.title }}</AlertTitle>
              <AlertDescription>{{ error.text }}</AlertDescription>
            </Alert>

            <FieldGroup class="gap-4">
              <Field :data-disabled="loading || undefined">
                <FieldLabel for="login-email">{{ emailLabel }}</FieldLabel>
                <Input id="login-email" v-model="email" type="email" autocomplete="username" :placeholder="emailPlaceholder" :disabled="loading" class="h-10" />
              </Field>
              <Field :data-invalid="passwordInvalid || undefined" :data-disabled="loading || undefined">
                <FieldLabel for="login-password">{{ passwordLabel }}</FieldLabel>
                <InputGroup class="h-10">
                  <InputGroupInput id="login-password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" :disabled="loading" :aria-invalid="passwordInvalid || undefined" />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton size="icon-xs" :disabled="loading" :aria-label="showPassword ? hidePasswordLabel : showPasswordLabel" @click="showPassword = !showPassword">
                      <EyeOffIcon v-if="showPassword" />
                      <EyeIcon v-else />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field v-if="showRemember" orientation="horizontal" :data-disabled="loading || undefined">
                <Checkbox id="login-remember" v-model="remember" :disabled="loading" />
                <FieldLabel for="login-remember" class="font-normal">{{ rememberLabel }}</FieldLabel>
              </Field>
            </FieldGroup>

            <Button type="submit" size="lg" class="w-full" :disabled="!canSubmit">
              <Spinner v-if="loading" data-icon="inline-start" />
              {{ loading ? submittingLabel : submitLabel }}
            </Button>

            <FieldDescription v-if="$slots.legal" class="text-center text-xs"><slot name="legal" /></FieldDescription>
          </form>
        </div>
      </main>

      <footer class="relative flex justify-center px-6 pb-6 text-xs text-muted-foreground">
        <p>{{ footer }}</p>
        <Button v-if="panel" variant="ghost" size="xs" class="absolute right-4 bottom-4 hidden text-muted-foreground motion-reduce:hidden lg:inline-flex" :aria-pressed="paused" @click="paused = !paused">
          <PlayIcon v-if="paused" data-icon="inline-start" />
          <PauseIcon v-else data-icon="inline-start" />
          {{ paused ? playLabel : pauseLabel }}
        </Button>
      </footer>
    </div>
  </div>
</template>
