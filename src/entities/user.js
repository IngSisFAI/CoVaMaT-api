import client from '../config/db.js';

export const getValidUser = async (InputUser) => {
  let res = false
  await client.connect();
  const result = await client.db("covamatDB").collection("user")
  .findOne({ userName: InputUser.InputUser.userName,
             password: InputUser.InputUser.password
   });
   //console.log('El valor de result ', result, ' entrada ', InputUser)
   if(result){
    res = true
   }
  client.close();
  return res;
}
