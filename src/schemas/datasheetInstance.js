import { gql } from 'apollo-server';
const typeDefs = gql`
    type DatasheetInstance{
        _id: ID
        id_datasheet: ID
        name: String
        domain: Domain
        varietyType: VarietyType
        variationPoint: VariationPoint
        variations: [Variation]
    }

    input InputDatasheetInstance{
        id_datasheet: ID
        name: String
        domain: InputDomain
        varietyType: InputVarietyType
        variationPoint: InputVariationPoint
        variations: [InputVariation]
    }
    
    type Query {
        getDatasheetInstances: [DatasheetInstance]
        getDatasheetInstancesById(ids: [ID]): [DatasheetInstance]
    }

    type Mutation {
        createDatasheetInstance(datasheetInstance: InputDatasheetInstance): ID
        addVariationsToInstance(datasheetInstanceId: ID, variations: [InputVariation]): Boolean
    }


`;
export default typeDefs;