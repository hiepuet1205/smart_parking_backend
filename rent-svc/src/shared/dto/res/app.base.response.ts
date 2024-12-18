export interface AppResponseSuccessDto {
  data: any;
}

export interface AppResponseErrorDto {
  error: any;
}

export interface PaginationMeta {
  totalRecords: number;
  page: number;
  items: number;
}

export interface PaginationResponseDto extends AppResponseSuccessDto {
  meta: PaginationMeta;
}

export interface FieldError {
  resource: string;
  field: string;
  message: string;
}

export interface FieldErrorsResponseDto {
  errors: FieldError[];
}
