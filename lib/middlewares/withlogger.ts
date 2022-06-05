import morgan from 'morgan'

var logger = morgan('common')
function withLoggerApiRoute(handler) {
  return async function (req, res) {
    logger(req, res, () => {})
    return handler(req, res)
  }
}

export function withLogger(handler) {
  return withLoggerApiRoute(handler)
}
