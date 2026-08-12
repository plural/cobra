// Aids testability by allowing us to mock navigation in tests.
export function navigateTo(url: string) {
  window.location.href = url;
}
