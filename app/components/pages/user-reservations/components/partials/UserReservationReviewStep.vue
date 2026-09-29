<template>
  <UserReservationSummaryRows :rows="rows" />
</template>

<script setup>
import UserReservationSummaryRows from "./UserReservationSummaryRows.vue";

defineOptions({ name: "UserReservationReviewStep" });

defineProps({
  rows: { type: Array, default: () => [] },
});
</script>
