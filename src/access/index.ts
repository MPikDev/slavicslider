import type { Access, FieldAccess } from 'payload'

type MaybeUser = { id?: string | number; role?: string | null } | null | undefined

export const roleOf = (user: unknown): string | undefined => (user as MaybeUser)?.role ?? undefined

/** Anyone, including logged-out visitors (public website content). */
export const anyone: Access = () => true

/** Any logged-in team member (Admin or Editor). */
export const isStaff: Access = ({ req }) => Boolean(req.user)

/** Admin only. */
export const isAdmin: Access = ({ req }) => roleOf(req.user) === 'admin'

export const isAdminField: FieldAccess = ({ req }) => roleOf(req.user) === 'admin'

/** Admins see everyone, Editors only see/edit their own account. */
export const isAdminOrSelf: Access = ({ req }) => {
  if (!req.user) return false
  if (roleOf(req.user) === 'admin') return true
  return { id: { equals: req.user.id } }
}

/** Standard access for website content that Editors manage. */
export const contentAccess = {
  read: anyone,
  create: isStaff,
  update: isStaff,
  delete: isStaff,
}

/** Hide an admin-only section from the Editor's sidebar. */
export const hiddenFromEditors = ({ user }: { user: unknown }) => roleOf(user) !== 'admin'
