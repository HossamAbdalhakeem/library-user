<template>
  <section class="hero relative flex min-h-dvh w-full flex-col overflow-hidden text-[var(--app-text-strong)]">
    <div class="hero__wash pointer-events-none absolute inset-0" aria-hidden="true" />
    <div class="hero__grid pointer-events-none absolute inset-0" aria-hidden="true" />
    <span class="hero__orb hero__orb--a" aria-hidden="true" />
    <span class="hero__orb hero__orb--b" aria-hidden="true" />
    <span class="hero__orb hero__orb--c" aria-hidden="true" />

    <img
      v-for="piece in pieces"
      :key="piece.src"
      :src="piece.src"
      alt=""
      class="hero__piece pointer-events-none absolute hidden object-contain xl:block"
      :class="piece.className"
    />

    <div
      class="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-8 pt-24 sm:px-6 sm:pt-28"
    >
      <div class="flex flex-1 flex-col items-center justify-center text-center">
        <div class="hero__logo">
          <img
            src="/library-logo.png"
            alt="بكالوريا وثانوية أونلاين"
            class="size-24 object-cover sm:size-32"
            width="128"
            height="128"
          />
        </div>

        <p class="mt-6 text-xs font-semibold tracking-[0.28em] text-primary-700 dark:text-primary-200">
          حجز بدون تسجيل دخول
        </p>
        <h1 class="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
          احجز <span class="text-primary-600 dark:text-primary-400">منتجك</span> من المكتبة
        </h1>
        <p class="mt-4 max-w-xl text-sm leading-7 text-[var(--app-muted)] sm:text-base dark:text-neutral-300">
          تصفّح الكتب والكتيبات والبطاقات، أرسل طلب الحجز، ثم أكمل العربون في الفرع حتى يتم التأكيد.
        </p>
        <button type="button" class="hero__cta" @click="scrollToCatalog">تصفح المنتجات</button>
      </div>

      <ol class="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
        <li v-for="step in steps" :key="step.title" class="hero__step">
          <span class="hero__step-index">{{ step.index }}</span>
          <span class="min-w-0">
            <span class="block text-sm font-bold sm:text-base">{{ step.title }}</span>
            <span class="mt-1 hidden text-xs leading-5 text-[var(--app-muted)] sm:block dark:text-neutral-300">
              {{ step.body }}
            </span>
          </span>
        </li>
      </ol>

      <button type="button" class="hero__cue" aria-label="الانتقال إلى المنتجات" @click="scrollToCatalog">
        <span class="hero__cue-chevron" aria-hidden="true" />
      </button>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: "UserReservationsHero" });

const steps = [
  {
    index: "١",
    title: "اختر المنتج",
    body: "صفِّ حسب المدرس أو السنة أو الفرع ثم اختر ما تريد.",
  },
  {
    index: "٢",
    title: "أرسل الطلب",
    body: "أدخل بياناتك ومبلغ العربون لتحصل على رقم الحجز.",
  },
  {
    index: "٣",
    title: "أكمل في الفرع",
    body: "ادفع العربون وأرسل صورة الدفع حتى يؤكد الفرع الحجز.",
  },
];

const pieces = [
  { src: "/images/catalog/book.png", className: "hero__piece--book" },
  { src: "/images/catalog/booklet.png", className: "hero__piece--booklet" },
  { src: "/images/catalog/card.png", className: "hero__piece--card" },
];

const scrollToCatalog = () => {
  document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
};
</script>

<style scoped>
.hero__wash {
  background:
    radial-gradient(90% 70% at 80% 0%, rgb(245 175 82 / 0.28), transparent 55%),
    radial-gradient(70% 60% at 10% 90%, rgb(224 154 58 / 0.18), transparent 50%),
    linear-gradient(165deg, #fff8f0 0%, #faf6f1 42%, #f4f4f5 100%);
}

:global(.app-dark .hero__wash) {
  background:
    radial-gradient(90% 70% at 80% 0%, rgb(245 175 82 / 0.34), transparent 52%),
    radial-gradient(70% 55% at 8% 100%, rgb(188 125 44 / 0.28), transparent 48%),
    linear-gradient(165deg, #120e09 0%, #070707 46%, #000 100%);
}

.hero__grid {
  background-image:
    linear-gradient(rgb(245 175 82 / 0.14) 1px, transparent 1px),
    linear-gradient(90deg, rgb(245 175 82 / 0.14) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse at 50% 40%, black 15%, transparent 72%);
  opacity: 0.45;
}

:global(.app-dark .hero__grid) {
  opacity: 0.22;
}

.hero__orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(48px);
  pointer-events: none;
}

.hero__orb--a {
  top: -4rem;
  right: -3rem;
  width: 22rem;
  height: 22rem;
  background: rgb(245 175 82 / 0.28);
  animation: hero-orb 11s ease-in-out infinite;
}

.hero__orb--b {
  bottom: 8%;
  left: -4rem;
  width: 18rem;
  height: 18rem;
  background: rgb(245 175 82 / 0.16);
  animation: hero-orb 13s ease-in-out infinite reverse;
}

.hero__orb--c {
  top: 38%;
  left: 42%;
  width: 10rem;
  height: 10rem;
  background: rgb(255 255 255 / 0.08);
  animation: hero-orb 9s ease-in-out 1s infinite;
}

.hero__piece {
  width: 11rem;
  filter: drop-shadow(0 24px 40px rgb(0 0 0 / 0.35));
  opacity: 0.9;
}

.hero__piece--book {
  top: 18%;
  left: 4%;
  animation: hero-drift 9s ease-in-out infinite;
}

.hero__piece--booklet {
  right: 6%;
  bottom: 22%;
  width: 9rem;
  animation: hero-drift 11s ease-in-out infinite reverse;
}

.hero__piece--card {
  top: 22%;
  right: 8%;
  width: 8rem;
  animation: hero-drift 10s ease-in-out 0.6s infinite;
}

.hero__logo {
  display: inline-flex;
  overflow: hidden;
  border-radius: 1.75rem;
  border: 1px solid rgb(245 175 82 / 0.45);
  background: #fff;
  padding: 0.7rem;
  box-shadow:
    0 0 0 8px rgb(245 175 82 / 0.08),
    0 0 80px -12px rgb(245 175 82 / 0.85);
}

.hero__cta {
  margin-top: 1.5rem;
  border-radius: 9999px;
  background: #e09a3a;
  padding: 0.8rem 1.6rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #171717;
  box-shadow: 0 12px 30px -12px rgb(245 175 82 / 0.9);
  transition: transform 200ms ease, background-color 200ms ease;
}

.hero__cta:hover {
  background: #f5af52;
  transform: translateY(-1px);
}

.hero__step {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  border-radius: 1.25rem;
  border: 1px solid rgb(245 175 82 / 0.22);
  background: rgb(255 255 255 / 0.62);
  padding: 0.75rem;
  text-align: right;
  backdrop-filter: blur(16px);
}

:global(.app-dark .hero__step) {
  border-color: rgb(255 255 255 / 0.1);
  background: rgb(0 0 0 / 0.38);
}

.hero__step-index {
  display: inline-flex;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: #e09a3a;
  font-size: 0.8rem;
  font-weight: 800;
  color: #171717;
}

.hero__cue {
  margin-top: 1.25rem;
  display: flex;
  justify-content: center;
  background: transparent;
  color: inherit;
}

.hero__cue-chevron {
  width: 0.7rem;
  height: 0.7rem;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
  animation: hero-cue 1.6s ease-in-out infinite;
}

@keyframes hero-orb {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(0, -18px, 0) scale(1.06);
  }
}

@keyframes hero-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(-8deg);
  }
  50% {
    transform: translate3d(0, -18px, 0) rotate(-2deg);
  }
}

@keyframes hero-cue {
  0%,
  100% {
    transform: translateY(0) rotate(45deg);
    opacity: 0.45;
  }
  50% {
    transform: translateY(6px) rotate(45deg);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__orb,
  .hero__piece,
  .hero__cue-chevron {
    animation: none;
  }
}
</style>
