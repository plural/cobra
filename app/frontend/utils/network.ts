export interface ApiResponse<T> {
  data: {
    id: string;
    type: string;
    attributes: T;
  }[];
  links: {
    self: string;
    first?: string;
    last?: string;
    next?: string;
    prev?: string;
  };
  meta: {
    stats: {
      total: {
        count: number;
      }
    }
  };
}

export function csrfToken() {
  return (
    document
      .querySelector("meta[name='csrf-token']")
      ?.getAttribute("content") ?? ""
  );
}
