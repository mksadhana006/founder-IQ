/**
 * modules/adminDashboard/index.js
 *
 * TODO: V2 — Admin Dashboard Module
 *
 * Features to implement:
 *   - User management (view, ban, promote to admin)
 *   - Platform-wide analytics (total users, validations, scores)
 *   - API usage monitoring (Gemini, Tavily costs)
 *   - Flag and moderate public startup ideas
 *   - Announcement/broadcast system
 *   - Feature flag management
 *
 * Access Control:
 *   - All admin routes must use restrictTo('admin') middleware
 *
 * Routes:
 *   GET    /api/admin/users
 *   GET    /api/admin/users/:id
 *   PATCH  /api/admin/users/:id/role
 *   DELETE /api/admin/users/:id
 *   GET    /api/admin/analytics
 *   GET    /api/admin/startups  (all startups platform-wide)
 *   POST   /api/admin/announcements
 */

module.exports = {};
