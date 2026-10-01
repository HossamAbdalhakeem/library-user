<template>
  <div class="space-y-4 text-right">
    <div class="flex flex-col items-center text-center">
      <div
        class="mb-3 flex size-14 items-center justify-center rounded-full bg-emerald-500 text-2xl font-bold text-white"
      >
        ✓
      </div>
      <p class="text-base font-bold text-emerald-700 dark:text-emerald-300">تم تسجيل طلب الحجز</p>
      <p class="mt-1 text-sm text-[var(--app-muted)]">احتفظ برقم الحجز عند التواصل مع الفرع.</p>
    </div>

    <div
      class="rounded-[1.35rem] border border-emerald-500/30 bg-emerald-500/10 px-4 py-6 text-center"
    >
      <p class="text-xs font-medium text-[var(--app-muted)]">رقم الحجز</p>
      <p class="mt-2 break-all text-3xl font-extrabold tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
        {{ reservationNumber || "—" }}
      </p>
      <button
        type="button"
        class="mt-3 text-sm font-semibold text-primary-700 hover:underline dark:text-primary-300"
        @click="copyNumber"
      >
        {{ copied ? "تم نسخ الرقم" : "نسخ الرقم" }}
      </button>
    </div>

    <UserReservationSummaryRows :rows="rows" />
    <p class="rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-3 text-sm leading-6">
      يرجى التواصل مع الفرع لدفع العربون وإرسال صورة الدفع حتى يتم تأكيد الحجز.
      لن يُحجز المنتج من المخزون قبل تأكيد الفرع.
    </p>
  </div>
</template>

<script setup>
import UserReservationSummaryRows from "./UserReservationSummaryRows.vue";

defineOptions({ name: "UserReservationSuccessContent" });

const props = defineProps({
  reservationNumber: { type: String, default: "" },
  rows: { type: Array, default: () => [] },
});

const copied = ref(false);

const copyNumber = async () => {
  const value = String(props.reservationNumber || "").trim();
  if (!value || value === "—") return;
  try {
    await navigator.clipboard.writeText(value);
    copied.value = true;
  } catch {
    copied.value = false;
  }
};
</script>
