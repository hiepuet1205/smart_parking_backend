import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './../app.module';

async function printRoutes() {
  const logger = new Logger('Routes');

  const app = await NestFactory.create(AppModule);
  await app.listen(3003);
  const server = app.getHttpServer();
  const router = server._events.request._router;

  const availableRoutes = router.stack
    .filter((layer) => layer.route)
    .map((layer) => `${layer.route.stack[0].method} - ${layer.route.path}`);

  logger.debug('availableRoutes', availableRoutes);
}

printRoutes();
