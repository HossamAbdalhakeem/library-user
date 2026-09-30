<template>
  <UserReservationsPageIndex />
</template>

<script setup>
import UserReservationsPageIndex from "~/components/pages/user-reservations/UserReservationsPageIndex.vue";

definePageMeta({ layout: "public" });

const config = useRuntimeConfig();
const route = useRoute();

useDynamicSeo({
  title: () => "حجز المنتجات | بكالوريا وثانوية أونلاين",
  description: () =>
    "تصفّح الكتب والكتيبات والبطاقات، أرسل طلب الحجز، ثم أكمل العربون في الفرع حتى يتم التأكيد.",
  image: "/library-logo.png",
});

const canonicalUrl = computed(() => {
  const base = config.public.siteUrl || "";
  if (!base) return undefined;
  try {
    return new URL(route.fullPath, base).toString();
  } catch {
    return base;
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
