import { useApi } from "~/composables/useApi";
import type {
  CreatePublicReservationPayload,
  PublicProductSearchQuery,
} from "../types/public-reservation.types";

type CacheOptions = {
  cache?: boolean;
};

const call = (requestConfig: {
  endpoint: string;
  method: string;
  params?: object;
  body?: object;
  cache?: boolean;
}) => {
  const { request } = useApi();
  const { data, pending, error, loading: _pending, ...rest } = request(requestConfig);
  return { data, error, loading: pending, ...rest };
};

/** Read a list from a raw payload or a `{ data: [] }` envelope. */
export const readList = <T = any>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

/** Read one record from a raw payload or a `{ data }` envelope. */
export const readData = <T = any>(payload: any): T => {
  if (
    payload &&
    typeof payload === "object" &&
    payload.data &&
    !Array.isArray(payload.data)
  ) {
    return payload.data as T;
  }
  return payload as T;
};

/**
 * Public reservation CRUD.
 * Builds the request config and executes it through useApi()
 * (useFetch inside component setup, SSR-friendly).
 *
 * Usage:
 *   const { data, loading, error } = PublicReservationCrud.getTeachers();
 */
export class PublicReservationCrud {
  /** GET /app-api/products/search */
  static searchProducts(
    params: PublicProductSearchQuery = {},
    options: CacheOptions = {},
  ) {
    return call({
      endpoint: "/app-api/products/search",
      method: "GET",
      params,
      cache: options.cache,
    });
  }

  /** GET /app-api/teachers */
  static getTeachers(params = {}) {
    return call({
      endpoint: "/app-api/teachers",
      method: "GET",
      params,
    });
  }

  /** GET /app-api/branches */
  static getBranches(params = {}) {
    return call({
      endpoint: "/app-api/branches",
      method: "GET",
      params,
    });
  }

  /** GET /app-api/study-years */
  static getStudyYears(params = {}) {
    return call({
      endpoint: "/app-api/study-years",
      method: "GET",
      params,
    });
  }

  /** POST /app-api/reservations */
  static createReservation(payload: CreatePublicReservationPayload) {
    return call({
      endpoint: "/app-api/reservations",
      method: "POST",
      body: {
        name: payload.name.trim(),
        phone: payload.phone.trim(),
        studyYearId: payload.studyYearId,
        productId: payload.productId,
        branchId: payload.branchId,
        quantity: Number(payload.quantity || 1),
        deposit: Number(payload.deposit),
      },
      cache: false,
    });
  }
}
