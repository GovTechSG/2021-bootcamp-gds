import hapi from '@hapi/hapi';
import index from './handlers';

function init() {
  const server = new hapi.Server({
    address: '0.0.0.0',
    port: process.env.PORT || 3001,
    debug: {
      log: process.env.NODE_ENV === 'development' ? ['*'] : undefined,
      request: process.env.NODE_ENV === 'development' ? ['*'] : undefined,
    },
  });
  
  server.route({
    method: 'GET',
    path: '/',
    handler: index,
  });

  return server;
}

const server = init();
server.start();
