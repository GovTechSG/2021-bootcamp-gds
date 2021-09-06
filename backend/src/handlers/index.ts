import { Request, ResponseToolkit } from '@hapi/hapi';

function index(req: Request, h: ResponseToolkit) {
  req.log('info', `${req.method} ${req.info.host}${req.path}`);
  return h.response('Hello World').code(200);
}

export default index;
