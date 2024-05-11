const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAccount(req, res) {
  const { userId, type } = req.body;

  try {
    // Membuat akun baru dalam database menggunakan Prisma
    const newAccount = await prisma.paymentAccount.create({
      data: {
        userId,
        type,
        balance: 0, // Saldo awal bisa diatur sesuai kebutuhan
      },
    });
    
    // Mengirim respons ke klien
    res.status(201).json({
      success: true,
      message: 'Payment account created successfully',
      data: newAccount,
    });
  } catch (error) {
    // Mengirim respons ke klien jika terjadi kesalahan
    console.error('Error creating payment account:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating payment account',
    });
  }
}

module.exports = { createAccount };
