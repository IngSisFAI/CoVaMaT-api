import { ObjectId } from 'mongodb';
import client from '../config/db.js';
import _ from 'lodash';
import { getDatasheetInstancesByIdAndContextType } from './datasheetInstance.js'


const map = (obj) => {
  const studyCase = {
    _id: obj._id,
    name: obj.name,
    domain: obj.domain,
    description: obj.description,
    variety: obj.variety
  };
  return studyCase;
}

export const getCases = async () => {
  await client.connect();
  const result = client.db("covamatDB").collection("case").find()
  let cases = [];
  while (await result.hasNext()) {
    cases.push(await result.next())
  }
  client.close();
  return cases;

}
/*
export const getCasesSimilarToReuseCase = async (reuseCase) => {
  const reuseCaseContext = reuseCase['reuseCase']['context'];
  await client.connect();
  //get cases with the same domain as reuse case
  const result = client.db("covamatDB").collection("case").find({ domain: { name: reuseCase['reuseCase']['domain']['name'] } })
  var similarCases = [];
  while (await result.hasNext()) {
    //for each case we have to check whether the reuse case context
    //is equals to the context of the case
    const actualCase = await result.next();
    //get the array of ids of ds instances
    let datasheetInstancesIds = actualCase['variety'];
    //get the context ds instances of the case
    //console.log('id caso ', actualCase['_id'], ' muestro las datasheets instances ids ', datasheetInstancesIds)
    const caseContextVariety = await getDatasheetInstancesByIdAndContextType(datasheetInstancesIds);
    if (caseContextVariety.length > 0) {
      // we have to check if every context variety of the case appeears in the
      //context of the reuse case
      var i = 0;
      //variable to break the loop if the case we are looking into
      //has a context variety that the reuse case doesn't
      var matches = true;
      while (i < caseContextVariety.length && matches) {
        //extract the variation point and variations in an object
        //to check exact appearence in the reuse case context array
        const variationPointAndVariations = {
          variationPoint: caseContextVariety[i]['variationPoint'],
          variations: caseContextVariety[i]['variations']
        };
        //console.log("Punto de variacion + variaciones del caso " + actualCase['_id'] + " "  + JSON.stringify(variationPointAndVariations))
        //findIndex checks if the extracted object appears in the context array of reuseObject
        //returns the index if exists, -1 otherwise
        if (_.findIndex(reuseCaseContext, variationPointAndVariations) == -1) {
          //this context variety of the case is not present in the context array of reuse object.
          matches = false;
          //console.log("No encontro la variedad en este caso. " + JSON.stringify(reuseCaseContext) )
        }
        i++;
      }
      if (matches) {
        //all of the case variety matched with the reuse case
        similarCases.push(actualCase)
      }
    }
  }
  client.close();
  return similarCases;
}
*/

export const getCasesSimilarToReuseCase = async (reuseCase) => {
  const reuseCaseContext = reuseCase['reuseCase']['context'];
  await client.connect();
  const result = client.db("covamatDB").collection("case").find({ 
    domain: { name: reuseCase['reuseCase']['domain']['name'] } 
  });
  
  const similarCases = [];
  
  while (await result.hasNext()) {
    const actualCase = await result.next();
    const datasheetInstancesIds = actualCase['variety'];
    const caseContextVariety = await getDatasheetInstancesByIdAndContextType(datasheetInstancesIds);
    
    if (caseContextVariety.length > 0) {
      let allVariationsExist = true;
      
      // Verificar cada variationPoint en reuseCaseContext
      for (const reuseItem of reuseCaseContext) {
        // Buscar el variationPoint correspondiente en el caso actual
        const caseVariationPoint = caseContextVariety.find(
          item => item.variationPoint.name === reuseItem.variationPoint.name
        );
        
        if (!caseVariationPoint) {
          // Si no existe el variationPoint, no es un caso similar
          allVariationsExist = false;
          break;
        }
        
        // Verificar que todas las variaciones de reuseItem estén en caseVariationPoint
        const allVariationsMatch = reuseItem.variations.every(reuseVariation => 
          caseVariationPoint.variations.some(
            caseVariation => caseVariation.name === reuseVariation.name
          )
        );
        
        if (!allVariationsMatch) {
          allVariationsExist = false;
          break;
        }
      }
      
      if (allVariationsExist) {
        similarCases.push(actualCase);
      }
    }
  }
  
  client.close();
  return similarCases;
};

