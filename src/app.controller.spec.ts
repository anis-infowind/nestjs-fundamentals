import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevConfigService } from './common/providers/dev-config-service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: DevConfigService,
          useValue: { getDBHOST: () => 'localhost' },
        },
        {
          provide: 'CONFIG',
          useValue: { port: 3000 },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the correct hello message', () => {
      expect(appController.getHello()).toBe(
        'Hello I am learning Nest.js Fundamentals localhost PORT = 3000',
      );
    });
  });
});