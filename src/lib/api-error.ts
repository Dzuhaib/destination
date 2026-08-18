export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code = "upstream_error",
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const publicErrorMessage = (error: unknown) =>
  error instanceof ApiError && error.status === 404
    ? error.message
    : "The store is temporarily unavailable. Please try again shortly.";