export const createCase = async (inputCase) => {
  await client.connect();
  //console.log('inputCase: ', inputCase)
  const idCase = await (await client.db("covamatDB").collection("case").insertOne(inputCase)).insertedId;
  client.close();
  return idCase;
}

export const addDatasheetInstancesToCase = async (idCase, variations) => {
  //console.log('Entrada del metodo', idCase, ' ', variations)
  await client.connect();
  //get datasheet
  const oneCase = await client.db("covamatDB").collection("case").findOne({ "_id": new ObjectId(idCase) });
  //add variations

  let dsVariations = oneCase.variety || [];
  variations.forEach((variation) => {
    dsVariations.push(variation);
  })

  let result = [];
  //update datasheet
  if (variations && variations.length > 0) {
    result = await client.db("covamatDB").collection("case")
      .updateOne({ "_id": new ObjectId(idCase) }, { $set: { "variety": dsVariations } });

  }
  client.close();
  if (result.modifiedCount > 0) {
    //console.log('El datasheet se actualizó correctamente');
    return true;
  } else {
    //console.log('El datasheet no se actualizó');
    return false;
  }
}
/*
export const isDatasheetInstanceInCase = async (idCase, datasheetInstance) => {
  await client.connect();
  //get datasheet
  const oneCase = await client.db("covamatDB").collection("case")
    .findOne({ "_id": new ObjectId(idCase) });

  let result = false;
  let dsVariations = oneCase.variety;
  dsVariations.forEach(async (idVar) => {
    const dat = await client.db("covamatDB").collection("datasheetInstance")
      .findOne({ "_id": new ObjectId(idVar) });
    if (dat.domain.name === datasheetInstance.domain.name &&
      dat.varietyType.name === datasheetInstance.varietyType.name &&
      dat.variationPoint.name === datasheetInstance.variationPoint.name
    ) {
      dat.variations.map((var) => {
        //if (var.name === datasheetInstance[0].name) {
        //  result = true
        //}
      });
    }
  })
  return result
}
*/
/*
export const getIsDatasheetInstanceInCase = async (idCase, idDatasheetInstance) => {
  await client.connect();
  
  // Obtener el caso
  const oneCase = await client.db("covamatDB").collection("case")
    .findOne({ "_id": new ObjectId(idCase) });

  let result = false;
  let dsVariations = oneCase.variety;
  console.log("dsVariations ", dsVariations)

  if(oneCase.variety !== null && idDatasheetInstance !== null){
    // Usar Promise.all para esperar a que todas las promesas se resuelvan
    await Promise.all(dsVariations.map(async (idVar) => {
    const dat = await client.db("covamatDB").collection("datasheetInstance")
      .findOne({ "_id": new ObjectId(idVar) });
      //console.log("dat ", dat)
      //console.log("datasheetInstance ", datasheetInstance)
      idDatasheetInstance.map( async (idDatInput) => {
        const datInput = await client.db("covamatDB").collection("datasheetInstance")
        .findOne({ "_id": new ObjectId(idDatInput) });
        if (dat.domain.name === datInput.domain.name &&
          dat.varietyType.name === datInput.varietyType.name &&
          dat.variationPoint.name === datInput.variationPoint.name
        ) {
            dat.variations.forEach((variation) => {
            if (variation.name === datInput.variations[0].name) {
              result = true;
            }
          });
        }
      })
    }));
  }  

  await client.close();
  return result;
}
*/

