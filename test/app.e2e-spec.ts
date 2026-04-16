import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { User } from '../src/modules/users/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let userRepository: Repository<User>;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );

    await app.init();
  });

  afterEach(async () => {
    const users = await userRepository.find();
    console.log('Current DB Users:', users);
  });

  it('POST /users should create a user', async () => {
    const createUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('John Doe');
    expect(response.body.email).toBe('john@example.com');
    expect(response.body.password).toBe('pass'); // Should not return password
  });

  it('should fail with invalid email', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'John',
        email: 'invalid-email',
        password: 'password123',
      })
      .expect(400);
    // console.log(response.body);
    expect(response.body.message).toContain('email must be an email');
  });

  it('should fail with duplicate email', async () => {
    await request(app.getHttpServer()).post('/users').send({
      name: 'John',
      email: 'duplicate@example.com',
      password: 'password123',
    });

    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Jane',
        email: 'duplicate@example.com', // Same email
        password: 'password456',
      })
      .expect(409);

    expect(response.body.message).toContain('email already exists');
  });
});
