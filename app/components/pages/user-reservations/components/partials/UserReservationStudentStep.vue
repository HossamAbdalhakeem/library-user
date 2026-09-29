<template>
  <div class="grid gap-4">
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium">الاسم</label>
      <InputText
        :model-value="name"
        class="w-full"
        @update:model-value="emit('update:name', $event)"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium">رقم الموبايل</label>
      <InputText
        :model-value="phone"
        class="w-full"
        inputmode="tel"
        @update:model-value="emit('update:phone', $event)"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium">السنة الدراسية</label>
      <Select
        :model-value="studyYearId"
        :options="studyYears"
        option-label="name"
        option-value="id"
        placeholder="اختر السنة الدراسية"
        class="w-full"
        :loading="loading"
        @update:model-value="emit('update:studyYearId', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import InputText from "primevue/inputtext";
import Select from "primevue/select";

defineOptions({ name: "UserReservationStudentStep" });

defineProps({
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  studyYearId: { default: null },
  studyYears: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["update:name", "update:phone", "update:studyYearId"]);
</script>