/*
El metodo getIsDatasheetInstanceInCase valida si la variacion que el usuario desea agregar al caso
estaba previamente cargada en el mismo.
*/
export const getIsDatasheetInstanceInCase = async (idDatasheetInstanceArray, inputDatasheetInstance) => {
  await client.connect();

  try {

    let result = false;

    if (idDatasheetInstanceArray !== null && idDatasheetInstanceArray.length > 0 && inputDatasheetInstance !== null) {
      // Usar Promise.all para esperar a que todas las promesas se resuelvan
      await Promise.all(idDatasheetInstanceArray.map(async (idDat) => {

        const datInput = await client.db("covamatDB").collection("datasheetInstance")
          .findOne({ "_id": new ObjectId(idDat) });

        if (datInput &&
          inputDatasheetInstance.domain.name === datInput.domain.name &&
          inputDatasheetInstance.varietyType.name === datInput.varietyType.name &&
          inputDatasheetInstance.variationPoint.name === datInput.variationPoint.name
        ) {
          if (inputDatasheetInstance.variations && datInput.variations) {
            datInput.variations.forEach((variation) => {
              if (variation.name === inputDatasheetInstance.variations[0].name) {
                //console.log('variation.name ', variation.name, ' name del input ', inputDatasheetInstance.variations[0].name)
                result = true;
              }
            });
          }
        }

      }));
    }

    return result;
  } catch (error) {
    console.error("Error al verificar la instancia de datasheet:", error);
    throw new Error("Error interno del servidor");
  } finally {
    await client.close();
  }
}


/*
El metodo getIsDatasheetDataInstanceInCase valida si la datasheet instance que el usuario desea agregar al caso
estaba previamente cargada en el mismo.
*/
export const getIsDatasheetInstanceDataInCase = async (idDatasheetInstanceArray, inputDatasheetInstance) => {
  await client.connect();

  try {

    let result = null;

    if (idDatasheetInstanceArray !== null && idDatasheetInstanceArray.length > 0 && inputDatasheetInstance !== null) {
      // Usar Promise.all para esperar a que todas las promesas se resuelvan
      await Promise.all(idDatasheetInstanceArray.map(async (idDat) => {

        const datInput = await client.db("covamatDB").collection("datasheetInstance")
          .findOne({ "_id": new ObjectId(idDat) });
        //console.log('el valor del datasheet del caso', datInput)
        if (datInput &&
          inputDatasheetInstance.domain.name === datInput.domain.name &&
          inputDatasheetInstance.varietyType.name === datInput.varietyType.name &&
          inputDatasheetInstance.variationPoint.name === datInput.variationPoint.name
        ) {
          result = datInput._id
        }

      }));
    }

    return result;
  } catch (error) {
    console.error("Error al verificar la datasheet instance: ", error);
    throw new Error("Error interno del servidor");
  } finally {
    await client.close();
  }
}

export const getDatasheetsInstancesByCase = async (idCase) => {
  try {
    await client.connect();
    const result = [];

    const oneCase = await client.db("covamatDB").collection("case").findOne({ "_id": new ObjectId(idCase.idCase) });

    if (oneCase?.variety) {
      // Cambiamos Promise.all por un bucle `for` para evitar problemas con sesiones paralelas.
      for (const idDat of oneCase.variety) {
        const oneDat = await client.db("covamatDB").collection("datasheetInstance").findOne({ "_id": new ObjectId(idDat) });
        if (oneDat) {
          result.push(oneDat);
        }
      }
    }

    return result;
  } catch (error) {
    //console.error("Error al obtener las datasheets:", error);
    throw new Error("Error interno del servidor");
  } finally {
    await client.close();
  }
};


