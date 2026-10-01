import type { PaymentMethod } from "~/enums/paymentMethod";
import type { ProductSearchResponse } from "~/services/product";
import type { ReservationResponse } from "~/services/reservation";
import type { StudyYearResponse } from "~/services/study-year";

export type AppCatalogOption = {
  id: string;
  name: string;
};

/** GET /app-api/products/search query. */
export type PublicProductSearchQuery = {
  page?: number;
  per_page?: number;
  product?: string;
  teacherId?: string;
  branchId?: string;
  studyYearId?: string;
};

export type PublicProductSearchResponse = ProductSearchResponse;
export type PublicStudyYearResponse = StudyYearResponse;

/** POST /app-api/reservations body. Payment method is confirmed later by the branch. */
export type CreatePublicReservationPayload = {
  name: string;
  phone: string;
  studyYearId: string;
  productId: string;
  branchId: string;
  quantity: number;
  deposit: number;
};

export type PublicReservationResponse = ReservationResponse & {
  depositAmount?: number;
};

export type ConfirmReservationPayload = {
  method: PaymentMethod;
  proofReference?: string;
};
