<template>
  <dl class="overflow-hidden rounded-2xl border border-[var(--app-border)] text-sm">
    <div
      v-for="row in rows"
      :key="row.label"
      class="flex items-start justify-between gap-3 border-b border-[var(--app-border)] px-4 py-3 last:border-b-0"
    >
      <dt class="text-[var(--app-muted)]">{{ row.label }}</dt>
      <dd class="max-w-[65%] text-end font-bold text-[var(--app-text-strong)]">{{ row.value }}</dd>
    </div>
  </dl>
</template>

<script setup>
defineOptions({ name: "UserReservationSummaryRows" });

defineProps({
  rows: { type: Array, default: () => [] },
});
</script>
