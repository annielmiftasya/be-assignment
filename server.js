const fastify = require('fastify')(); // Import and initialize Fastify

const { register, login } = require('./controllers/authController');
const { createAccount } = require('./controllers/accountController');
const { processTransaction } = require('./services/paymentManager');

fastify.post('/register', async (request, reply) => {
  try {
    const userData = request.body;
    const result = await register(userData);
    reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to register user' });
  }
});

fastify.post('/login', async (request, reply) => {
  try {
    const credentials = request.body;
    const result = await login(credentials);
    reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to login' });
  }
});

fastify.post('/payment-account', async (request, reply) => {
  try {
    const accountData = request.body;
    const result = await createAccount(accountData);
    reply.send(result);
  } catch (error) {
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
    reply.status(500).send({ error: 'Error processing withdrawal' });
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
