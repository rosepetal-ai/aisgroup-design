<!-- Without the side panel, with another app's texts and an error from its own sign in. -->
<script setup>
import LoginPage from '@aisgroup/design/blocks/LoginPage.vue';
</script>

<template>
  <div class="w-full overflow-hidden rounded-md border">
    <LoginPage :panel="false" class="min-h-160!" title="Sign in to Rosepetal Meta" subtitle="Use your Rosepetal account" :show-remember="false" submit-label="Sign in" :error="{ title: 'Wrong credentials', text: 'Check the email and password and try again.' }" password-invalid />
  </div>
</template>
