<!-- Software the whole group uses: AIS Group signs it alone, with its full logo, and the app is named «Nexus ERP», without a company in front. The panel carries the catalogue covers' hexagon corner instead of the inspection animation, so there is no pause button. The form is the app's own: here a Google sign-in. The logo and the pattern are the guide's files, downloaded, never redrawn. -->
<script setup>
import { ref } from 'vue';
import LoginPage from '@aisgroup/design/blocks/LoginPage.vue';
import { Button } from '@aisgroup/design/ui/button';
import { Spinner } from '@aisgroup/design/ui/spinner';

// The guide's official files (Logos, Patterns). An app downloads them into its own assets.
const GUIDE = 'https://design.aisgroup.ai';
const loading = ref(false);
function signIn() {
  loading.value = true;
  setTimeout(() => (loading.value = false), 1500);
}
</script>

<template>
  <div class="w-full overflow-hidden rounded-md border">
    <LoginPage class="min-h-160!" panel-title="Nexus ERP" panel-subtitle="" title="Welcome" subtitle="" footer="" :logo="`${GUIDE}/logos/ais-group-white.svg`" logo-alt="AIS Group" logo-class="h-12 w-auto">
      <template #panel-art>
        <img :src="`${GUIDE}/examples/shared/print/assets/hex-printed-cover.svg`" alt="" class="pointer-events-none absolute top-0 right-0 h-auto w-[38%] opacity-60">
      </template>
      <template #mark>
        <div class="mb-2 lg:hidden">
          <img :src="`${GUIDE}/logos/ais-group-blue.svg`" alt="AIS Group" class="h-12 w-auto dark:hidden">
          <img :src="`${GUIDE}/logos/ais-group-white.svg`" alt="AIS Group" class="hidden h-12 w-auto dark:block">
        </div>
      </template>
      <template #form>
        <Button size="lg" class="w-full" :disabled="loading" @click="signIn">
          <Spinner v-if="loading" data-icon="inline-start" />
          Sign in with Google
        </Button>
      </template>
    </LoginPage>
  </div>
</template>
