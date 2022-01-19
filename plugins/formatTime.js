import Vue from 'vue'
import * as dayjs from 'dayjs'

Vue.filter('formatTime', function (value) {
  if (value) {
    return dayjs(value).format('DD-MMM HH:mm')
  }
  return value
})
