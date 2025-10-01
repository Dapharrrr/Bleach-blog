 export default async function isOwner(ctx: any, next: () => Promise<any>) {
  const { id } = ctx.params;
  const user = ctx.state.user;

  const entity = await strapi.db.query('api::article.article').findOne({
    where: { id },
    populate: ['author'],
  });

  if (!entity || entity.author.id !== user.id) {
    return ctx.unauthorized('Vous ne pouvez modifier ou supprimer que vos propres articles.');
  }

  return await next();
}