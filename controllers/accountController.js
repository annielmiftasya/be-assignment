const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAccount(request, reply) {
  const { userId, type } = request.body;

  try {
    const newAccount = await prisma.paymentAccount.create({
      data: {
        userId,
        type,
        balance: 0, 
      },
    });
  
    reply.code(201).send({
      success: true,
      message: 'Payment account created successfully',
      data: newAccount,
    });
  } catch (error) {
    console.error('Error creating payment account:', error);
    reply.code(500).send({
      success: false,
      error: 'Error creating payment account',
    });
  }
}

async function getAllAccounts(req, res) {
  const { userId } = req.params;

  try {
    const accounts = await prisma.paymentAccount.findMany({
      where: { userId },
    });

    res.send(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).send({ error: 'Internal server error' }); 
  }
}

module.exports = { createAccount, getAllAccounts };
