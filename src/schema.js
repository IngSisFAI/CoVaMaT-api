import _ from 'lodash';
import {gql} from 'apollo-server';
import datasheetSchema from './schemas/datasheet.js';
import variationSchema from './schemas/variation.js';
import datasheetInstanceSchema from './schemas/datasheetInstance.js';
import caseSchema from './schemas/case.js';
import domainSchema from './schemas/domain.js';
import variationPointSchema from './schemas/variationPoint.js';
import varietyTypeSchema from './schemas/varietyType.js';
import user from './schemas/user.js';

const typeDefs = gql`
  ${domainSchema}
  ${varietyTypeSchema}
  ${variationPointSchema}
  ${variationSchema}
  ${caseSchema}
  ${datasheetInstanceSchema}
  ${datasheetSchema}
  ${user}
`;



export default typeDefs;