import { Request, ResponseToolkit } from '@hapi/hapi';

export function hello(req: Request, h: ResponseToolkit) {
  req.log('info', `${req.method} ${req.info.host}${req.path}`);
  return h.response('Hello World').code(200);
}

export function time(req: Request, h: ResponseToolkit) {
  return h.response(new Date().toISOString()).code(200);
}
