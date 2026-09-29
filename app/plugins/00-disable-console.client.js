/**
 * No-op console in production and demo (no extra env vars; uses build NODE_ENV / PROD).
 */
export default defineNuxtPlugin(() => {
    const isProduction = import.meta.env.PROD;
  
    if (!isProduction) return;
  
    function disableLogs() {
      const noop = () => {};
      // eslint-disable-next-line no-console
      console.log = noop;
      // eslint-disable-next-line no-console
      console.info = noop;
  
      console.warn = noop;
      // eslint-disable-next-line no-console
      console.debug = noop;
  
      console.error = noop;
    }
  
    disableLogs();
  });
  