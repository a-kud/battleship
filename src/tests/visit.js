import nightmare from 'nightmare'
import url from 'url'

const BASE_URL = url.format({
  protocol: process.env.PROTOCOL || 'http',
  hostname: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000
})

export const visit = path => {
  const location = url.resolve(BASE_URL, path)
  const config = {
    show: false,
    // From the docs: Note that, even though goto normally waits
    // for all the resources on a page to load, a timeout exception
    // is only raised if the DOM itself has not yet loaded.
    gotoTimeout: 30000,
    waitTimeout: 30000,
    loadTimeout: 30000,
    executionTimeout: 30000
  }

  return nightmare(config).goto(location)
}