/*
export const getDatasheetsInstancesByCase = async (idCase) => {
  await client.connect();

  try {
    let result = []

    //console.log('entrada', idCase)
    const oneCase = await client.db("covamatDB").collection("case").findOne({ "_id": new ObjectId(idCase.idCase) })
    //console.log('el caso', oneCase)

    if (oneCase.variety) {
      await Promise.all(oneCase.variety.map(async (idDat) => {

        const oneDat = await client.db("covamatDB").collection("datasheetInstance").findOne({ "_id": new ObjectId(idDat) })
        result.push(oneDat)
      }))
    }


    return result;
  } catch (error) {
    //console.error("Error al obtener las datasheet ", error);
    throw new Error("Error interno del servidor");
  } finally {

    //console.log('el resultado del metodo es: ', result)

    await client.close();
  }
}
*/
export const addVariationToCase = async (idCase, datasheetInstance) => {
  try {
    await client.connect();

    let isDatasheetInstanceInCase = false;
    let isVariationInCase = false;
    let result;

    if (idCase && datasheetInstance) {
      const oneCase = await client.db("covamatDB").collection("case").findOne({ "_id": new ObjectId(idCase) });

      if (oneCase && oneCase.variety) {
        for (const idDat of oneCase.variety) {
          const oneDatasheetInstance = await client.db("covamatDB").collection("datasheetInstance").findOne({ "_id": new ObjectId(idDat) });

          if (oneDatasheetInstance.varietyType.name === datasheetInstance.varietyType.name &&
            oneDatasheetInstance.variationPoint.name === datasheetInstance.variationPoint.name) {
            for (const variation of oneDatasheetInstance.variations || []) {
              if (variation.name && datasheetInstance.variations[0].name === variation.name) {
                isVariationInCase = true;

                if (datasheetInstance.varietyType.name === 'procesamiento') {
                  variation.variables.push(...datasheetInstance.variations[0].variables);

                  result = await client.db("covamatDB").collection("datasheetInstance").updateOne(
                    { "_id": new ObjectId(idDat) },
                    { $set: { "variations.$[elem].variables": variation.variables } },
                    { arrayFilters: [{ "elem.name": variation.name }] }
                  );
                } else {
                  //throw new Error("La variación ya se encuentra en el caso.");
                }
              }
            }

            if (!isVariationInCase) {
              const dsVariations = oneDatasheetInstance.variations || [];
              dsVariations.push(...datasheetInstance.variations);

              result = await client.db("covamatDB").collection("datasheetInstance").updateOne(
                { "_id": new ObjectId(idDat) },
                { $set: { "variations": dsVariations } }
              );
            }
          }
        }
      }

      if (!result && !isVariationInCase) {
        const idDatasheet = (await client.db("covamatDB").collection("datasheetInstance").insertOne(datasheetInstance)).insertedId;
        oneCase.variety = [...(oneCase.variety || []), idDatasheet.toString()];

        const resultCaseUpdated = await client.db("covamatDB").collection("case").updateOne(
          { "_id": new ObjectId(idCase) },
          { $set: { "variety": oneCase.variety } }
        );

        if (resultCaseUpdated.modifiedCount > 0) {
          isDatasheetInstanceInCase = true;
        }
      } else {
        isDatasheetInstanceInCase = true;
      }
    }

    //await client.close();
    return isDatasheetInstanceInCase;
  } catch (error) {
    //console.error("Error al agregar la datasheet instance:", error);
    throw new Error("Error al agregar la datasheet instance");
  } finally {
    await client.close();
  }
};



