import { apiKey, apodApiUrl } from '../config'

export const nasaApi = {
  async getApod(date: Date | null = null) {
    let url = apodApiUrl + '?api_key=' + apiKey
    if (date) {
      url += '&date=' + date.toISOString().split('T')[0]
    }

    const response = await fetch(url)
    const data = (await response.json()) as ApodResponse

    if (data.copyright !== undefined) {
      data.copyright = data.copyright.trim()
    }

    ApodResponse.tryPatch(data)

    return data
  }
}

export class ApodResponse {
  copyright: string = ''
  date: string = ''
  explanation: string =
    'This is a fallback image used in the case where there is a missing/corrupted asset on apod.nasa.gov. Image source: https://en.wikipedia.org/wiki/File:Black_Hole_in_the_universe.jpg'
  hdurl: string = 'https://api.nasa.gov/planetary/apod/static/default_apod_image.jpg'
  media_type: string = 'image'
  service_version: string = ''
  title: string = 'Default Image'
  url: string = 'https://api.nasa.gov/planetary/apod/static/default_apod_image.jpg'
  code: number = 200
  msg: string = ''
  error: { message: string; code: string } | null = null

  static tryPatch(response: ApodResponse) {
    if (response.error) {
      switch (response.error.code) {
        case 'OVER_RATE_LIMIT':
          response.title = 'Rate Limit Exceeded'
          response.msg = 'Slow down a bit and try again later.'
          break
        default:
          response.title = 'Error'
          response.msg = response.error.message
          break
      }
    }

    if (new Date(response.date) < new Date('1995-09-01')) {
      const matches = response.explanation.match(
        /.*Credit:(?<credit>.*)Explanation:(?<explanation>.*)/
      )
      if (matches && matches.groups) {
        response.copyright = matches.groups.credit.trim()
        response.explanation = matches.groups.explanation.trim()
      }
    } else if (response.date === '1995-09-01') {
      const matches = response.copyright.match(
        /^(?<credit>.*)\s*Explanation:\s*(?<explanation>.*)Tomorrow's.*$/s
      )
      if (matches && matches.groups) {
        console.log(matches.groups)
        response.copyright = matches.groups.credit.trim()
        response.explanation = matches.groups.explanation.trim()
      }
    }
  }
}
