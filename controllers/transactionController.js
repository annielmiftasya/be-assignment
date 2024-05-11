const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function sendTransaction(request, reply) {
    const { accountId, amount, toAddress } = request.body;

    try {
        // Start the transaction
        await prisma.$transaction([
            // Create a new transaction record
            prisma.transaction.create({
                data: {
                    accountId,
                    amount,
                    toAddress,
                    status: 'Pending'
                }
            }),
            // Update the account balance (add the amount)
            prisma.paymentAccount.update({
                where: { id: accountId },
                data: {
                    balance: {
                        increment: amount
                    }
                }
            })
        ]);

        reply.send({ message: 'Transaction sent successfully' });
    } catch (error) {
        console.error('Error sending transaction:', error);
        reply.status(500).send({ error: 'Error sending transaction' });
    }
}

async function withdrawTransaction(request, reply) {
    const { accountId, amount } = request.body;

    try {
        // Start the transaction
        await prisma.$transaction([
            // Create a new transaction record
            prisma.transaction.create({
                data: {
                    accountId,
                    amount: -amount, // Withdrawal is a negative amount
                    status: 'Pending'
                }
            }),
            // Update the account balance (subtract the amount)
            prisma.paymentAccount.update({
                where: { id: accountId },
                data: {
                    balance: {
                        decrement: amount
                    }
                }
            })
        ]);

        reply.send({ message: 'Withdrawal successful' });
    } catch (error) {
        console.error('Error processing withdrawal:', error);
        reply.status(500).send({ error: 'Error processing withdrawal' });
    }
}

async function getAccountTransactions(req, res) {
    const { accountId } = req.params;

    try {

        const accountIdInt = parseInt(accountId);

        // Check if accountIdInt is a valid integer
        if (isNaN(accountIdInt)) {
            throw new Error('Invalid accountId');
        }

        const transactions = await prisma.transaction.findMany({
            where: { accountId: accountIdInt },
        });

        res.send(transactions);
    } catch (error) {
        console.error('Error fetching account transactions:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}



module.exports = { sendTransaction, withdrawTransaction, getAccountTransactions };
