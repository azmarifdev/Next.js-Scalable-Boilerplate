export interface ApiSuccess<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
