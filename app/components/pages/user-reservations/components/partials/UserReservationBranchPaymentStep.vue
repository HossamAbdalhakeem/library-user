<template>
  <div class="grid gap-4">
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium">الفرع</label>
      <Select
        :model-value="branchId"
        :options="branchOptions"
        option-label="label"
        option-value="value"
        placeholder="اختر الفرع"
        class="w-full"
        @update:model-value="emit('update:branchId', $event)"
      />
      <p v-if="!branchOptions.length" class="text-xs text-red-500">
        لا يوجد فرع متاح لهذا المنتج.
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium">الكمية</label>
      <AppInputNumber
        :model-value="quantity"
        :min="1"
        :use-grouping="false"
        @update:model-value="emit('update:quantity', $event)"
      />
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between gap-2">
        <label class="text-sm font-medium">العربون</label>
        <span v-if="totalAmount > 0" class="text-xs text-[var(--app-muted)]">
          الحد الأقصى {{ formatMoney(totalAmount) }}
        </span>
      </div>
      <AppInputNumber
        :model-value="deposit"
        mode="currency"
        currency="EGP"
        :min="1"
        :max="totalAmount > 0 ? totalAmount : undefined"
        :min-fraction-digits="2"
        @update:model-value="emit('update:deposit', $event)"
      />
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium">طريقة الدفع عند الفرع</label>
      <Select
        :model-value="method"
        :options="paymentOptions"
        option-label="label"
        option-value="value"
        class="w-full"
        @update:model-value="emit('update:method', $event)"
      />
      <p class="text-xs text-[var(--app-muted)]">
        الدفع في الفرع بإنستاباي أو المحفظة، مع صورة التحويل.
      </p>
    </div>
  </div>
</template>

<script setup>
import Select from "primevue/select";
import AppInputNumber from "~/components/shared/inputs/app-input-number/index.vue";
import {
  PaymentMethod,
  PAYMENT_METHOD_LABELS,
} from "~/enums/paymentMethod";
import { formatMoney } from "~/utils/format/money";

defineOptions({ name: "UserReservationBranchPaymentStep" });

defineProps({
  branchId: { default: null },
  quantity: { type: Number, default: 1 },
  deposit: { default: null },
  method: { type: String, default: null },
  branchOptions: { type: Array, default: () => [] },
  totalAmount: { type: Number, default: 0 },
});

const emit = defineEmits([
  "update:branchId",
  "update:quantity",
  "update:deposit",
  "update:method",
]);

const paymentOptions = [PaymentMethod.INSTAPAY, PaymentMethod.WALLET].map(
  (value) => ({
    label: PAYMENT_METHOD_LABELS[value],
    value,
  }),
);
</script>
