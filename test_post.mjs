import http from 'http';

const data = JSON.stringify({
  id: 'test_' + Date.now(),
  name: 'Test Car',
  price: '₱100',
  modelYear: '2020',
  mileage: '1000',
  brand: 'Test',
  transmission: 'AT',
  fuelType: 'Gasoline',
  engine: '2.0L',
  hp: '200',
  torque: '200',
  safety: 'Yes',
  seating: '5',
  description: 'Test',
  status: 'open',
  type: 'SUV',
  date: '2024-01-01',
  images: ['data:image/jpeg;base64,123']
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/cars',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
