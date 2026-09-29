<template>
  <article
    class="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)]"
  >
    <Skeleton width="100%" height="9.5rem" border-radius="0" />
    <div class="flex flex-1 flex-col gap-3 p-4">
      <Skeleton width="28%" height="0.75rem" />
      <Skeleton width="78%" height="1.15rem" />
      <Skeleton width="55%" height="0.9rem" />
      <Skeleton width="100%" height="2.75rem" border-radius="8px" />
      <div class="mt-auto flex items-center justify-between gap-3 pt-1">
        <Skeleton width="5.5rem" height="1rem" />
        <Skeleton width="4.25rem" height="1.75rem" border-radius="999px" />
      </div>
    </div>
  </article>
</template>

<script setup>
import Skeleton from "primevue/skeleton";

defineOptions({ name: "UserReservationProductCardSkeleton" });
</script>
