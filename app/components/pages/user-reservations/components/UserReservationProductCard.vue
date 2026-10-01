<template>
  <article
    class="catalog-card group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-card)] text-right outline-none"
    :class="{ 'is-disabled': !product.reservationAllowed }"
    role="button"
    tabindex="0"
    @click="onSelect"
    @keydown.enter.prevent="onSelect"
    @keydown.space.prevent="onSelect"
  >
    <div class="catalog-card__media relative aspect-[16/10] overflow-hidden">
      <img
        :src="coverSrc"
        alt=""
        class="catalog-card__photo absolute inset-0 h-full w-full object-cover"
      />
      <span class="catalog-card__type">{{ typeLabel }}</span>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4">
      <div class="space-y-1">
        <h2 class="line-clamp-2 text-lg font-extrabold leading-7 text-[var(--app-text-strong)]">
          {{ product.name }}
        </h2>
        <p class="text-sm text-[var(--app-muted)]">
          {{ product.teacherName }}
          <span v-if="product.studyYearName && product.studyYearName !== '-'">
            · {{ product.studyYearName }}
          </span>
        </p>
      </div>

      <ul v-if="branchRows.length" class="catalog-card__branches">
        <li v-for="branch in branchRows" :key="branch.id" class="catalog-card__branch">
          <span class="catalog-card__dot" :class="branch.tone" />
          <span class="min-w-0 flex-1 truncate text-sm">{{ branch.name }}</span>
          <span class="shrink-0 text-xs font-bold" :class="branch.tone">{{ branch.label }}</span>
        </li>
      </ul>
      <p v-else class="text-xs font-bold" :class="emptyAvailability.tone">
        {{ emptyAvailability.label }}
      </p>

      <div class="mt-auto flex items-end justify-between gap-3 pt-1">
        <div>
          <p class="text-[0.7rem] font-semibold text-[var(--app-muted)]">السعر</p>
          <p class="text-base font-extrabold text-[var(--app-text-strong)]">
            {{ product.sellingPriceLabel }}
          </p>
        </div>
        <span class="catalog-card__action" :class="{ 'is-off': !product.reservationAllowed }">
          {{ product.reservationAllowed ? "احجز" : "غير متاح" }}
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
        return { id: branch.id, name: branch.name, label: "متاح", tone: "is-ready" };
      }
      if (props.product?.reservationAllowed) {
        return { id: branch.id, name: branch.name, label: "متاح للحجز", tone: "is-hold" };
      }
      return { id: branch.id, name: branch.name, label: "غير متوفر", tone: "is-out" };
    },
  ),
);

const emptyAvailability = computed(() =>
  props.product?.reservationAllowed
    ? { label: "متاح للحجز", tone: "is-hold" }
    : { label: "غير متاح في أي فرع", tone: "is-out" },
);

const onSelect = () => {
  if (!props.product?.reservationAllowed) return;
  emit("select");
};
</script>

<style scoped>
.catalog-card {
  cursor: pointer;
  box-shadow: 0 16px 40px -32px rgb(0 0 0 / 0.55);
  transition:
    transform 280ms ease,
    border-color 280ms ease,
    box-shadow 280ms ease;
}

.catalog-card.is-disabled {
  cursor: default;
}

.catalog-card:hover,
.catalog-card:focus-visible {
  transform: translateY(-4px);
  border-color: rgb(245 175 82 / 0.55);
  box-shadow: 0 22px 44px -28px rgb(224 154 58 / 0.55);
}

.catalog-card.is-disabled:hover,
.catalog-card.is-disabled:focus-visible {
  transform: none;
  border-color: var(--app-border);
  box-shadow: 0 16px 40px -32px rgb(0 0 0 / 0.55);
}

.catalog-card__photo {
  transform: scale(1.04);
  transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
}

.catalog-card:hover .catalog-card__photo,
.catalog-card:focus-visible .catalog-card__photo {
  transform: scale(1.1);
}

.catalog-card.is-disabled:hover .catalog-card__photo {
  transform: scale(1.04);
}

.catalog-card__type {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  border-radius: 999px;
  background: rgb(12 11 10 / 0.62);
  padding: 0.2rem 0.65rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: #faf7f2;
  backdrop-filter: blur(10px);
}

.catalog-card__branches {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 0.35rem;
}

.catalog-card__branch {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.catalog-card__dot {
  width: 0.4rem;
  height: 0.4rem;
  flex-shrink: 0;
  border-radius: 999px;
  background: currentColor;
}

.is-ready {
  color: #059669;
}

.is-hold {
  color: #d97706;
}

.is-out {
  color: #e11d48;
}

:global(.app-dark) .is-ready {
  color: #6ee7b7;
}

:global(.app-dark) .is-hold {
  color: #fcd34d;
}

:global(.app-dark) .is-out {
  color: #fda4af;
}

.catalog-card__action {
  border-radius: 999px;
  background: #e09a3a;
  padding: 0.4rem 0.85rem;
  font-size: 0.78rem;
  font-weight: 800;
  color: #1a1208;
}

.catalog-card__action.is-off {
  background: var(--app-elevated);
  color: var(--app-muted);
}
</style>
