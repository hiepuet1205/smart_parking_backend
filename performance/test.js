import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 100 }, // Ramp-up to 10 users in 1 minute
    { duration: '5m', target: 500 }, // Stay at 10 users for 5 minutes
    { duration: '10m', target: 1000 }, // Stay at 10 users for 5 minutes
    { duration: '1m', target: 0 },  // Ramp-down to 0 users in 1 minute
  ],
};

const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJPV05FUl9QQVJLSU5HX1NMT1QiLCJpYXQiOjE3MzI4NTI4NDksImV4cCI6MTc1MDg1Mjg0OX0.PnCSuN1_svcAl9KcQQYSiHkoDWPEzhlFALMmgpRY__k";

export default function () {
  // Set headers with the cookie token
  const headers = {
    'Cookie': `accessToken=${accessToken}`,
  };

  // Make the GET request
  const res = http.get('http://192.168.30.71:8000/api/v1/locations/range?long=105.7972517&lat=21.0298956&range=1000', { headers });

  // Validate response
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  // Simulate think time
  sleep(1);
}
