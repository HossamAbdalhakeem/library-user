<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3 text-right">
      <div>
        <h2 class="text-2xl font-extrabold text-[var(--app-text-strong)]">
          المنتجات المتاحة
        </h2>
        <p class="mt-1 text-sm text-[var(--app-muted)]">
          {{ loading ? "جاري تحميل المنتجات..." : `${total} منتج` }}
        </p>
      </div>
      <button
        v-if="filtersActive"
        type="button"
        class="rounded-full border border-[var(--app-border-strong)] px-3 py-1.5 text-sm font-bold text-[var(--app-text-strong)] transition hover:border-[#e09a3a]"
        @click="emit('clear')"
      >
        مسح التصفية
      </button>
    </div>

    <div class="filters">
      <AppSearchInput
        v-model="search"
        label="بحث"
        placeholder="اسم المنتج أو المدرس"
        input-class="w-full"
        :throttle-ms="350"
        @search="emit('search', $event)"
      />

      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div class="flex flex-col gap-2 text-right">
          <label class="filters__label">المدرس</label>
          <Select
            v-model="teacherId"
            :options="teachers"
            option-label="name"
            option-value="id"
            placeholder="كل المدرسين"
            show-clear
            filter
            class="w-full"
            :loading="filtersLoading"
            @update:model-value="emit('change')"
          />
        </div>

        <div class="flex flex-col gap-2 text-right">
          <label class="filters__label">السنة الدراسية</label>
          <Select
            v-model="studyYearId"
            :options="studyYears"
            option-label="name"
            option-value="id"
            placeholder="كل السنوات"
            show-clear
            filter
            class="w-full"
            :loading="filtersLoading"
            @update:model-value="emit('change')"
          />
        </div>

        <div class="flex flex-col gap-2 text-right">
          <label class="filters__label">الفرع</label>
          <Select
            v-model="branchId"
            :options="branches"
            option-label="name"
            option-value="id"
            placeholder="كل الفروع"
            show-clear
            filter
            class="w-full"
            :loading="filtersLoading"
            @update:model-value="emit('change')"
          />
        </div>

        <div class="flex flex-col gap-2 text-right">
          <label class="filters__label">النوع</label>
          <Select
            v-model="productType"
            :options="productTypes"
            option-label="label"
            option-value="value"
            placeholder="كل الأنواع"
            show-clear
            class="w-full"
            :loading="filtersLoading"
            @update:model-value="emit('change')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Select from "primevue/select";
import AppSearchInput from "~/components/shared/inputs/app-search-input/index.vue";

defineOptions({ name: "UserReservationFilters" });

defineProps({
  teachers: { type: Array, default: () => [] },
  studyYears: { type: Array, default: () => [] },
  branches: { type: Array, default: () => [] },
  productTypes: { type: Array, default: () => [] },
  filtersLoading: { type: Boolean, default: false },
  filtersActive: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  total: { type: Number, default: 0 },
});

const search = defineModel("search", { type: String, default: "" });
const teacherId = defineModel("teacherId", { default: null });
const studyYearId = defineModel("studyYearId", { default: null });
const branchId = defineModel("branchId", { default: null });
const productType = defineModel("productType", { default: null });

const emit = defineEmits(["search", "change", "clear"]);
</script>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  border-radius: 1.5rem;
  border: 1px solid var(--app-border);
  background: color-mix(in srgb, var(--app-card) 92%, transparent);
  padding: 1rem;
  box-shadow: 0 18px 40px -32px rgb(0 0 0 / 0.45);
}

.filters__label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--app-muted);
}
</style>
