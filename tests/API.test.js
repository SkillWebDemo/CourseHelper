const request = require('supertest');
const express = require('express');
const router = require('../routes/API');
const { sendQuestionToOpenAI } = require('../openAiClient');

jest.mock('../openAiClient', () => ({
  sendQuestionToOpenAI: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/API', router);

describe('POST /API/addUserText', () => {
  it('should return 400 if userInput is not provided', async () => {
    const res = await request(app).post('/API/addUserText').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'User input is required');
  });

  it('should return AI answer when userInput is provided', async () => {
    sendQuestionToOpenAI.mockResolvedValue('AI response');

    const res = await request(app)
      .post('/API/addUserText')
      .send({ userInput: 'Test question' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('AI response');
  });

  it('should return 500 if there is an error processing the request', async () => {
    sendQuestionToOpenAI.mockRejectedValue(new Error('Internal Error'));

    const res = await request(app)
      .post('/API/addUserText')
      .send({ userInput: 'Test question' });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error', 'Internal Server Error');
  });
});
