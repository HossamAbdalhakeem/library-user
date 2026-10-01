<template>
  <div class="catalog-page relative min-h-screen">
    <UserReservationsHeader />

    <UserReservationsHero />

    <div
      class="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6"
    >
      <section id="catalog" class="scroll-mt-28 space-y-5">
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
          <UserReservationProductCardSkeleton v-for="index in 6" :key="index" />
        </div>

        <div
          v-else-if="!products.length"
          class="flex flex-col items-center rounded-[1.5rem] border border-dashed border-[var(--app-border-strong)] bg-[var(--app-card)] px-4 py-16 text-center"
        >
          <i class="pi pi-inbox mb-3 text-3xl text-[#e09a3a]" aria-hidden="true" />
          <p class="text-base font-bold text-[var(--app-text-strong)]">{{ emptyMessage }}</p>
          <button
            v-if="filtersActive"
            type="button"
            class="mt-4 rounded-full bg-[#e09a3a] px-4 py-2 text-sm font-bold text-[#1a1208]"
            @click="clearFilters"
          >
            مسح التصفية
          </button>
        </div>

        <div v-else class="flex flex-col gap-6">
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <UserReservationProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              @select="openWizard(product)"
            />
          </div>

          <div v-if="hasMore" class="flex justify-center pt-2">
            <Button
              label="عرض المزيد"
              outlined
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
    </div>

    <footer class="border-t border-[var(--app-border)] px-4 py-6 text-center">
      <p class="text-sm font-bold text-[var(--app-text-strong)]">بكالوريا وثانوية أونلاين</p>
      <p class="mt-1 text-xs leading-6 text-[var(--app-muted)]">
        الدفع وتأكيد الحجز يتمان في الفرع
      </p>
    </footer>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import { PublicReservationCrud, readList } from "~/services/public-reservation";
import { normalizeBookSearchItem } from "~/services/book";
import { getProductTypeLabel } from "~/enums/productType";
import { useAppToast } from "~/composables/useAppToast";
import { messageFromFetchError } from "~/utils/api-errors/messages";
import UserReservationFilters from "./components/UserReservationFilters.vue";
import UserReservationProductCardSkeleton from "./components/UserReservationProductCardSkeleton.vue";
import UserReservationWizardDialog from "./components/UserReservationWizardDialog.vue";
import UserReservationProductCard from "./components/UserReservationProductCard.vue";
import UserReservationsHeader from "~/components/pages/user-reservations/components/partials/UserReservationsHeader.vue";
import UserReservationsHero from "~/components/pages/user-reservations/components/partials/UserReservationsHero.vue";

defineOptions({ name: "UserReservationsPageIndex" });

const { showError } = useAppToast();
const nuxtApp = useNuxtApp();
const search = ref("");
const teacherId = ref(null);
const studyYearId = ref(null);
const branchId = ref(null);
const productType = ref(null);
const PAGE_SIZE = 15;

const loadingMore = ref(false);
const reloading = ref(false);
const page = ref(1);
const listOverride = ref(null);
const moreProducts = ref([]);
const wizardVisible = ref(false);
const selectedProduct = ref(null);

// No await => loading stays reactive. Nuxt waits for these during SSR.
const {
  data: teachersData,
  loading: teachersLoading,
  error: teachersError,
} = PublicReservationCrud.getTeachers();
const {
  data: studyYearsData,
  loading: studyYearsLoading,
  error: studyYearsError,
} = PublicReservationCrud.getStudyYears();
const {
  data: branchesData,
  loading: branchesLoading,
  error: branchesError,
} = PublicReservationCrud.getBranches();
const {
  data: productTypesData,
  loading: productTypesLoading,
  error: productTypesError,
} = PublicReservationCrud.getProductTypes();
const {
  data: productsData,
  loading: productsLoading,
  error: productsError,
} = PublicReservationCrud.searchProducts({
  page: 1,
  per_page: PAGE_SIZE,
});

const teachers = computed(() => readList(teachersData.value));
const studyYears = computed(() => readList(studyYearsData.value));
const branches = computed(() => readList(branchesData.value));
const productTypes = computed(() =>
  readList(productTypesData.value).map((item) => ({
    value: item.value,
    label: getProductTypeLabel(item.value),
  }))
);

const filtersLoading = computed(
  () =>
    teachersLoading.value ||
    studyYearsLoading.value ||
    branchesLoading.value ||
    productTypesLoading.value
);

const loading = computed(() => productsLoading.value || reloading.value);

const activePayload = computed(() => listOverride.value ?? productsData.value);

const products = computed(() => {
  const firstPage = readList(activePayload.value).map(normalizeBookSearchItem);
  return firstPage.concat(moreProducts.value);
});

const total = computed(() =>
  Number(activePayload.value?.pagination?.total ?? products.value.length)
);

const filtersActive = computed(() => hasActiveFilters());

const emptyMessage = computed(() =>
  filtersActive.value ? "لا توجد منتجات مطابقة" : "لا توجد منتجات متاحة للحجز."
);

const hasMore = computed(() => products.value.length < total.value);

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

let filtersErrorReported = false;

watch(
  [teachersError, studyYearsError, branchesError, productTypesError],
  (errors) => {
    const error = errors.find(Boolean);
    if (!error || filtersErrorReported) return;
    filtersErrorReported = true;
    showError(messageFromFetchError(error, "تعذر تحميل خيارات التصفية."));
  },
  { immediate: true }
);

watch(
  productsError,
  (error) => {
    if (!error || listOverride.value) return;
    showError(messageFromFetchError(error, "تعذر تحميل المنتجات."));
  },
  { immediate: true }
);

const reloadProducts = async () => {
  page.value = 1;
  moreProducts.value = [];
  reloading.value = true;
  try {
    const { data, error } = await nuxtApp.runWithContext(() =>
      PublicReservationCrud.searchProducts(buildQuery(1), { cache: false })
    );
    if (error.value) {
      listOverride.value = { data: [], pagination: { total: 0 } };
      showError(messageFromFetchError(error.value, "تعذر تحميل المنتجات."));
      return;
    }
    listOverride.value = data.value;
  } catch (error) {
    listOverride.value = { data: [], pagination: { total: 0 } };
    showError(messageFromFetchError(error, "تعذر تحميل المنتجات."));
  } finally {
    reloading.value = false;
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
  loadingMore.value = true;
  const nextPage = page.value + 1;
  try {
    const { data, error } = await nuxtApp.runWithContext(() =>
      PublicReservationCrud.searchProducts(buildQuery(nextPage))
    );
    if (error.value) {
      showError(messageFromFetchError(error.value, "تعذر تحميل المنتجات."));
      return;
    }
    const rows = readList(data.value).map(normalizeBookSearchItem);
    if (!rows.length) return;
    page.value = nextPage;
    moreProducts.value = moreProducts.value.concat(rows);
  } catch (error) {
    showError(messageFromFetchError(error, "تعذر تحميل المنتجات."));
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
</script>

<style scoped>
.catalog-page {
  background:
    radial-gradient(ellipse 80% 32% at 100% 0%, rgb(245 175 82 / 0.14), transparent 58%),
    var(--app-bg);
}
</style>
