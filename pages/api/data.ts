import type { NextApiRequest, NextApiResponse } from 'next'
import { withLogger } from '../../lib/middlewares/withlogger'

export default withLogger(handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  //GET
  if (req.method != 'GET') {
    res.status(405)
    res.end()
    return
  }
  res.status(204)
  res.end()
  return
}
