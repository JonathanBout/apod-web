import { apiKey, apodApiUrl } from '../config'

export default {
  async getApod(date: Date | null = null) {
    let url = apodApiUrl + '?api_key=' + apiKey
    if (date) {
      url += '&date=' + date.toISOString().split('T')[0]
    }

    const response = await fetch(url)
    const data = await response.json()

    return data as ApodResponse
  }
}

export class ApodResponse {
  copyright: string = ''
  date: string = ''
  explanation: string = ''
  hdurl: string = ''
  media_type: string = ''
  service_version: string = ''
  title: string = ''
  url: string = ''
}
