const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const Mutations = {
  async createItem(parent, args, ctx, info){
    // Todo check if they are logged in

    const item = await ctx.db.mutation.createItem({
      data: {
        ...args
      }
    }, info);

    console.log(item);
    
    return item;
  },
  updateItem(parent, args, ctx, info){
    //first take a copy of the updates 
    const updates = { ...args };
    // remove the ID from the updates 
    delete updates.id;
    //run the update method 
    return ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id
      },
    }, 
    info
    );
  },
 async deleteItem(parent, args, ctx, info){
    const where = { id: args.id};
    // find the item
    const item = await ctx.db.query.item({ where }, `{ id title}`);
    // 2 check if they own that item or have the permissions
    // TODO

    //3 delete it
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info){
    args.email = args.email.toLowerCase();
    // hash their password
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the database
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: { set: ['USER']},
      },
    }, info)
    // create the JWT token for them
    const token = jwt.sign({ userId: user.id}, process.env.APP_SECRET);
    //We set the jwt as a cookie for the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    return user;
  },
  async signin(parents, {email, password}, ctx, info) {
    //1. check if there is a user with that email
    const user = await ctx.db.query.user({ where: {email} });
    if(!user){
      throw new Error(`No user found for email ${email}`);
    }
    //2. check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if(!valid){
      throw new Error('Invalid Password')
    }
    //3. generate the JWT token
    const token = jwt.sign({ userId: user.id}, process.env.APP_SECRET);
    //4. set the cookie with the token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 *60 * 24 * 365,
    })
    //5.return the user
    return user;
  },
  signout(parent, args, ctx, info){
    ctx.response.clearCookie('token')
    return {message: 'Goodbye!'};
  }
,
  async requestReset(parent, args, ctx, info){
    //1. Check if this is is a real user
    const user = await ctx.db.query.user({ where: {email: args.email} });
    if(!user) {
      throw new Error(`No user found for email ${args.email}`);
    }
    //2. Set a reset token and expiry on that user
    const resetToken = (await promisify(randomBytes(20))).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; //1 hoiur from now
    const res = ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry},
    });
    console.log(res);
    //3. email them that reset token

  }
};

module.exports = Mutations;