/*
export const addVariationToCase = async (idCase, datasheetInstance) => {
  //console.log('Entrada del metodo', idCase, ' ', variations)
  await client.connect();

  try {
    let isDatasheetInstanceInCase = false
    let result
    let isVariationInCase = false
    if (idCase && datasheetInstance) {

      const oneCase = await client.db("covamatDB").collection("case").findOne({ "_id": new ObjectId(idCase) });

      if (oneCase && oneCase.variety) {
        await Promise.all(oneCase.variety.map(async (idDat) => {

          const oneDatasheetInstance = await client.db("covamatDB").collection("datasheetInstance").findOne({ "_id": new ObjectId(idDat) })
          // Si la datasheet que esta en el caso tiene el mismo tipo de variacion
          // y el mismo punto de variacion, agrego la variacion de la datasheet nueva al 
          // caso. Si la datasheet es de procesamiento, y la variacion esta en el arreglo
          // de la datasheet instance del caso, agrego la variable a esa variacion.
          if (oneDatasheetInstance.varietyType.name === datasheetInstance.varietyType.name
            && oneDatasheetInstance.variationPoint.name === datasheetInstance.variationPoint.name
          ) {
            // verifico si la variacion ya esta cargada en el caso
            oneDatasheetInstance.variations?.forEach(async (variation) => {
              if (datasheetInstance.variations[0].name === variation.name) {
                //si la datasheet es de procesamiento agrego las variables al esa variedad
                //si no es de procesamiento no permito agregar la variacion.
                isVariationInCase = true
                if (datasheetInstance.varietyType.name === 'procesamiento') {
                  const dsVariables = variation.variables
                  datasheetInstance.variations[0].variables.forEach((vari) => {
                    dsVariables.push(vari);
                  })
                  result = await client.db("covamatDB").collection("datasheetInstance").updateOne(
                    { "_id": new ObjectId(idDat) },
                    { $set: { "variations.$[elem].variables": dsVariables } },
                    { arrayFilters: [{ "elem.name": variation.name }] });
                } else {
                  throw new Error("La variacion ya se encuentra en el caso");
                }

              }
            })
            if (!isVariationInCase) {
              let dsVariations = oneDatasheetInstance.variations || [];
              datasheetInstance.variations.forEach((variation) => {
                dsVariations.push(variation);
              })
              result = await client.db("covamatDB").collection("datasheetInstance").updateOne({ "_id": new ObjectId(idDat) }, { $set: { "variations": dsVariations } });

            }
          }
        }))
      }

      if (!result && !isVariationInCase) {
        //console.log('entro al if de !result')
        // no se actualizo ninguna datasheet, debo crearla
        const idDatasheet = await (await client.db("covamatDB").collection("datasheetInstance").insertOne(datasheetInstance)).insertedId;

        // agrego el id de la datasheet al caso
        let caseVariations = oneCase.variety || [];

        caseVariations.push(idDatasheet.toString());

        const resultCaseUpdated = await client.db("covamatDB").collection("case").updateOne({ "_id": new ObjectId(idCase) }, { $set: { "variety": caseVariations } });

        //console.log('Resultado de actualizar el caso ',resultCaseUpdated)
        if (resultCaseUpdated.modifiedCount > 0) {
          isDatasheetInstanceInCase = true;
        }
      } else {
        isDatasheetInstanceInCase = true;
      }
    }

    return isDatasheetInstanceInCase
  } catch (error) {
    console.error("Error al agregar la datasheet instance", error);
    throw new Error("Error al agregar la datasheet instance", error.message);
  } finally {

    await client.close();
  }

}
  */

export const createReuseCase = async (inputCase, inputDatasheetInstance) => {
  try {
    await client.connect();
    let idCase, result;

    // Valido que el caso venga con datos
    if (inputCase && inputCase.name !== '' && inputCase.description !== '' && inputCase.domain.name !== '') {
      // Inserto el caso y obtengo su ID
      idCase = (await client.db("covamatDB").collection("case").insertOne(inputCase)).insertedId;

      let arrIdsDatasheetInstances = [];

      // Si hay datasheet instances, las inserto una por una
      if (inputDatasheetInstance.length > 0) {
        for (const datasheet of inputDatasheetInstance) {
          const idDat = (await client.db("covamatDB").collection("datasheetInstance").insertOne(datasheet)).insertedId;
          arrIdsDatasheetInstances.push(idDat);
          //console.log('Agrego un id al arreglo de datasheet instances ', idDat);
        }
      }

      // Si se insertaron datasheet instances, actualizo el caso con sus IDs
      if (arrIdsDatasheetInstances.length > 0) {
        result = await client.db("covamatDB").collection("case").updateOne(
          { "_id": new ObjectId(idCase) },
          { $set: { "variety": arrIdsDatasheetInstances } }
        );
      }
    }

    // Retorno el ID del caso si todo fue exitoso
    if (result) {
      return idCase;
    } else {
      return null;
    }

  } catch (error) {
    console.error("Error al agregar la datasheet instance:", error);
    throw new Error("Error al agregar la datasheet instance");
  } finally {
    await client.close();
  }
};