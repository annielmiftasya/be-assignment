const fastify = require('fastify')(); // Import and initialize Fastify

// Import Fastify form body parser plugin
fastify.register(require('fastify-formbody'));

// Middleware to log requests
fastify.addHook('onRequest', (request, reply, done) => {
  console.log(`${request.method} ${request.url}`);
  done();
});

const { register, login } = require('./controllers/authController');
const { createAccount } = require('./controllers/accountController');
const { processTransaction } = require('./services/paymentManager');

fastify.post('/register', register);
fastify.post('/login', login);

fastify.post('/payment-account', async (request, reply) => {
  try {
    const accountData = request.body;
    const result = await createAccount(accountData);
    reply.send(result);
  } catch (error) {
    console.error('Failed to create payment account:', error);
    reply.status(500).send({ error: 'Failed to create payment account' });
  }
});

fastify.post('/send', async (request, reply) => {
  const { userId, accountId, amount, toAddress } = request.body;

  try {
    const transaction = { userId, accountId, amount, toAddress, status: 'Pending' };
    await processTransaction(transaction); // Process transaction asynchronously
    reply.send({ message: 'Transaction sent successfully' });
  } catch (error) {
    console.error('Error sending transaction:', error);
    reply.status(500).send({ error: 'Error sending transaction' });
  }
});

fastify.post('/withdraw', async (request, reply) => {
  const { userId, accountId, amount } = request.body;

  try {
    const transaction = { userId, accountId, amount, status: 'Pending' };
    await processTransaction(transaction); // Process transaction asynchronously
    reply.send({ message: 'Withdrawal successful' });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    reply.status(500).send({ error: 'Error processing withdrawal' });
  }
});

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
