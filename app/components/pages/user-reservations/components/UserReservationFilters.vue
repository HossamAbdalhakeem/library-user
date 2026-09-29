<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-end justify-between gap-3 text-right">
      <div>
        <h2 class="text-xl font-bold text-[var(--app-text-strong)]">
          المنتجات المتاحة
        </h2>
        <p class="mt-1 text-sm text-[var(--app-muted)]">
          {{ loading ? "جاري تحميل المنتجات..." : `${total} منتج` }}
        </p>
      </div>
      <button
        v-if="filtersActive"
        type="button"
        class="text-sm font-semibold text-primary-700 hover:underline dark:text-primary-300"
        @click="emit('clear')"
      >
        مسح التصفية
      </button>
    </div>

    <div
      class="grid gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <AppSearchInput
        v-model="search"
        label="بحث"
        placeholder="اسم المنتج أو المدرس"
        input-class="w-full"
        :throttle-ms="350"
        @search="emit('search', $event)"
      />

      <div class="flex flex-col gap-2 text-right">
        <label class="text-sm font-medium">المدرس</label>
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
        <label class="text-sm font-medium">السنة الدراسية</label>
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
        <label class="text-sm font-medium">الفرع</label>
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
        <label class="text-sm font-medium">النوع</label>
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
