const fastify = require('fastify')();
const { authenticateToken } = require('./middleware/authenticateToken');
const { login } = require('./controllers/authController');
const { createAccount, getAllAccounts } = require('./controllers/accountController');
const { sendTransaction, withdrawTransaction, getAccountTransactions } = require('./controllers/transactionController');

// Import Fastify form body parser plugin
fastify.register(require('fastify-formbody'));

// Middleware to log requests
fastify.addHook('onRequest', (request, reply, done) => {
  console.log(`${request.method} ${request.url}`);
  done();
});

// Define routes
fastify.post('/login', login);
fastify.post('/payment-account', { preHandler: authenticateToken }, createAccount);
fastify.get('/accounts', { preHandler: authenticateToken }, getAllAccounts);
fastify.get('/accounts/:accountId/transactions', { preHandler: authenticateToken }, getAccountTransactions);
fastify.post('/send', { preHandler: authenticateToken }, sendTransaction);
fastify.post('/withdraw', { preHandler: authenticateToken }, withdrawTransaction);

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log(`Server is listening on ${fastify.server.address().port}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
