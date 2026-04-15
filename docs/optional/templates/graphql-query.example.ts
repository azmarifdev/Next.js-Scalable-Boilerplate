import { graphqlRequest } from "@/services/graphql/client";

interface HealthQuery {
  health: {
    status: string;
  };
}

const HEALTH_QUERY = `
  query Health {
    health {
      status
    }
  }
`;

export async function fetchGraphqlHealth(): Promise<string> {
  const data = await graphqlRequest<HealthQuery>(HEALTH_QUERY);
  return data.health.status;
}
