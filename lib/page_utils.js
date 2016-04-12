const datedPathFormat = /(?:\/reading\/)?(\d{4}-\d{2}-\d{2})\//
const readPageFormat = /\/reading\/(\d{4}-\d{2}-\d{2})\//

export default {
  isDatedPost: (path) => path && path.match(datedPathFormat) != null,
  isReadingPage: (path) => path && path.match(readPageFormat) != null,
  extractDatePart: (path) => path.match(datedPathFormat)[1]
}