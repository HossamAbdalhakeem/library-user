<template>
  <div class="relative min-h-screen">
    <UserReservationsHeader />

    <UserReservationsHero />

    <div
      class="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6"
    >
      <section id="catalog" class="scroll-mt-24 space-y-5">
        <UserReservationFilters
          v-model:search="search"
          v-model:teacher-id="teacherId"
          v-model:study-year-id="studyYearId"
          v-model:branch-id="branchId"
          v-model:product-type="productType"
          :teachers="teachers"
          :study-years="studyYears"
          :branches="branches"
          :product-types="productTypes"
          :filters-loading="filtersLoading"
          :filters-active="filtersActive"
          :loading="loading"
          :total="total"
          @search="onSearch"
          @change="reloadProducts"
          @clear="clearFilters"
        />

        <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="index in 6"
            :key="index"
            class="h-72 animate-pulse rounded-2xl border border-[var(--app-border)] bg-[var(--app-elevated)]"
          />
        </div>

        <p
          v-else-if="!products.length"
          class="rounded-2xl border border-dashed border-[var(--app-border)] px-4 py-16 text-center text-sm text-[var(--app-muted)]"
        >
          {{ emptyMessage }}
        </p>

        <div v-else class="flex flex-col gap-6">
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <UserReservationProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              @select="openWizard(product)"
            />
          </div>

          <div v-if="hasMore" class="flex justify-center">
            <Button
              label="عرض المزيد"
              :loading="loadingMore"
              :disabled="loadingMore"
              @click="loadMore"
            />
          </div>
        </div>
      </section>

      <UserReservationWizardDialog
        v-model:visible="wizardVisible"
        :product="selectedProduct"
        @submitted="onSubmitted"
      />

      <footer
        class="pb-4 text-center text-xs leading-6 text-[var(--app-muted)]"
      >
        الدفع وتأكيد الحجز يتمان في الفرع
      </footer>
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import { publicReservationApi } from "~/services/public-reservation";
import { normalizeBookSearchItem } from "~/services/book";
import { getProductTypeLabel } from "~/enums/productType";
import { useAppToast } from "~/composables/useAppToast";
import UserReservationFilters from "./components/UserReservationFilters.vue";
import UserReservationWizardDialog from "./components/UserReservationWizardDialog.vue";
import UserReservationProductCard from "./components/UserReservationProductCard.vue";
import UserReservationsHeader from "~/components/pages/user-reservations/components/partials/UserReservationsHeader.vue";
import UserReservationsHero from "~/components/pages/user-reservations/components/partials/UserReservationsHero.vue";

defineOptions({ name: "UserReservationsPageIndex" });

const { showError } = useAppToast();
const search = ref("");
const teacherId = ref(null);
const studyYearId = ref(null);
const branchId = ref(null);
const productType = ref(null);
const PAGE_SIZE = 15;

const loadingMore = ref(false);
const page = ref(1);
const extraRows = ref([]);
const wizardVisible = ref(false);
const selectedProduct = ref(null);

const filtersActive = computed(() => hasActiveFilters());

const emptyMessage = computed(() =>
  filtersActive.value ? "لا توجد منتجات مطابقة" : "لا توجد منتجات متاحة للحجز."
);

const hasActiveFilters = () =>
  Boolean(
    String(search.value || "").trim() ||
      teacherId.value ||
      studyYearId.value ||
      branchId.value ||
      productType.value
  );

const buildQuery = (pageNumber = 1) => {
  const product = String(search.value || "").trim();
  return {
    page: pageNumber,
    per_page: PAGE_SIZE,
    ...(product ? { product } : {}),
    ...(teacherId.value ? { teacherId: teacherId.value } : {}),
    ...(studyYearId.value ? { studyYearId: studyYearId.value } : {}),
    ...(branchId.value ? { branchId: branchId.value } : {}),
    ...(productType.value ? { type: productType.value } : {}),
  };
};

const { data: filterPayload, pending: filtersLoading } = await useAsyncData(
  "public-reservation-filters",
  async () => {
    const [teacherResult, yearResult, branchResult, typeResult] =
      await Promise.allSettled([
        publicReservationApi.getTeachers(),
        publicReservationApi.getStudyYears(),
        publicReservationApi.getBranches(),
        publicReservationApi.getProductTypes(),
      ]);

    const failed = [teacherResult, yearResult, branchResult, typeResult].find(
      (result) => result.status === "rejected"
    );

    return {
      teachers:
        teacherResult.status === "fulfilled" ? teacherResult.value || [] : [],
      studyYears:
        yearResult.status === "fulfilled" ? yearResult.value || [] : [],
      branches:
        branchResult.status === "fulfilled" ? branchResult.value || [] : [],
      productTypes:
        typeResult.status === "fulfilled"
          ? (typeResult.value || []).map((item) => ({
              value: item.value,
              label: getProductTypeLabel(item.value),
            }))
          : [],
      errorMessage: failed
        ? failed.reason?.message || "تعذر تحميل خيارات التصفية."
        : "",
    };
  }
);

const {
  data: catalog,
  pending: loading,
  error: productsError,
  refresh: refreshCatalog,
} = await useAsyncData("public-reservation-products", () =>
  publicReservationApi.searchProducts(buildQuery(1))
);

const teachers = computed(() => filterPayload.value?.teachers || []);
const studyYears = computed(() => filterPayload.value?.studyYears || []);
const branches = computed(() => filterPayload.value?.branches || []);
const productTypes = computed(() => filterPayload.value?.productTypes || []);

const products = computed(() => {
  const rows = (catalog.value?.data || []).map(normalizeBookSearchItem);
  return rows.concat(extraRows.value);
});

const total = computed(() =>
  Number(catalog.value?.pagination?.total ?? products.value.length)
);

const hasMore = computed(() => products.value.length < total.value);

const reloadProducts = async () => {
  page.value = 1;
  extraRows.value = [];
  await refreshCatalog();
  if (import.meta.client && productsError.value) {
    showError(productsError.value?.message || "تعذر تحميل المنتجات.");
  }
};

const clearFilters = () => {
  search.value = "";
  teacherId.value = null;
  studyYearId.value = null;
  branchId.value = null;
  productType.value = null;
  reloadProducts();
};

const loadMore = async () => {
  if (!hasMore.value || loading.value || loadingMore.value) return;
  const nextPage = page.value + 1;
  loadingMore.value = true;
  try {
    const result = await publicReservationApi.searchProducts(
      buildQuery(nextPage)
    );
    const rows = (result?.data || []).map(normalizeBookSearchItem);
    extraRows.value = extraRows.value.concat(rows);
    page.value = nextPage;
  } catch (error) {
    showError(error?.message || "تعذر تحميل المنتجات.");
  } finally {
    loadingMore.value = false;
  }
};

const onSearch = (term) => {
  search.value = String(term ?? "");
  reloadProducts();
};

const openWizard = (product) => {
  if (!product?.reservationAllowed) return;
  selectedProduct.value = product;
  wizardVisible.value = true;
};

const onSubmitted = () => {
  selectedProduct.value = null;
};

onMounted(() => {
  if (filterPayload.value?.errorMessage) {
    showError(filterPayload.value.errorMessage);
  }
  if (productsError.value) {
    showError(productsError.value?.message || "تعذر تحميل المنتجات.");
  }
});
</script>
