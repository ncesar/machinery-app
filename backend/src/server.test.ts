const request = require('supertest');
const server = require('./server'); 

describe('POST /products', () => {
  it('should create a new product', async () => {
    const res = await request(server)
      .post('/products')
      .send({
        name: 'Test Product',
        price: 100,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toEqual('Test Product');
    expect(res.body.price).toEqual(100);
  });

  it('should return 400 if name or price is empty', async () => {
    const res = await request(server)
      .post('/products')
      .send({
        name: '',
        price: 100,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Name and price cannot be empty');
  });
});
