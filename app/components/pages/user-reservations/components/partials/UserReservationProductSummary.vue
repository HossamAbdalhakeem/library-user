<template>
  <div
    class="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] px-4 py-3 text-sm"
  >
    <p class="mb-2 font-semibold">{{ product.name }}</p>
    <div class="grid gap-1 sm:grid-cols-2">
      <p><span class="text-[var(--app-muted)]">الأستاذ:</span> {{ product.teacherName || "—" }}</p>
      <p><span class="text-[var(--app-muted)]">السنة:</span> {{ product.studyYearName || "—" }}</p>
      <p><span class="text-[var(--app-muted)]">السعر:</span> {{ formatMoney(unitPrice) }}</p>
      <p><span class="text-[var(--app-muted)]">الإجمالي:</span> {{ formatMoney(totalAmount) }}</p>
    </div>
  </div>
</template>

<script setup>
import { formatMoney } from "~/utils/format/money";

defineOptions({ name: "UserReservationProductSummary" });

defineProps({
  product: { type: Object, required: true },
  unitPrice: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
});
</script>
