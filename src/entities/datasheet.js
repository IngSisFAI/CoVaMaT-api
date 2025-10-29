import { ObjectId } from 'mongodb';
import client from '../config/db.js';

const map = (obj) => {
  const variations = []
  if (obj.variations !== undefined) {
    obj.variations.forEach((variation) => {
      if (variation.variables !== undefined) {
        let variables = []
        variation.variables.forEach((variationVariable) => {
          //complex variable that has the pair (var, value array)
          if (variationVariable.valueArray !== undefined) {
            let variablesArrays = []
            variationVariable.valueArray.forEach((valueArrayVariable) => {
              variablesArrays.push({
                var: valueArrayVariable.var
                , value: valueArrayVariable.value
              })
            })
            //simple variable that has the pair (var, value)
            variables.push({ var: variationVariable.var, valueArray: variablesArrays })
          } else {
            variables.push({ var: variationVariable.var, value: variationVariable.value })
          }
        })

        variations.push({ name: variation.name, variables: variables })
      }
    });
  }
  const datasheet = {
    _id: obj._id,
    name: obj.name,
    domain: obj.domain,
    type: obj.type,
    variation_point: obj.variation_point,
    variations: variations
  };
  return datasheet;
}



export const getAllDatasheets = async () => {
  await client.connect();
  const result = client.db("covamatDB").collection("datasheet").find()
  let datasheets = [];
  while (await result.hasNext()) {
    datasheets.push(await result.next())
  }
  client.close();
  return datasheets;
}

// Este metodo retorna todos los dominios distintos que esten cargados en la base de datos
export const getDomains = async () => {
  await client.connect();
  const result = client.db("covamatDB").collection("datasheet").find()
  let domains = [];
  while (await result.hasNext()) {
    const document = await result.next()
    if (!domains.some(objeto => objeto.name === document.domain.name)) {
      domains.push(document.domain)
    }
  }
  client.close();
  return domains;
}

export const getVarietyTypesByDomain = async (domain) => {
  await client.connect();
  const result = client.db("covamatDB").collection("datasheet").find(
    { domain: { name: domain.domain.name } })
  let varietyTypes = [];
  while (await result.hasNext()) {
    const document = await result.next()
    if (!varietyTypes.some(objeto => objeto.name === document.varietyType.name)) {
      varietyTypes.push(document.varietyType)
    }
  }
  client.close();
  return varietyTypes;
}

// Retorna todos los tipos de variedad que esten cargados en la base de datos
export const getAllVarietyTypes = async () => {
  await client.connect();
  const result = client.db("covamatDB").collection("datasheet").find()
  let varietyTypes = [];
  while (await result.hasNext()) {
    const document = await result.next()
    if (!varietyTypes.some(objeto => objeto.name === document.varietyType.name)) {
      varietyTypes.push(document.varietyType)
    }
  }
  client.close();
  return varietyTypes;
}

// retorna los puntos de variacion asociados a ese tipo de variedad
// en todos los dominios
export const getVariationPointsByVarietyTypes = async (varietyType) => {
  await client.connect();
  const result = client.db("covamatDB").collection("datasheet")
    .find({ varietyType: { name: varietyType.varietyType.name } })
  let variationPoints = [];
  while (await result.hasNext()) {
    const document = await result.next()
    if (!variationPoints.some(objeto => objeto.name === document.variationPoint.name)) {
      variationPoints.push(document.variationPoint)
    }
  }
  client.close()
  return variationPoints;
}

// retorna los puntos de variacion asociados a ese tipo de variedad
export const getVariationPointsByVarietyTypeAndDomain = async (varietyType, domain) => {
  await client.connect();
  const result = client.db("covamatDB").collection("datasheet")
    .find({
      domain: { name: domain.name },
      varietyType: { name: varietyType.name }
    })
  let variationPoints = [];
  while (await result.hasNext()) {
    const document = await result.next()
    if (!variationPoints.some(objeto => objeto.name === document.variationPoint.name)) {
      variationPoints.push(document.variationPoint)
    }
  }
  client.close()
  return variationPoints;
}

// obtengo un datasheet basado en dominio, tipo de variedad y punto de variacion
export const getDatasheetByDomainVTVP = async (domain, varietyType, variationPoint) => {
  await client.connect();
  const result = client.db("covamatDB").collection("datasheet")
    .find({
      domain: { name: domain.name },
      varietyType: { name: varietyType.name },
      variationPoint: { name: variationPoint.name }
    })
  let datasheets = [];
  while (await result.hasNext()) {
    datasheets.push(await result.next())
  }
  client.close()
  return datasheets;
}

// obtengo las variaciones de un datasheet basado en dominio, tipo de variedad y punto de variacion
export const getVariationsByDomainVTVP = async (domain, varietyType, variationPoint) => {
  await client.connect();
  const result = client.db("covamatDB").collection("datasheet")
    .find({
      domain: { name: domain.name },
      varietyType: { name: varietyType.name },
      variationPoint: { name: variationPoint.name }
    })
  let variations = [];
  if (result) {
    const document = await result.next()
    variations = document.variations
    //console.log('asi es document: ', document)
  }
  client.close()
  return variations;
}


export const getDatasheetByDomain = async (domain) => {
  await client.connect();
  const result = client.db("covamatDB").collection("datasheet")
    .find({ domain: { name: domain.domain.name } })
  let datasheets = [];
  while (await result.hasNext()) {
    datasheets.push(await result.next())
  }
  client.close()
  return datasheets;
}

export const getDatasheetsByVarietyType = async (varietyType) => {
  await client.connect();
  const result = client.db("covamatDB").collection("datasheet")
    .find({ varietyType: { name: varietyType.varietyType.name } })
  let datasheets = [];
  while (await result.hasNext()) {
    datasheets.push(await result.next())
  }
  client.close()
  return datasheets;
}

export const getDatasheetById = async (id) => {
  await client.connect();
  const result = await client.db("covamatDB").collection("datasheet")
    .findOne({ _id: ObjectId(id.idDatasheet) });
  client.close();
  return result;
}

export const createDatasheet = async (datasheet) => {
  await client.connect();
  const idDatasheet = await (await client.db("covamatDB").collection("datasheet").insertOne(datasheet)).insertedId;
  client.close();
  return idDatasheet;

}

export const addVariations = async (idDatasheet, variations) => {
  await client.connect();
  //get datasheet
  const datasheet = await client.db("covamatDB").collection("datasheet")
    .findOne({ "_id": new ObjectId(idDatasheet) });
  //add variations
  let dsVariations = datasheet.variations || [];

  // validacion de si la variedad ya estaba en la datasheet 
  let isVariationInputInDatasheet = false

  variations.forEach((variation) => { // por cada variacion de entrada
    dsVariations.forEach((datasheetVariation) => { // por cada variacion de la datasheet
      // si la variacion ya se encuentra en la datasheet pongo en true la bandera
      if (datasheetVariation.name === variation.name) {
        isVariationInputInDatasheet = true;
      }
    })
    if (!isVariationInputInDatasheet) {
      dsVariations.push(variation);
    }
  })
  //update datasheet
  //await client.db("covamatDB").collection("datasheet").updateOne({ "_id": new ObjectId(idDatasheet) }, { $set: { "variations": dsVariations } });
  const result = await client.db("covamatDB").collection("datasheet").updateOne({ "_id": new ObjectId(idDatasheet) }, { $set: { "variations": dsVariations } });

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


