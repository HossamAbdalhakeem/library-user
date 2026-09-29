import {
  apiFetch,
  asData,
  asList,
  asPaginated,
  type PaginatedResponse,
} from "~/utils/apiFetch";
import type { ProductSearchResponse } from "~/services/product";
import type { StudyYearResponse } from "~/services/study-year";
import type {
  AppCatalogOption,
  AppProductTypeOption,
  CreatePublicReservationPayload,
  PublicProductSearchQuery,
  PublicReservationResponse,
} from "../types/public-reservation.types";

export const publicReservationApi = {
  /** GET /app-api/products/search */
  async searchProducts(
    params: PublicProductSearchQuery = {},
  ): Promise<PaginatedResponse<ProductSearchResponse>> {
    return asPaginated<ProductSearchResponse>(
      await apiFetch("/app-api/products/search", { method: "GET", params }),
    );
  },

  /** GET /app-api/teachers */
  async getTeachers(): Promise<AppCatalogOption[]> {
    return asList<AppCatalogOption>(
      await apiFetch("/app-api/teachers", { method: "GET" }),
    );
  },

  /** GET /app-api/branches */
  async getBranches(): Promise<AppCatalogOption[]> {
    return asList<AppCatalogOption>(
      await apiFetch("/app-api/branches", { method: "GET" }),
    );
  },

  /** GET /app-api/product-types */
  async getProductTypes(): Promise<AppProductTypeOption[]> {
    return asList<AppProductTypeOption>(
      await apiFetch("/app-api/product-types", { method: "GET" }),
    );
  },

  /** GET /app-api/study-years */
  async getStudyYears(): Promise<StudyYearResponse[]> {
    return asList<StudyYearResponse>(
      await apiFetch("/app-api/study-years", { method: "GET" }),
    );
  },

  /** POST /app-api/reservations */
  async createReservation(
    payload: CreatePublicReservationPayload,
  ): Promise<PublicReservationResponse> {
    return asData<PublicReservationResponse>(
      await apiFetch("/app-api/reservations", {
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
      }),
    );
  },
};
