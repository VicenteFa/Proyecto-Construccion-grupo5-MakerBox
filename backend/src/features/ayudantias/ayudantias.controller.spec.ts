import { Test, TestingModule } from '@nestjs/testing';
import { AyudantiasController } from './ayudantias.controller';
import { AyudantiasService } from './ayudantias.service';

describe('AyudantiasController', () => {
  let controller: AyudantiasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AyudantiasController],
      providers: [{ provide: AyudantiasService, useValue: {} }],
    }).compile();
    controller = module.get<AyudantiasController>(AyudantiasController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });
});
