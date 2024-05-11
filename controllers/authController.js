const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function register(req, reply) {
  const { username, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      throw new Error('Username is already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Send success response
    reply.code(201).send({
      success: true,
      message: 'User registered successfully',
      data: newUser,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    // Send error response
    reply.code(500).send({
      success: false,
      error: error.message,
    });
  }
}


async function login(req, reply) {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    // Send success response
    reply.code(200).send({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    // Send error response
    reply.code(401).send({
      success: false,
      error: error.message,
    });
  }
}

module.exports = { register, login };
