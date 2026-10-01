<template>
  <article
    class="flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-card)]"
  >
    <Skeleton width="100%" height="11rem" border-radius="0" />
    <div class="flex flex-1 flex-col gap-3 p-4">
      <Skeleton width="82%" height="1.25rem" />
      <Skeleton width="48%" height="0.85rem" />
      <Skeleton width="100%" height="2.4rem" border-radius="12px" />
      <div class="mt-auto flex items-end justify-between gap-3 pt-1">
        <div class="space-y-1">
          <Skeleton width="2.5rem" height="0.7rem" />
          <Skeleton width="5.5rem" height="1rem" />
        </div>
        <Skeleton width="4.25rem" height="1.85rem" border-radius="999px" />
      </div>
    </div>
  </article>
</template>

<script setup>
import Skeleton from "primevue/skeleton";

defineOptions({ name: "UserReservationProductCardSkeleton" });
</script>
