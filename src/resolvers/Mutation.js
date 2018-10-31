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
  // createDog(parent, args, ctx, info) {
  //   global.dogs = global.dogs || [];
  //   //create a dog
  //   const newDog = {name: args.name };
  //   console.log(args);
  // }
};

module.exports = Mutations;
