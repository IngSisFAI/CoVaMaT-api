import { getValidUser} from '../entities/user.js';

  const resolvers = {
    Query: {
      getValidUser: (_, InputUser, { }) => {
        return getValidUser(InputUser);
      },
    },
  };
  
  export default resolvers;