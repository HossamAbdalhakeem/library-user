/**
 * useApi - Nuxt-aware request executor.
 * Runs requests with useFetch so they get SSR, payload transfer,
 * hydration dedup, pending, and error state.
 *
 * Usage:
 *   const { request } = useApi();
 *   const { data, pending, error } = request(config);
 *
 * Config comes from a CRUD module:
 *   { endpoint, method, params, body, headers, cache }
 *
 * This catalog is public: no auth token and no organization id.
 * baseURL is runtimeConfig.public.baseUrl (NUXT_ENV_BASE_URL).
 */
export const useApi = () => {
  const config = useRuntimeConfig();

  const request = (requestConfig) => {
    const {
      endpoint,
      method = "GET",
      params = {},
      body,
      headers = {},
    } = requestConfig;

    const requestHeaders = { ...headers };
    const requestParams = { ...params };

    // Stable key => client reuses the SSR payload instead of re-fetching
    const key = [
      "api",
      method,
      endpoint,
      JSON.stringify(requestParams || {}),
      JSON.stringify(body || {}),
    ].join("-");

    // NOT async on purpose: useFetch returns live refs immediately,
    // so `loading` stays reactive (true while the request is in flight).
    // Nuxt still waits for non-lazy useFetch during SSR before rendering.
    const result = useFetch(endpoint, {
      key,
      method,
      params: requestParams,
      headers: requestHeaders,
      ...(body !== undefined ? { body } : {}),
      baseURL: config.public.baseUrl,
      // When the same key is requested twice while a request is still in
      // flight, Nuxt's default dedupe mode "cancel" aborts the in-flight
      // request. "defer" shares that single request between callers.
      dedupe: "defer",
      // Reuse the previously fetched payload on client-side navigations.
      // Pass `cache: false` in the request config to always refetch.
      getCachedData: (cachedKey, nuxtApp) => {
        if (requestConfig.cache === false) return undefined;
        return (
          nuxtApp.payload.data[cachedKey] ?? nuxtApp.static.data[cachedKey]
        );
      },
    });

    return {
      ...result,
      loading: result.pending,
    };
  };

  return { request };
};
