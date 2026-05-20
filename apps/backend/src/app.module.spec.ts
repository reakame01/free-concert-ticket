import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';

describe('AppModule', () => {
  let module: TestingModule;

  afterEach(async () => {
    const dataSource = module.get(DataSource);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await module.close();
  });

  it('should be defined', async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module).toBeDefined();
  });
});
