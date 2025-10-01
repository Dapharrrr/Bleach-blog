 export default async function isAuthenticated(ctx: any, next: () => Promise<any>) {
  if (ctx.state.user) {
    return await next();
  }
  ctx.unauthorized('Vous devez être connecté pour accéder à cette route.');
}