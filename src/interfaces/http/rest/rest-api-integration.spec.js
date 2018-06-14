import cors from 'cors';
import request from 'supertest';
import compression from 'compression';

import { RestApi } from './rest-api';

describe('Integration testing', () => {
  const logger = {
    info: ()=> {},
      debug: ()=> {},
      error: ()=> {}
  };
  // Setup Rest server
  const restApi = new RestApi({cors, compression, logger, port: 3001});
  restApi.start();

  test('It should details for a given company', async () => {
    const response = await request(restApi.getApp()).get('/company/Bixi');
    const expected = {
      "name": "Bixi",
      "location": {
        "city": "Montréal, QC",
        "country": "CA",
        "latitude": 45.508693,
        "longitude": -73.553928
      },
      "condition": {
        "condition": {
          "date": "Mon, 11 Jun 2018 11:00 AM EDT",
          "temp": "66", "text": "Sunny"
        }
      }
    };
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.name).toEqual(expected.name);
    expect(parsedResponse.location).toEqual(expected.location);
    expect(parsedResponse.condition).toBeDefined();
    expect(response.statusCode).toEqual(200);
  });

  test('It should response with 400 when unknown company', async () => {
    return request(restApi.getApp()).get('/company/unknown').expect(400);
  });

  test('It should response health with 200', async () => {
    return request(restApi.getApp()).get('/health').expect(200);
  });
});