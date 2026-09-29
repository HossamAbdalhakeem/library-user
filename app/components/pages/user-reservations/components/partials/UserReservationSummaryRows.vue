<template>
  <dl class="grid gap-2 text-sm">
    <div v-for="row in rows" :key="row.label" class="flex justify-between gap-3">
      <dt class="text-[var(--app-muted)]">{{ row.label }}</dt>
      <dd class="font-medium">{{ row.value }}</dd>
    </div>
  </dl>
</template>

<script setup>
defineOptions({ name: "UserReservationSummaryRows" });

defineProps({
  rows: { type: Array, default: () => [] },
});
</script>
