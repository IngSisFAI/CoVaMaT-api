import { getCases, getCasesSimilarToReuseCase, createCase, 
  addDatasheetInstancesToCase, getIsDatasheetInstanceInCase, 
  getIsDatasheetInstanceDataInCase, getDatasheetsInstancesByCase,
  addVariationToCase, createReuseCase} from '../entities/case.js';
const resolvers = {
  Query: {
    getCases: (_, __, { }) => {
      return getCases();
    },
   // getCasesByDomain: (_, domain, { }) => {
   //   return getCasesByDomain(domain);
  //  },
    getCasesSimilarToReuseCase: (_, reuseCase, { }) => {
      return getCasesSimilarToReuseCase(reuseCase);
    },
    getIsDatasheetInstanceInCase(_,{idDatasheetInstanceArray, inputDatasheetInstance}, {}){
      return getIsDatasheetInstanceInCase(idDatasheetInstanceArray, inputDatasheetInstance);
    },
    getIsDatasheetInstanceDataInCase(_,{idDatasheetInstanceArray, inputDatasheetInstance}, {}){
      return getIsDatasheetInstanceDataInCase(idDatasheetInstanceArray, inputDatasheetInstance);
    },
    getDatasheetsInstancesByCase(_,idCase, {}){
      //console.log(idCase)
      return getDatasheetsInstancesByCase(idCase);
    }
  },
  Mutation: {
    createCase(_, { inputCase }) {
      //console.log("Datos recibidos en el resolver:", inputCase);
      return createCase(inputCase);
    },
    addDatasheetInstancesToCase(_, { idCase, variations }) {
      //console.log("Datos recibidos en el resolver case:", idCase, variations);
      return addDatasheetInstancesToCase(idCase, variations);
    },
    addVariationToCase(_, { idCase, datasheetInstance } ) {
      //console.log("Datos recibidos en el resolver case:", idCase, variations);
      return addVariationToCase(idCase, datasheetInstance);
    },
    createReuseCase(_, { inputCase, inputDatasheetInstance } ) {
      //console.log("Datos recibidos en el resolver case:", idCase, variations);
      return createReuseCase(inputCase, inputDatasheetInstance);
    },
  }
};

export default resolvers;