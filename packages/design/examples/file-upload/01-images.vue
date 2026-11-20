<!-- Drop images on the dashed zone or choose them; the list shows each file with its progress, a rejected one with the reason, and a remove button. -->
<script setup>
import { ref } from 'vue';
import { FileUpload, FileUploadItem } from '@aisgroup/design/ui/file-upload';
import { ItemGroup } from '@aisgroup/design/ui/item';
const files = ref([{ name: 'board-0412.png', size: 2457600 }, { name: 'board-0413.png', size: 2621440, progress: 60 }]);
const add = (list) => files.value.push(...list.map((f) => ({ name: f.name, size: f.size })));
const reject = (list) => files.value.push(...list.map(({ file, reason }) => ({ name: file.name, size: file.size, error: reason === 'size' ? 'Larger than 10 MB' : 'Not a PNG or JPG image' })));
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-4">
    <FileUpload accept="image/png,image/jpeg" multiple :max-size="10 * 1024 * 1024" description="PNG or JPG, up to 10 MB" @files="add" @reject="reject" />
    <ItemGroup v-if="files.length" class="gap-2">
      <FileUploadItem v-for="(f, i) in files" :key="`${f.name}-${i}`" :file="f" :progress="f.progress" :error="f.error" @remove="files.splice(i, 1)" />
    </ItemGroup>
  </div>
</template>
