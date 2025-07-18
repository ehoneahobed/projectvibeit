# Roles and Permissions System

This document outlines the role-based access control (RBAC) system implemented in Project Vibe It. The platform uses a hierarchical role system to manage user permissions and access to different features.

## 🎯 Overview

Project Vibe It implements a three-tier role system designed to support both learners and content contributors in an open-source environment. This system ensures that users have appropriate access to platform features while maintaining security and content quality.

## 👥 Role Hierarchy

The platform defines three distinct roles with increasing levels of permissions:

```
Student (Default) → Contributor → Admin
```

### 1. Student Role

**Default role for all new users**

**Permissions:**
- ✅ Access all public courses and lessons
- ✅ Track personal learning progress
- ✅ Submit projects and assignments
- ✅ Participate in community discussions
- ✅ Access personal dashboard
- ✅ View own achievements and statistics
- ✅ Update personal profile and settings

**Access Restrictions:**
- ❌ Cannot access admin portal (`/portal`)
- ❌ Cannot create or edit course content
- ❌ Cannot manage other users
- ❌ Cannot view platform analytics

**Use Cases:**
- Primary role for learners using the platform
- Self-paced learning with progress tracking
- Community participation and project sharing

### 2. Contributor Role

**Intermediate role for content creators and community moderators**

**Permissions:**
- ✅ All Student permissions
- ✅ Access admin portal (`/portal`)
- ✅ Create and edit course content
- ✅ Manage course modules and lessons
- ✅ Moderate community discussions
- ✅ Review and approve project submissions
- ✅ Access course management features
- ✅ View course-specific analytics

**Access Restrictions:**
- ❌ Cannot manage user accounts
- ❌ Cannot access platform-wide analytics
- ❌ Cannot modify system settings
- ❌ Cannot assign roles to other users

**Use Cases:**
- Content creators writing lessons and courses
- Community moderators managing discussions
- Course maintainers updating curriculum
- Project reviewers and mentors

### 3. Admin Role

**Highest privilege level for platform administrators**

**Permissions:**
- ✅ All Contributor permissions
- ✅ Full access to admin portal (`/portal`)
- ✅ Manage all user accounts and roles
- ✅ Access platform-wide analytics
- ✅ Modify system settings and configuration
- ✅ Assign roles to other users
- ✅ Manage platform features and integrations
- ✅ View comprehensive user progress data
- ✅ Access achievement and statistics management

**Access Restrictions:**
- None (full platform access)

**Use Cases:**
- Platform administrators and maintainers
- System configuration and maintenance
- User management and support
- Analytics and reporting
- Content strategy and platform direction

## 🔐 Permission Matrix

| Feature | Student | Contributor | Admin |
|---------|---------|-------------|-------|
| **Learning Platform** |
| Access courses | ✅ | ✅ | ✅ |
| Track progress | ✅ | ✅ | ✅ |
| Submit projects | ✅ | ✅ | ✅ |
| Community discussions | ✅ | ✅ | ✅ |
| Personal dashboard | ✅ | ✅ | ✅ |
| **Content Management** |
| Create/edit courses | ❌ | ✅ | ✅ |
| Manage lessons | ❌ | ✅ | ✅ |
| Review projects | ❌ | ✅ | ✅ |
| **User Management** |
| View other users | ❌ | ❌ | ✅ |
| Manage user roles | ❌ | ❌ | ✅ |
| User analytics | ❌ | ❌ | ✅ |
| **Platform Administration** |
| System settings | ❌ | ❌ | ✅ |
| Platform analytics | ❌ | ❌ | ✅ |
| Feature management | ❌ | ❌ | ✅ |

## 🛠️ Technical Implementation

### Database Schema

User roles are stored in the MongoDB User model:

```typescript
interface IUser {
  role: "student" | "contributor" | "admin"
  // ... other fields
}
```

### Role Validation

The platform uses middleware to validate role-based access:

```typescript
// Check admin access
export async function checkAdminAuth() {
  // Validates user has admin role
}

// Check contributor or admin access
export async function checkContributorAuth() {
  // Validates user has contributor or admin role
}
```

### Menu System

