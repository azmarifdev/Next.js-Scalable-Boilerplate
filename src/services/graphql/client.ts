import { assertExternalApiBaseUrlConfigured, getGraphqlEndpoint } from "@/lib/config/runtime";
import { ApiClientError } from "@/lib/errors/api-error";

interface GraphqlError {
  message: string;
}

interface GraphqlResponse<T> {
  data?: T;
  errors?: GraphqlError[];
}

export async function graphqlRequest<TData, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables
): Promise<TData> {
  assertExternalApiBaseUrlConfigured();
  const response = await fetch(getGraphqlEndpoint(), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, variables })
  });

  const payload = (await response.json()) as GraphqlResponse<TData>;

  if (!response.ok) {
    throw new ApiClientError(
      payload.errors?.[0]?.message ?? "GraphQL request failed",
      response.status
    );
  }

  if (payload.errors?.length) {
    throw new ApiClientError(payload.errors[0].message, response.status);
  }

  if (!payload.data) {
    throw new ApiClientError("GraphQL response returned no data", response.status);
  }

  return payload.data;
}
