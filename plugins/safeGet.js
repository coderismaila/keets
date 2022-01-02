import get from 'lodash/get'
import Vue from 'vue'

Vue.filter('get', (obj, path) => get(obj, path, ''))
