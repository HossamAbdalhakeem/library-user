<template>
  <UserReservationsPageIndex />
</template>

<script setup>
import UserReservationsPageIndex from "~/components/pages/user-reservations/UserReservationsPageIndex.vue";

definePageMeta({ layout: "public" });

const route = useRoute();
const requestUrl = useRequestURL();

useDynamicSeo({
  title: () => "حجز المنتجات | بكالوريا وثانوية أونلاين",
  description: () =>
    "تصفّح الكتب والكتيبات والبطاقات، أرسل طلب الحجز، ثم أكمل العربون في الفرع حتى يتم التأكيد.",
  image: "/library-logo.png",
});

const canonicalUrl = computed(() => {
  try {
    return new URL(route.fullPath, requestUrl.origin).toString();
  } catch {
    return requestUrl.origin;
  }
});

useHead({
  link: computed(() =>
    canonicalUrl.value
      ? [{ rel: "canonical", href: canonicalUrl.value }]
      : [],
  ),
});
</script>
