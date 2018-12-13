 const { forwardTo } = require('prisma-binding');
 const { hasPermissions } = require('../utils')

 const Query = {
   items: forwardTo('db'),
   item: forwardTo('db'),
   itemsConnection: forwardTo('db'),
   me(parent, args, ctx, info) {
     //check if there is a current user ID
     if(!ctx.request.userId){
       return null;
     }
     return ctx.db.query.user({
       where: {id: ctx.request.userId},
     }, info);
   },
   async users(parent, args, ctx, info) {
     //1. CHeck if they are logged in 
      if(!ctx. request.userId){
        throw new Error('You must be logged in')
      }
     //2. check if user has the permissions to query all users
      hasPermissions(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
     //3. if they do, query all the users!
     return ctx.db.users({}, info);
   },
};

module.exports = Query;