The admin portal menu dynamically filters based on user roles:

```typescript
export function getFilteredMenuItems(userRole: string | null): MenuItem[] {
  // Returns only menu items user can access
}
```

## 🚀 Managing Roles

### For Administrators

#### Assigning Roles via Scripts

The platform includes utility scripts for role management:

**Create an Admin User:**
```bash
pnpm run create-admin
```

**Create a Contributor User:**
```bash
pnpm run create-contributor
```

#### Manual Role Assignment

You can also assign roles directly in the database:

```javascript
// Using MongoDB shell
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "contributor" } }
)
```

### For Contributors

Contributors can:
- Create and edit course content
- Moderate community discussions
- Review project submissions
- Access course management tools

### Role Promotion Process

1. **Student → Contributor**: 
   - Demonstrate content creation skills
   - Submit quality contributions
   - Get approval from existing contributors/admins

2. **Contributor → Admin**:
   - Show platform management capabilities
   - Demonstrate community leadership
   - Get approval from existing admins

## 🔒 Security Considerations

### Authentication Flow

1. **Session Validation**: All admin routes validate user sessions
2. **Role Verification**: Routes check specific role requirements
3. **Redirect Handling**: Unauthorized users are redirected appropriately
4. **API Protection**: All admin APIs validate role permissions

### Best Practices

- **Principle of Least Privilege**: Users get minimum permissions needed
- **Role Hierarchy**: Clear permission escalation path
- **Audit Trail**: All role changes should be logged
- **Regular Review**: Periodically review role assignments

## 📋 API Endpoints

### Role Checking

```
GET /api/auth/check-role
```

Returns the current user's role for frontend validation.

### Protected Routes

All admin portal routes (`/portal/*`) are protected by role-based middleware:

- `/portal` - Dashboard (any authenticated user)
- `/portal/courses/*` - Course management (contributor+)
- `/portal/users/*` - User management (admin only)
- `/portal/analytics/*` - Analytics (admin only)
- `/portal/community/*` - Community management (contributor+)
- `/portal/settings` - System settings (admin only)

## 🎯 Contributing to Role System

### Adding New Roles

To add a new role:

1. **Update User Model** (`src/lib/models/User.ts`):
   ```typescript
   role: { 
     type: String, 
     enum: ["student", "contributor", "admin", "new-role"], 
     default: "student" 
   }
   ```

2. **Update Auth Functions** (`src/lib/auth/admin-auth.ts`):
   ```typescript
   export function canAccessFeature(userRole: string | null, feature: string) {
     // Add new role logic
   }
   ```

3. **Update Menu System** (`src/lib/menu-data.ts`):
   ```typescript
   requiredRole?: 'admin' | 'contributor' | 'new-role' | 'any'
   ```

4. **Create Migration Script** for existing users

### Adding New Permissions

1. **Define Permission** in auth functions
2. **Update Menu Items** with required roles
3. **Add Route Protection** in layout components
4. **Update Documentation** (this file)

## 🤝 Community Guidelines

### Role Assignment Philosophy

- **Merit-based**: Roles are assigned based on contributions and skills
- **Transparent**: Clear criteria for role promotion
- **Community-driven**: Existing role holders participate in decisions
- **Reversible**: Roles can be adjusted based on behavior

### Contributor Expectations

Contributors should:
- Maintain high content quality standards
- Be responsive to community feedback
- Follow platform guidelines and best practices
- Help mentor and support other contributors

### Admin Responsibilities

Admins should:
- Maintain platform stability and security
- Foster a positive community environment
- Make fair and consistent decisions
- Document platform changes and decisions

## 📞 Support and Questions

For questions about roles and permissions:

- **GitHub Issues**: Create an issue with the `roles` label
- **Discord**: Ask in the #roles-and-permissions channel
- **Email**: admin@projectvibeit.com

## 📝 Changelog

### Version 1.0.0
- Initial role system implementation
- Three-tier hierarchy: Student, Contributor, Admin
- Role-based menu filtering
- Protected admin portal routes
- Utility scripts for role management

---

**Last Updated**: December 2024  
**Maintained by**: Project Vibe It Admin Team 