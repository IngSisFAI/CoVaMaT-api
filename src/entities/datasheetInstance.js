import { ObjectId } from 'mongodb';
import client from '../config/db.js';


  const map = (obj) => {
    const datasheetInstance = {
      _id: obj._id,
      id_datasheet: obj.id_datasheet,
      name: obj.name,
      domain: obj.domain,
      variationPoint: obj.variationPoint,
      varietyType: obj.varietyType,
      variations: obj.variations
  };
  return datasheetInstance;
}

export const getDatasheetsInstances = async () => {
  await client.connect();
  const result = client.db("covamatDB").collection("datasheetInstance").find()
  let datasheetsInstances = [];
  while (await result.hasNext()){
    datasheetsInstances.push(map(await result.next()))
  }
  client.close();
  return datasheetsInstances;
}

export const getDatasheetInstancesById = async (ids) => {
  await client.connect();
  const datasheetInstances = []
  for(var i =0; i<ids.length; i++){
    const result = await client.db("covamatDB").collection("datasheetInstance")
    .findOne({"_id": new ObjectId(ids[i])})
    datasheetInstances.push(result);
  }
  client.close();
  return datasheetInstances;
}

export const getDatasheetInstancesByIdAndContextType = async (ids) => {
  //await client.connect();
  const datasheetInstances = []
  for(var i =0; i<ids.length; i++){
    const result = await client.db("covamatDB").collection("datasheetInstance")
    .findOne({"_id": new ObjectId(ids[i]), varietyType: {name: "contexto"}})
    if(result!==null){
      datasheetInstances.push(result);
    }
  }
  //client.close();
  return datasheetInstances;
}

export const createDatasheetInstance = async (inputDatasheet) => {
  await client.connect();
  const idDatasheetInstance = await (await client.db("covamatDB").collection("datasheetInstance").insertOne(inputDatasheet)).insertedId;
  client.close();
  return idDatasheetInstance;
}

export const addVariationsToInstance = async (idDatasheet, variations) => {
  //console.log('la entrada es: ', idDatasheet, variations)
  await client.connect();
  //get datasheet
  const datasheet = await client.db("covamatDB").collection("datasheetInstance")
    .findOne({ "_id": new ObjectId(idDatasheet) });
  //add variations
  let dsVariations = datasheet.variations || [];
  variations.forEach((variation) => {
    dsVariations.push(variation);
  })
  //update datasheet
  //await client.db("covamatDB").collection("datasheet").updateOne({ "_id": new ObjectId(idDatasheet) }, { $set: { "variations": dsVariations } });
  const result = await client.db("covamatDB").collection("datasheetInstance").updateOne({ "_id": new ObjectId(idDatasheet) }, { $set: { "variations": dsVariations } });
  
  //console.log('El resultado es: ', result);

  //retrieve updated datasheet
  //const datasheetUpdated = await client.db("covamatDB").collection("datasheet").findOne({ "_id": new ObjectId(idDatasheet) });

  if (result.modifiedCount > 0) {
    //console.log('El datasheet se actualizó correctamente');
    return true;
  } else {
    //console.log('El datasheet no se actualizó');
    return false;
  }
}