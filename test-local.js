// Teste local da função handler
import { handler } from './api/index.js';

// Simula uma requisição
const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
        host: 'localhost:3000'
    }
};

const mockRes = {
    status: (code) => {
        console.log(`Status: ${code}`);
        return mockRes;
    },
    json: (data) => {
        console.log('Response:', JSON.stringify(data, null, 2));
        return mockRes;
    },
    setHeader: (name, value) => {
        console.log(`Header: ${name} = ${value}`);
        return mockRes;
    },
    end: () => {
        console.log('Response ended');
        return mockRes;
    }
};

console.log('Testing handler function...');
console.log('Request:', mockReq.method, mockReq.url);

try {
    handler(mockReq, mockRes);
} catch (error) {
    console.error('Error:', error);
}
