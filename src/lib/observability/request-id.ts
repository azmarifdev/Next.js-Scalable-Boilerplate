export const REQUEST_ID_HEADER = "x-request-id";

export function getOrCreateRequestId(headers: Headers): string {
  const existingId = headers.get(REQUEST_ID_HEADER);
  if (existingId) {
    return existingId;
  }

  return crypto.randomUUID();
}

export function setRequestIdHeader(response: Response, requestId: string): void {
  response.headers.set(REQUEST_ID_HEADER, requestId);
}
