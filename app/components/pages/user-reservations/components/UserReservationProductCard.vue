<template>
  <article
    class="catalog-card group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] text-right outline-none"
    role="button"
    tabindex="0"
    @click="emit('select')"
    @keydown.enter.prevent="emit('select')"
    @keydown.space.prevent="emit('select')"
  >
    <div class="catalog-card__media relative aspect-[16/9] overflow-hidden">
      <img
        :src="coverSrc"
        alt=""
        class="catalog-card__photo absolute inset-0 h-full w-full object-cover"
      />
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4">
      <div class="space-y-1">
        <p class="text-xs font-medium text-[var(--app-muted)]">{{ typeLabel }}</p>
        <h2 class="line-clamp-2 text-base font-bold text-[var(--app-text-strong)]">
          {{ product.name }}
        </h2>
      </div>
      <p class="text-sm text-[var(--app-muted)]">
        {{ product.teacherName }}
        <span v-if="product.studyYearName && product.studyYearName !== '-'">
          · {{ product.studyYearName }}
        </span>
      </p>

      <div class="space-y-1.5">
        <p class="text-xs font-medium text-[var(--app-muted)]">الفروع</p>
        <ul v-if="branchRows.length" class="catalog-card__branches flex flex-col gap-1.5">
          <li
            v-for="branch in branchRows"
            :key="branch.id"
            class="flex items-center justify-between gap-2 rounded-lg bg-[var(--app-elevated)] px-2 py-1.5"
          >
            <span class="truncate text-sm text-[var(--app-text)]">{{ branch.name }}</span>
            <span class="shrink-0 text-xs font-semibold" :class="branch.tone">
              {{ branch.label }}
            </span>
          </li>
        </ul>
        <p v-else class="text-xs font-semibold" :class="emptyAvailability.tone">
          {{ emptyAvailability.label }}
        </p>
      </div>

      <div class="mt-auto flex items-center justify-between gap-3 pt-1">
        <span class="text-sm font-semibold text-[var(--app-text-strong)]">
          {{ product.sellingPriceLabel }}
        </span>
        <span class="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
          حجز
        </span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { getProductTypeLabel } from "~/enums/productType";

defineOptions({ name: "UserReservationProductCard" });

const props = defineProps({
  product: { type: Object, required: true },
});

const emit = defineEmits(["select"]);

const typeLabel = computed(() => getProductTypeLabel(props.product?.type));

const coverSrc = computed(() => {
  if (props.product?.type === "CARD") return "/images/catalog/card.png";
  if (props.product?.type === "BOOKLET") return "/images/catalog/booklet.png";
  return "/images/catalog/book.png";
});

const branchRows = computed(() =>
  (Array.isArray(props.product?.branches) ? props.product.branches : []).map(
    (branch) => {
      const inStock = Number(branch.availableQuantity) > 0;
      if (inStock) {
        return { id: branch.id, name: branch.name, label: "متاح", tone: "text-emerald-400" };
      }
      if (props.product?.reservationAllowed) {
        return {
          id: branch.id,
          name: branch.name,
          label: "متاح للحجز",
          tone: "text-amber-300",
        };
      }
      return {
        id: branch.id,
        name: branch.name,
        label: "غير متوفر",
        tone: "text-rose-300",
      };
    },
  ),
);

const emptyAvailability = computed(() =>
  props.product?.reservationAllowed
    ? { label: "متاح للحجز", tone: "text-amber-300" }
    : { label: "غير متاح في أي فرع", tone: "text-rose-300" },
);
</script>

<style scoped>
.catalog-card {
  transition:
    border-color 420ms ease,
    box-shadow 520ms ease;
}

.catalog-card:hover,
.catalog-card:focus-visible {
  border-color: #f5af52;
  box-shadow:
    0 0 0 1px #f5af52,
    0 18px 36px color-mix(in srgb, #f5af52 22%, transparent);
}

.catalog-card__photo {
  transform: scale(1.12);
  transition: transform 720ms cubic-bezier(0.22, 1, 0.36, 1);
}

.catalog-card:hover .catalog-card__photo,
.catalog-card:focus-visible .catalog-card__photo {
  transform: scale(1) translate3d(-3%, 0, 0);
}

.catalog-card__branches {
  max-height: 7.5rem;
  overflow-y: auto;
}
</style>
