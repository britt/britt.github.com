import PageUtils from './page_utils'
import moment from 'moment'

const Dates = {
  momentSort: (firstDate, secondDate) => {
    if(firstDate.isAfter(secondDate)) {
      return 1
    } else if(firstDate.isBefore(secondDate)) {
      return -1
    } else {
      return 0
    }
  }
}

const Pages = {
  dateInPath: (firstPage, secondPage) => {
    const firstDate = moment(PageUtils.extractDatePart(firstPage.path), "YYYY-MM-DD")
    const secondDate = moment(PageUtils.extractDatePart(secondPage.path), "YYYY-MM-DD")

    return Dates.momentSort(firstDate, secondDate)
  }
}

export { Dates, Pages }
export default {
  Dates: Dates,
  Pages: Pages
}