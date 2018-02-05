import {isUndefined, isNull} from 'lodash'

export default (x) => !isUndefined(x) && !isNull(x)
