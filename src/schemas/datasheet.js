
import { gql } from 'apollo-server';
const typeDefs = gql`
  type Datasheet {
    _id: ID
    name: String
    domain: Domain
    varietyType: VarietyType
    variationPoint: VariationPoint
    variations: [Variation]
  }

  input InputDatasheet{
    name: String
    domain: InputDomain
    varietyType: InputVarietyType
    variationPoint: InputVariationPoint
    variations: [InputVariation]
  }

  type Query {
    getAllDatasheets: [Datasheet]
    getDatasheetsByDomain(domain: InputDomain): [Datasheet]
    getVarietyTypesByDomain(domain: InputDomain): [VarietyType]
    getDatasheetsByVarietyType(varietyType: InputVarietyType): [Datasheet]
    getDatasheetById(idDatasheet: ID): Datasheet
    getDomains: [Domain]
    getAllVarietyTypes: [VarietyType]
    getVariationPointsByVarietyTypes(varietyType: InputVarietyType): [VariationPoint]
    getVariationPointsByVarietyTypeAndDomain(varietyType: InputVarietyType, domain: InputDomain): [VariationPoint]
    getDatasheetByDomainVTVP(domain: InputDomain, varietyType: InputVarietyType, variationPoint: InputVariationPoint): [Datasheet]
    getVariationsByDomainVTVP(domain: InputDomain, varietyType: InputVarietyType, variationPoint: InputVariationPoint): [Variation]
  }
  type Mutation {
    createDatasheet(datasheet: InputDatasheet):ID
    addVariations(idDatasheet: ID, variations: [InputVariation]): Boolean
  }
`;
export default typeDefs;