import { Test, TestingModule } from '@nestjs/testing';
import { CursosController } from './cursos.controller';
import { CursosService } from './cursos.service';

describe('CursosController', () => {
  let controller: CursosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CursosController],
      providers: [{ provide: CursosService, useValue: {} }],
    }).compile();
    controller = module.get<CursosController>(CursosController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });
});
