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
  }
  // createDog(parent, args, ctx, info) {
  //   global.dogs = global.dogs || [];
  //   //create a dog
  //   const newDog = {name: args.name };
  //   console.log(args);
  // }
};

module.exports = Mutations;
