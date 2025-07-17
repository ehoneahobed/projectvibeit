import { connectDB } from "./db"

export function withDB<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    await connectDB()
    return handler(...args)
  }
}