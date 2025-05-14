import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Criar usuário
app.post('/usuarios', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await prisma.user.create({
      data: { name, email, password }
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user
    });
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'E-mail já cadastrado' });
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

// Listar usuários
app.get('/usuarios', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});
 
//deletar usuário

app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const user = await prisma.user.delete({
        where: { id: Number(id) }
        });
    
        res.status(200).json({
        message: 'Usuário deletado com sucesso',
        user
        });
    } catch (error) {
        if (error.code === 'P2025') {
        res.status(404).json({ error: 'Usuário não encontrado' });
        } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    });


// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
