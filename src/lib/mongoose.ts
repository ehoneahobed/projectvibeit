import mongoose, { Mongoose } from "mongoose"

declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null } | undefined;
}

const MONGODB_URI = process.env.DATABASE_URL!

if (!MONGODB_URI) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env.local"
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

async function dbConnect() {
  let cached = global.mongoose
  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
  }
  if (!cached) throw new Error("Failed to initialize mongoose cache")

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect