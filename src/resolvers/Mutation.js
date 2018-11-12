const bcrypt = require('bcryptjs')

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
        password = password,
        permissions: { set: ['USER']},
      },
    }, info)
    // create the JWT token for them

  },
};

module.exports = Mutations;
