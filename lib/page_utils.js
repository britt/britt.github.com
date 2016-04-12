const pathFormat = /(?:\/reading\/)?(\d{4}-\d{2}-\d{2})\//

export default {
  isReadingPage: (path) => path.match(pathFormat) != null,
  extractDatePart: (path) => path.match(pathFormat)[1]
}