export interface AuthUser {
  id: number;
  nrdb_id: number;
  nrdb_username: string;
}

class AuthStore {
  user = $state<AuthUser | null>(null);
  isLoading = $state<boolean>(true);

  get isAuthenticated(): boolean {
    return this.user !== null;
  }

  async checkAuth(): Promise<AuthUser | null> {
    this.isLoading = true;
    try {
      const response = await fetch("/api/v1/private/user", {
        headers: {
          Accept: "application/vnd.api+json",
        },
      });

      if (response.ok) {
        const json = await response.json();
        this.user = {
          id: Number(json.data.id),
          nrdb_id: json.data.attributes.nrdb_id,
          nrdb_username: json.data.attributes.nrdb_username,
        };
      } else {
        this.user = null;
      }
    } catch {
      this.user = null;
    } finally {
      this.isLoading = false;
    }

    return this.user;
  }

  redirectToLogin(returnTo?: string) {
    const targetPath = returnTo || (typeof window !== "undefined" ? window.location.pathname : "/tournaments/my");
    if (typeof window !== "undefined") {
      window.location.href = `/login?return_to=${encodeURIComponent(targetPath)}`;
    }
  }
}

export const authStore = new AuthStore();
