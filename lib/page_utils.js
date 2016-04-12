const pathFormat = /(?:\/reading\/)?(\d{4}-\d{2}-\d{2})\//

export default {
  extractDatePart: (path) => path.match(pathFormat)[1]
}