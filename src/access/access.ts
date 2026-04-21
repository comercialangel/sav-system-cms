// src/access/roles.ts
import type { Access } from 'payload'

/**
 * Función central para verificar si un usuario tiene el rol de Administrador.
 * Lee la relación 'rolcollaborator' de forma segura.
 */
export const checkIsAdmin = (user: any): boolean => {
  if (!user || !user.rolcollaborator) return false

  return user.rolcollaborator.some((rol: any) => {
    if (typeof rol === 'object' && rol !== null) {
      // Asegúrate de que el nombre coincida con tu BD
      return rol.name === 'Administrador' || rol.name === 'Admin'
    }
    return false
  })
}

/**
 * REGLA 1: Solo permite el acceso a Administradores.
 * Útil para proteger colecciones enteras o funciones de borrado.
 */
export const isAdmin: Access = ({ req: { user } }) => {
  return checkIsAdmin(user)
}

/**
 * REGLA 2: Permite el acceso a Administradores o al propietario del documento.
 * Muy útil para la colección de usuarios (leer/editar el propio perfil).
 */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (checkIsAdmin(user)) return true

  return {
    id: {
      equals: user.id,
    },
  }
}

/**
 * REGLA 3: Permite el acceso a cualquier usuario que haya iniciado sesión.
 * Útil para colecciones de lectura general (ej. ver el inventario).
 */
export const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}
