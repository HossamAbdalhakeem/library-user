<template>
  <Dialog
    :visible="visible"
    modal
    dir="rtl"
    :header="success ? 'تم إرسال طلب الحجز' : 'حجز المنتج'"
    :style="{ width: 'min(720px, 96vw)' }"
    :closable="!submitting"
    @update:visible="onVisible"
  >
    <UserReservationSuccessContent
      v-if="success"
      :reservation-number="success.reservationNumber"
      :rows="successRows"
    />

    <div v-else class="space-y-5 text-right">
      <UserReservationProductSummary
        v-if="product"
        :product="product"
        :unit-price="unitPrice"
        :total-amount="totalAmount"
      />

      <ol class="wizard-steps" aria-label="خطوات الحجز">
        <li
          v-for="(step, index) in steps"
          :key="step.label"
          class="wizard-steps__item"
          :class="{
            'is-active': index === activeStep,
            'is-done': index < activeStep,
          }"
        >
          <span class="wizard-steps__index">{{ step.index }}</span>
          <span class="wizard-steps__label">{{ step.label }}</span>
        </li>
      </ol>

      <UserReservationBranchPaymentStep
        v-if="activeStep === 0"
        :branch-id="branchId"
        :quantity="quantity"
        :deposit="deposit"
        :method="method"
        :branch-options="branchOptions"
        :total-amount="totalAmount"
        @update:branch-id="branchId = $event"
        @update:quantity="quantity = $event"
        @update:deposit="deposit = $event"
        @update:method="method = $event"
      />
      <UserReservationStudentStep
        v-else-if="activeStep === 1"
        :name="name"
        :phone="phone"
        :study-year-id="studyYearId"
        :study-years="studyYears"
        :loading="studyYearsLoading"
        @update:name="name = $event"
        @update:phone="phone = $event"
        @update:study-year-id="studyYearId = $event"
      />
      <UserReservationReviewStep v-else :rows="reviewRows" />

      <p v-if="formError" class="text-sm text-red-500">{{ formError }}</p>
    </div>

    <template #footer>
      <UserReservationWizardFooter
        :success="Boolean(success)"
        :active-step="activeStep"
        :submitting="submitting"
        @close="close"
        @back="activeStep -= 1"
        @next="goNext"
        @submit="submit"
      />
    </template>
  </Dialog>
</template>

<script setup>
import Dialog from "primevue/dialog";
import { PaymentMethod, getPaymentMethodLabel } from "~/enums/paymentMethod";
import {
  PublicReservationCrud,
  readData,
  readList,
} from "~/services/public-reservation";
import { messageFromFetchError } from "~/utils/api-errors/messages";
import { formatMoney } from "~/utils/format/money";
import UserReservationBranchPaymentStep from "./partials/UserReservationBranchPaymentStep.vue";
import UserReservationProductSummary from "./partials/UserReservationProductSummary.vue";
import UserReservationReviewStep from "./partials/UserReservationReviewStep.vue";
import UserReservationStudentStep from "./partials/UserReservationStudentStep.vue";
import UserReservationSuccessContent from "./partials/UserReservationSuccessContent.vue";
import UserReservationWizardFooter from "./partials/UserReservationWizardFooter.vue";

defineOptions({ name: "UserReservationWizardDialog" });

const props = defineProps({
  visible: { type: Boolean, default: false },
  product: { type: Object, default: null },
});

const emit = defineEmits(["update:visible", "submitted"]);

const steps = [
  { index: "١", label: "الفرع والدفع" },
  { index: "٢", label: "بيانات الطالب" },
  { index: "٣", label: "المراجعة" },
];

const nuxtApp = useNuxtApp();
const activeStep = ref(0);
const submitting = ref(false);
const formError = ref("");
const success = ref(null);

const {
  data: studyYearsData,
  loading: studyYearsLoading,
  error: studyYearsError,
} = PublicReservationCrud.getStudyYears();

const studyYears = computed(() => readList(studyYearsData.value));

const branchId = ref(null);
const quantity = ref(1);
const deposit = ref(null);
const method = ref(PaymentMethod.INSTAPAY);
const name = ref("");
const phone = ref("");
const studyYearId = ref(null);

const branchOptions = computed(() =>
  (props.product?.branches || []).map((branch) => ({
    label: branch.name,
    value: branch.id,
    sellingPrice: branch.sellingPrice,
  })),
);

const selectedBranch = computed(() =>
  branchOptions.value.find((branch) => branch.value === branchId.value) || null,
);

const unitPrice = computed(() =>
  Number(selectedBranch.value?.sellingPrice ?? props.product?.sellingPrice ?? 0),
);

const totalAmount = computed(() => unitPrice.value * Number(quantity.value || 0));

const studyYearName = computed(
  () => studyYears.value.find((year) => year.id === studyYearId.value)?.name || "—",
);

