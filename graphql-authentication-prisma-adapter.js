class GraphqlAuthenticationPrismaAdapter {
  constructor(options = {}) {
    this.prismaContextName =
      options && options.prismaContextName ? options.prismaContextName : "db";
  }

  db(ctx) {
    const db = ctx[this.prismaContextName];
    if (!db) {
      throw new Error(
        `The Prisma binding is not attached to the \`${
          this.prismaContextName
        }\` property on your context.`
      );
    }
    return db;
  }

  findUserById(ctx, id, info) {
    return this.db(ctx).user({ id }, info);
  }
  findUserByEmail(ctx, email, info) {
    return this.db(ctx).user({ email: email }, info);
  }
  userExistsByEmail(ctx, email) {
    return this.db(ctx).$exists.user({ email });
  }
  createUser(ctx, data) {
    return this.db(ctx).createUser(data);
  }
  createUserBySignup(ctx, data) {
    return this.createUser(ctx, data);
  }
  createUserByInvite(ctx, data) {
    return this.createUser(ctx, data);
  }
  updateUser(ctx, userId, data) {
    return this.db(ctx).updateUser({
      where: { id: userId },
      data
    });
  }
  updateUserConfirmToken(ctx, userId, data) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserLastLogin(ctx, userId, data) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserPassword(ctx, userId, data) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserResetToken(ctx, userId, data) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserInfo(ctx, userId, data) {
    return this.updateUser(ctx, userId, data);
  }
  updateUserCompleteInvite(ctx, userId, data) {
    return this.updateUser(ctx, userId, data);
  }
}

module.exports = { GraphqlAuthenticationPrismaAdapter };
