import axios from 'axios'

console.log('host: ', window.location.host.split(':')[0])

const axiosInstance = axios.create({
  baseURL: 'http://' + window.location.host.split(':')[0] + ':8080',
})

export default axiosInstance
