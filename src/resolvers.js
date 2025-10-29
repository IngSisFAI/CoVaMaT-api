import _ from 'lodash';
import datasheetResolver from './resolvers/datasheet.js';
import datasheetInstanceResolver from './resolvers/datasheetInstance.js';
import caseResolver from './resolvers/case.js';
import userResolver from './resolvers/user.js'

const resolvers = _.merge(
  datasheetResolver,
  datasheetInstanceResolver,
  caseResolver,
  userResolver
)

export default resolvers;