<template>
  <div class="flex w-full justify-between gap-2">
    <Button v-if="success" label="إغلاق" @click="emit('close')" />
    <template v-else>
      <Button
        label="رجوع"
        severity="secondary"
        text
        :disabled="activeStep === 0 || submitting"
        @click="emit('back')"
      />
      <Button
        v-if="activeStep < 2"
        label="التالي"
        :disabled="submitting"
        @click="emit('next')"
      />
      <Button
        v-else
        label="إرسال الطلب"
        :loading="submitting"
        @click="emit('submit')"
      />
    </template>
  </div>
</template>

<script setup>
import Button from "primevue/button";

defineOptions({ name: "UserReservationWizardFooter" });

defineProps({
  success: { type: Boolean, default: false },
  activeStep: { type: Number, default: 0 },
  submitting: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "back", "next", "submit"]);
</script>
