import isSomething from './is_something'
const datedPathFormat = /(\d{4}-\d{2}-\d{2})/
const readPageFormat = /\/reading\/(\d{4}-\d{2}-\d{2})\//

export default {
  isDatedPost: (path) => isSomething(path) && isSomething(path.match(datedPathFormat)),
  isReadingPage: (path) => isSomething(path) && isSomething(path.match(readPageFormat)),
  extractDatePart: (path) => path.match(datedPathFormat)[1]
}
