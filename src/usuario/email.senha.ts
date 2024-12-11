import cors from 'cors';

import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';


const app = express();

app.use(express.json()); // Para processar o corpo das requisições em formato JSON
app.use(cors());

// Função para enviar o e-mail
export async function sendResetEmail(email: string, codigo: string) {

    // Configuração do Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Usando o serviço Gmail
        auth: {
            user: 'kauanfelipesousa1@gmail.com', // Meu e-mail
            pass: 'A@leatoria123',  // Minha senha 
        },
    });

    try {
        // Envia o e-mail
        const info = await transporter.sendMail({
            from: '"Sistema" <kauanfelipesousa1@gmail.com>',  //remetente 
            to: email,  // E-mail do destinatário
            subject: 'Redefinição de Senha',  // Assunto do e-mail
            text: `Seu código de redefinição é: ${codigo}`,  // Corpo do e-mail
        });


        // Exibe o ID da mensagem para depuração
        console.log('E-mail enviado:', info.messageId);
        return { success: true, message: 'E-mail de redefinição enviado com sucesso!' };
    } catch (error) {
        // Caso ocorra algum erro, captura e retorna o erro
        console.error('Erro ao enviar o e-mail:', error);
        return { success: false, message: 'Erro ao enviar o e-mail', error };
    }

}

// Endpoint para recuperar senha
app.post('/recuperar-senha', async (req: Request, res: Response) => {
    const { email } = req.body;
    const codigo = Math.floor(Math.random() * 1000000);  // Gera um código aleatório de 6 dígitos

    // Chama a função para enviar o e-mail de redefinição de senha
    const result = await sendResetEmail(email, codigo.toString());

    // Verifica o resultado e responde com sucesso ou erro
    if (result.success) {
        return res.status(200).json({ message: result.message });
    } else {
        return res.status(500).json({ message: result.message, error: result.error });
    }
});

// Inicializa o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
