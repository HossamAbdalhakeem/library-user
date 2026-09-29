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
          <UserReservationProductCardSkeleton v-for="index in 6" :key="index" />
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
import UserReservationProductCardSkeleton from "./components/UserReservationProductCardSkeleton.vue";
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
const teachers = ref([]);
const studyYears = ref([]);
const branches = ref([]);
const productTypes = ref([]);
const PAGE_SIZE = 15;

const filtersLoading = ref(false);
const loading = ref(false);
const loadingMore = ref(false);
const page = ref(1);
const total = ref(0);
const products = ref([]);
const wizardVisible = ref(false);
const selectedProduct = ref(null);

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

const buildQuery = () => {
  const product = String(search.value || "").trim();
  return {
    page: page.value,
    per_page: PAGE_SIZE,
    ...(product ? { product } : {}),
    ...(teacherId.value ? { teacherId: teacherId.value } : {}),
    ...(studyYearId.value ? { studyYearId: studyYearId.value } : {}),
    ...(branchId.value ? { branchId: branchId.value } : {}),
    ...(productType.value ? { type: productType.value } : {}),
  };
};

const loadFilters = async () => {
  filtersLoading.value = true;
  const [teacherResult, yearResult, branchResult, typeResult] =
    await Promise.allSettled([
      publicReservationApi.getTeachers(),
      publicReservationApi.getStudyYears(),
      publicReservationApi.getBranches(),
      publicReservationApi.getProductTypes(),
    ]);

  if (teacherResult.status === "fulfilled") {
    teachers.value = teacherResult.value || [];
  }
  if (yearResult.status === "fulfilled") {
    studyYears.value = yearResult.value || [];
  }
  if (branchResult.status === "fulfilled") {
    branches.value = branchResult.value || [];
  }
  if (typeResult.status === "fulfilled") {
    productTypes.value = (typeResult.value || []).map((item) => ({
      value: item.value,
      label: getProductTypeLabel(item.value),
    }));
  }

  const failed = [teacherResult, yearResult, branchResult, typeResult].some(
    (result) => result.status === "rejected",
  );
  if (failed) {
    const reason = [teacherResult, yearResult, branchResult, typeResult].find(
      (result) => result.status === "rejected",
    );
    showError(reason?.reason?.message || "تعذر تحميل خيارات التصفية.");
  }
  filtersLoading.value = false;
};

const loadProducts = async ({ append = false } = {}) => {
  if (append) loadingMore.value = true;
  else {
    loading.value = true;
    page.value = 1;
  }

  try {
    const result = await publicReservationApi.searchProducts(buildQuery());
    const rows = (result?.data || []).map(normalizeBookSearchItem);
    products.value = append ? products.value.concat(rows) : rows;
    total.value = Number(result?.pagination?.total ?? rows.length);
  } catch (error) {
    if (append) page.value = Math.max(1, page.value - 1);
    else {
      products.value = [];
      total.value = 0;
    }
    showError(error?.message || "تعذر تحميل المنتجات.");
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const reloadProducts = () => loadProducts();

const clearFilters = () => {
  search.value = "";
  teacherId.value = null;
  studyYearId.value = null;
  branchId.value = null;
  productType.value = null;
  loadProducts();
};

const loadMore = () => {
  if (!hasMore.value || loading.value || loadingMore.value) return;
  page.value += 1;
  loadProducts({ append: true });
};

const onSearch = (term) => {
  search.value = String(term ?? "");
  loadProducts();
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
  loadFilters();
  loadProducts();
});
</script>
