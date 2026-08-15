import type { IdentityNames } from "$lib/model/Identity";

declare const Routes: {
  beta_identities_path: () => string;
};

export async function loadIdentityNames() {
  const response = await fetch(Routes.beta_identities_path(), {
    method: "GET",
  });

  return (await response.json()) as IdentityNames;
}
