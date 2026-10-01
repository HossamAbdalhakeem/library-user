<template>
  <div
    class="flex items-center gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-3 text-sm"
  >
    <img
      :src="coverSrc"
      alt=""
      class="size-16 shrink-0 rounded-xl object-cover"
      width="64"
      height="64"
    />
    <div class="min-w-0 flex-1">
      <p class="truncate font-extrabold text-[var(--app-text-strong)]">{{ product.name }}</p>
      <p class="mt-0.5 truncate text-[var(--app-muted)]">
        {{ product.teacherName || "—" }}
        <span v-if="product.studyYearName"> · {{ product.studyYearName }}</span>
      </p>
      <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <p><span class="text-[var(--app-muted)]">السعر</span> {{ formatMoney(unitPrice) }}</p>
        <p class="font-extrabold text-[#bc7d2c] dark:text-[#f6bb6a]">
          {{ formatMoney(totalAmount) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatMoney } from "~/utils/format/money";

defineOptions({ name: "UserReservationProductSummary" });

const props = defineProps({
  product: { type: Object, required: true },
  unitPrice: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
});

const coverSrc = computed(() => {
  if (props.product?.type === "CARD") return "/images/catalog/card.png";
  if (props.product?.type === "BOOKLET") return "/images/catalog/booklet.png";
  return "/images/catalog/book.png";
});
</script>