const reviewRows = computed(() => [
  { label: "المنتج", value: props.product?.name || "—" },
  { label: "الفرع", value: selectedBranch.value?.label || "—" },
  { label: "الكمية", value: String(quantity.value || 0) },
  { label: "العربون", value: formatMoney(deposit.value) },
  { label: "طريقة الدفع", value: getPaymentMethodLabel(method.value) },
  { label: "الاسم", value: name.value.trim() || "—" },
  { label: "الموبايل", value: phone.value.trim() || "—" },
  { label: "السنة الدراسية", value: studyYearName.value },
]);

const successRows = computed(() => {
  if (!success.value) return [];
  return [
    { label: "المنتج", value: success.value.productName },
    { label: "الفرع", value: success.value.branchName },
    { label: "العربون", value: formatMoney(success.value.deposit) },
    { label: "طريقة الدفع", value: success.value.methodLabel },
  ];
});

const resetForm = () => {
  activeStep.value = 0;
  formError.value = "";
  success.value = null;
  submitting.value = false;
  branchId.value = branchOptions.value[0]?.value || null;
  quantity.value = 1;
  deposit.value = null;
  method.value = PaymentMethod.INSTAPAY;
  name.value = "";
  phone.value = "";
  studyYearId.value = props.product?.studyYear?.id || null;
};

watch(
  () => props.visible,
  (open) => {
    if (!open) return;
    resetForm();
    if (studyYearsError.value) {
      formError.value = messageFromFetchError(
        studyYearsError.value,
        "تعذر تحميل السنوات الدراسية.",
      );
    }
  },
);

const onVisible = (value) => {
  if (submitting.value) return;
  emit("update:visible", value);
};

const close = () => {
  emit("update:visible", false);
  emit("submitted");
};

const validateStep = () => {
  formError.value = "";
  if (activeStep.value === 0) {
    if (!branchId.value) {
      formError.value = "اختر الفرع.";
      return false;
    }
    if (!Number.isInteger(Number(quantity.value)) || Number(quantity.value) < 1) {
      formError.value = "الكمية يجب أن تكون ١ على الأقل.";
      return false;
    }
    const amount = Number(deposit.value);
    if (!Number.isFinite(amount) || amount <= 0) {
      formError.value = "أدخل مبلغ العربون.";
      return false;
    }
    if (totalAmount.value > 0 && amount > totalAmount.value) {
      formError.value = "العربون لا يمكن أن يتجاوز إجمالي السعر.";
      return false;
    }
    if (
      method.value !== PaymentMethod.INSTAPAY &&
      method.value !== PaymentMethod.WALLET
    ) {
      formError.value = "اختر إنستاباي أو المحفظة.";
      return false;
    }
  }
  if (activeStep.value === 1) {
    if (!name.value.trim() || !phone.value.trim()) {
      formError.value = "الاسم ورقم الموبايل مطلوبان.";
      return false;
    }
    if (!studyYearId.value) {
      formError.value = "اختر السنة الدراسية.";
      return false;
    }
  }
  return true;
};

const goNext = () => {
  if (!validateStep()) return;
  activeStep.value += 1;
};

const submit = async () => {
  if (!validateStep() || !props.product) return;
  submitting.value = true;
  formError.value = "";
  try {
    const { data, error } = await nuxtApp.runWithContext(() =>
      PublicReservationCrud.createReservation({
        name: name.value.trim(),
        phone: phone.value.trim(),
        studyYearId: studyYearId.value,
        productId: props.product.id,
        branchId: branchId.value,
        quantity: Number(quantity.value),
        deposit: Number(deposit.value),
      }),
    );
    if (error.value) {
      formError.value = messageFromFetchError(
        error.value,
        "تعذر إرسال طلب الحجز.",
      );
      return;
    }
    const created = readData(data.value);
    success.value = {
      reservationNumber: created?.reservationNumber || "—",
      productName: props.product.name,
      branchName: selectedBranch.value?.label || "—",
      deposit: Number(deposit.value),
      methodLabel: getPaymentMethodLabel(method.value),
    };
  } catch (error) {
    formError.value = messageFromFetchError(error, "تعذر إرسال طلب الحجز.");
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.wizard-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
}

.wizard-steps__item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  border-radius: 999px;
  border: 1px solid var(--app-border);
  background: var(--app-elevated);
  padding: 0.4rem 0.55rem;
  color: var(--app-muted);
}

.wizard-steps__item.is-active,
.wizard-steps__item.is-done {
  border-color: rgb(224 154 58 / 0.45);
  color: var(--app-text-strong);
}

.wizard-steps__index {
  display: inline-flex;
  width: 1.4rem;
  height: 1.4rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--app-border);
  font-size: 0.72rem;
  font-weight: 800;
}

.wizard-steps__item.is-active .wizard-steps__index,
.wizard-steps__item.is-done .wizard-steps__index {
  background: #e09a3a;
  color: #1a1208;
}

.wizard-steps__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.72rem;
  font-weight: 700;
}

@media (max-width: 640px) {
  .wizard-steps__label {
    display: none;
  }

  .wizard-steps__item {
    justify-content: center;
  }
}
</style>
