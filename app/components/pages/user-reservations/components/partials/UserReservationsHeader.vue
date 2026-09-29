<template>
  <header
    class="fixed inset-x-0 top-0 z-30 transition-colors duration-300"
    :class="
      headerSolid
        ? 'border-b border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-bg)_88%,transparent)] backdrop-blur-md'
        : 'border-b border-transparent bg-transparent'
    "
  >
    <div
      class="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6"
    >
      <div class="size-12 shrink-0 overflow-hidden rounded-xl">
        <img
          src="/library-logo.png"
          alt="بكالوريا وثانوية أونلاين"
          class="size-full object-cover"
          width="48"
          height="48"
        />
      </div>
      <div class="min-w-0 text-right">
        <p class="truncate text-xs text-primary-700 dark:text-primary-300">
          بكالوريا وثانوية أونلاين
        </p>
        <p class="truncate text-base font-bold text-[var(--app-text-strong)]">
          حجز المنتجات
        </p>
      </div>
    </div>
  </header>
</template>

<script setup>
defineOptions({ name: "UserReservationsHeader" });

const headerSolid = ref(false);

const onScroll = () => {
  headerSolid.value = window.scrollY > 32;
};

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>
