import '@testing-library/jest-dom';

// Mocking the global fetch function
global.fetch = jest.fn(() =>
  Promise.resolve(
    new Response(JSON.stringify({ data: 'test' }), {
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
    })
  ) as unknown as Promise<Response>
);

// Mocking global alert
global.alert = jest.fn();
