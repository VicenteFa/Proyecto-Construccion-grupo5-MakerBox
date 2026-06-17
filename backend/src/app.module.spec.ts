import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('AppModule', () => {
  it('debe compilar exitosamente todos los modulos del sistema', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module).toBeDefined();

    const appModule = module.get<AppModule>(AppModule);
    expect(appModule).toBeDefined();
  });
});
