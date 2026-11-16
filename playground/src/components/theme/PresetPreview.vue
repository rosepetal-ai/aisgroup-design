<script setup lang="ts">
// A sample of the interface for the Preset page: real components (top bar, buttons, dataset tabs, badges, fields,
// card, table, alerts) so every token change is seen where it is used.
import { CircleAlertIcon, CircleCheckIcon, CircleXIcon, DownloadIcon, InfoIcon, PlusIcon, SearchIcon, Trash2Icon, } from '@lucide/vue'
import { ref } from 'vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'

const on = ref(true)
const rows = [
  { name: 'tapones-defectos-v14', dataset: 'Tapones línea 3', status: 'Training' },
  { name: 'tapones-defectos-v13', dataset: 'Tapones línea 3', status: 'Finished' },
  { name: 'envases-anomalias-v3', dataset: 'Envases PET', status: 'Failed' },
]
</script>

<template>
  <div class="flex flex-col overflow-hidden rounded-xl border bg-page">
    <div class="flex flex-col gap-4 p-4">
      <!-- Buttons and badges -->
      <Card class="gap-4 py-4">
        <CardHeader class="px-4">
          <CardTitle>{{ $t('Buttons') }}</CardTitle>
          <CardDescription>{{ $t('Primary, secondary, outline, ghost, link, destructive and soft; the dataset tabs.') }}</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 px-4">
          <div class="flex flex-wrap gap-2">
            <Button><PlusIcon data-icon="inline-start" />{{ $t('Create') }}</Button>
            <Button variant="secondary">{{ $t('Cancel') }}</Button>
            <Button variant="outline">{{ $t('Retry') }}</Button>
            <Button variant="ghost">{{ $t('Open') }}</Button>
            <Button variant="link">{{ $t('Details') }}</Button>
            <Button variant="destructive"><Trash2Icon data-icon="inline-start" />{{ $t('Delete') }}</Button>
            <Button variant="outline"><DownloadIcon />{{ $t('Download') }}</Button>
          </div>
          <div class="flex flex-wrap gap-2">
            <Badge>{{ $t('Default') }}</Badge>
            <Badge variant="secondary">{{ $t('Training') }}</Badge>
            <Badge variant="outline">{{ $t('Draft') }}</Badge>
            <Badge variant="success">{{ $t('Finished') }}</Badge>
            <Badge variant="warning">{{ $t('Expiring') }}</Badge>
            <Badge variant="destructive">{{ $t('Failed') }}</Badge>
          </div>
        </CardContent>
      </Card>

      <!-- Form -->
      <Card class="gap-4 py-4">
        <CardHeader class="px-4">
          <CardTitle>{{ $t('Form') }}</CardTitle>
          <CardAction>
            <Tabs default-value="a">
              <TabsList>
                <TabsTrigger value="a">{{ $t('General') }}</TabsTrigger>
                <TabsTrigger value="b">{{ $t('Users') }}</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardAction>
        </CardHeader>
        <CardContent class="flex flex-col gap-4 px-4">
          <Field>
            <FieldLabel for="pv-name">{{ $t('Dataset name') }}</FieldLabel>
            <Input id="pv-name" model-value="tapones_linea_3" />
          </Field>
          <InputGroup>
            <InputGroupAddon><SearchIcon /></InputGroupAddon>
            <InputGroupInput :placeholder="$t('Search model...')" />
          </InputGroup>
          <FieldLabel for="pv-switch">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{{ $t('Idle logout') }}</FieldTitle>
                <FieldDescription class="text-xs">{{ $t('Closes the session after a while without activity, with a warning first.') }}</FieldDescription>
              </FieldContent>
              <Switch id="pv-switch" v-model="on" />
            </Field>
          </FieldLabel>
          <div class="flex items-center gap-2 text-sm"><Checkbox id="pv-check" :model-value="true" /><Label for="pv-check" class="font-normal leading-normal">{{ $t('Remember me') }}</Label></div>
          <Progress :model-value="62" class="h-2" />
        </CardContent>
      </Card>

      <!-- Table -->
      <Card class="gap-2 py-4">
        <CardHeader class="px-4"><CardTitle>{{ $t('Models') }}</CardTitle></CardHeader>
        <CardContent class="px-4">
          <Table>
            <TableHeader>
              <TableRow class="hover:bg-transparent">
                <TableHead>{{ $t('Name') }}</TableHead>
                <TableHead>{{ $t('Dataset') }}</TableHead>
                <TableHead class="text-right">{{ $t('Status') }}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="r in rows" :key="r.name">
                <TableCell>{{ r.name }}</TableCell>
                <TableCell class="text-muted-foreground">{{ r.dataset }}</TableCell>
                <TableCell class="text-right">
                  <span class="inline-flex items-center gap-1.5">
                    <Spinner v-if="r.status === 'Training'" />
                    <CircleCheckIcon v-else-if="r.status === 'Finished'" class="size-4 text-success" />
                    <CircleXIcon v-else class="size-4 text-destructive" />
                    {{ $t(r.status) }}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- Alerts -->
      <div class="grid gap-3 sm:grid-cols-2">
        <Alert>
          <InfoIcon />
          <AlertTitle>{{ $t('Information') }}</AlertTitle>
          <AlertDescription>{{ $t('Online project: idle logout is enabled for all users.') }}</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>{{ $t('Error') }}</AlertTitle>
          <AlertDescription>{{ $t('The dataset could not be created') }}</AlertDescription>
        </Alert>
      </div>
    </div>
  </div>
</template>
