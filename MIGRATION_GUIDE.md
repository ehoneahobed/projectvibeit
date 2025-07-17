# Migration Guide: Prisma/PostgreSQL to Mongoose/MongoDB

This guide documents the migration from Prisma with PostgreSQL to Mongoose with MongoDB.

## Changes Made

### 1. Dependencies

**Removed:**
- `@prisma/client`
- `prisma`
- `@auth/prisma-adapter`

**Added:**
- `mongoose`
- `@auth/mongodb-adapter`
- `mongodb`
- `@types/mongoose` (dev dependency)

### 2. Database Configuration

**Before (PostgreSQL):**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/auth_db"
```

**After (MongoDB):**
```env
DATABASE_URL="mongodb://localhost:27017/auth_db"
```

### 3. Database Models

All Prisma models have been converted to Mongoose schemas:

- `User` - User accounts and profiles
- `Account` - OAuth provider accounts
- `Session` - User sessions
- `VerificationToken` - Email verification tokens
- `PasswordResetToken` - Password reset tokens
- `Authenticator` - WebAuthn authenticators

### 4. Database Connection

**Before:** `src/lib/prisma.ts`
**After:** `src/lib/mongoose.ts` and `src/lib/db.ts`

The new connection system includes:
- Connection caching for development
- Automatic reconnection handling
- Connection state management

### 5. Authentication

**Before:** `PrismaAdapter(prisma)`
**After:** `MongoDBAdapter(client)`

The authentication system now uses MongoDB as the backend store.

### 6. API Routes

All API routes have been updated to:
- Use Mongoose models instead of Prisma client
- Include database connection before operations
- Use MongoDB query syntax instead of Prisma syntax

### 7. Query Changes

**Prisma to Mongoose conversions:**

```typescript
// Before (Prisma)
const user = await prisma.user.findUnique({
  where: { email: "user@example.com" },
  select: { id: true, email: true }
})

// After (Mongoose)
const user = await User.findOne(
  { email: "user@example.com" },
  { id: 1, email: 1 }
)
```

```typescript
// Before (Prisma)
await prisma.user.update({
  where: { id: userId },
  data: { name: "New Name" }
})

// After (Mongoose)
await User.updateOne(
  { _id: userId },
  { name: "New Name" }
)
```

```typescript
// Before (Prisma)
await prisma.user.create({
  data: { email: "user@example.com", name: "User" }
})

// After (Mongoose)
await User.create({
  email: "user@example.com",
  name: "User"
})
```

## Setup Instructions

1. **Install MongoDB** locally or use a cloud service like MongoDB Atlas

2. **Update environment variables:**
   ```env
   DATABASE_URL="mongodb://localhost:27017/auth_db"
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Data Migration

If you have existing data in PostgreSQL, you'll need to:

1. Export data from PostgreSQL
2. Transform the data to match the new MongoDB schema
3. Import the data into MongoDB

The exact migration process depends on your data volume and requirements.

## Benefits of MongoDB

- **Flexible Schema:** Easier to add new fields without migrations
- **JSON-like Documents:** Natural fit for JavaScript/TypeScript
- **Horizontal Scaling:** Better for high-traffic applications
- **Rich Query Language:** Powerful aggregation and querying capabilities

## Notes

- All existing functionality has been preserved
- The API endpoints remain the same
- Authentication flows work identically
- Stripe integration continues to work as before

## Troubleshooting

If you encounter issues:

1. Ensure MongoDB is running and accessible
2. Check that the `DATABASE_URL` is correct
3. Verify all dependencies are installed
4. Check the console for connection errors