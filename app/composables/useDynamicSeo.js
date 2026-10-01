/**
 * Dynamic Open Graph + Twitter Cards helper.
 *
 * Accepts refs/getters (or plain strings) so the meta tags stay reactive
 * and are rendered on the server during SSR (crawlers read them directly
 * from the HTML).
 *
 * Usage (inside a component/page setup):
 *   useDynamicSeo({
 *     title: () => details.value?.title,
 *     description: () => details.value?.summary,
 *     image: () => details.value?.main_photo?.file_url,
 *     type: 'website',
 *   });
 */
export const useDynamicSeo = (options = {}) => {
  const {
    title,
    description,
    image,
    type = "website",
    twitterCard = "summary_large_image",
    fallbackImage,
  } = options;

  const config = useRuntimeConfig();
  const route = useRoute();
  const requestUrl = useRequestURL();

  // Absolute URL of the current page (request origin + current route path)
  const pageUrl = computed(() => {
    try {
      return new URL(route.fullPath, requestUrl.origin).toString();
    } catch {
      return requestUrl.origin;
    }
  });

  // Make sure the OG image is an absolute URL (crawlers require it).
  // Social crawlers only accept real images (jpg/png/gif/webp) as og:image,
  // so any video URL is rejected and the fallbackImage is used instead.
  // Site assets (paths starting with /) resolve against the current request origin.
  const VIDEO_EXT_RE = /\.(mp4|webm|ogg|ogv|mov|m4v|avi|mkv)(\?.*)?$/i;
  const absoluteImage = computed(() => {
    let img = resolveRefValue(image);
    if (!img || VIDEO_EXT_RE.test(img)) img = resolveRefValue(fallbackImage);
    if (!img || VIDEO_EXT_RE.test(img)) return undefined;
    if (/^https?:\/\//i.test(img)) return img;
    const base = String(img).startsWith("/")
      ? requestUrl.origin
      : config.public.baseUrl || requestUrl.origin;
    if (!base) return undefined;
    try {
      return new URL(img, base).toString();
    } catch {
      return img;
    }
  });

  const resolvedTitle = computed(() => resolveRefValue(title));
  const resolvedDescription = computed(() => resolveRefValue(description));

  useSeoMeta({
    title: resolvedTitle,
    description: resolvedDescription,

    ogTitle: resolvedTitle,
    ogDescription: resolvedDescription,
    ogType: type,
    ogUrl: pageUrl,
    ogImage: absoluteImage,
    ogImageWidth: () => (absoluteImage.value ? 1200 : undefined),
    ogImageHeight: () => (absoluteImage.value ? 630 : undefined),

    twitterCard,
    twitterTitle: resolvedTitle,
    twitterDescription: resolvedDescription,
    twitterImage: absoluteImage,
  });

  // Canonical is handled per-page via useHead. Keep the document Arabic.
  useHead({
    htmlAttrs: {
      lang: "ar",
    },
  });
};

function resolveRefValue(value) {
  if (value == null) return undefined;
  if (isRef(value) || isReactive(value)) {
    const resolved = unref(value);
    return resolved == null ? undefined : String(resolved);
  }
  if (typeof value === "function") {
    try {
      const resolved = value();
      return resolved == null ? undefined : String(resolved);
    } catch {
      return undefined;
    }
  }
  return String(value);
}
