export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return
  }

  const publicRoutes = ['/login']
  const { initAuthListener, user } = useFirebaseAuth()

  await initAuthListener()

  if (!user.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  if (user.value && to.path === '/login') {
    return navigateTo('/dashboard')
  }
})
