const WebSocket = require('ws')
const ServidorWebSocket = new WebSocket.Server({ port: 3050 });
const express = require('express')
const cors = require('cors')
const porta = 2050

const pessoasConectadas = []
const servidor = express()

servidor.use(cors({
    allowedHeaders: "*",
    origin: "*"
}))
servidor.use(express.json())
servidor.use(express.static('public'))

servidor.listen(porta, '195.35.37.40',() => {
    console.log(`http://195.35.37.40:${porta}`)
})

const notificacao = (mensagem, quemEstaEnviando) => ({
    mensagem: mensagem,
    quemEstaEnviando: quemEstaEnviando,
    dataEnvio: new Date()
})

servidor.post('/api/mensagem', (req, res) => {
    const corpoDeRequisicao = req.body
    /*
        CORPO DE REQUISIÇÃO ESPERADO:

        {
            "mensagem": "mensagem exemplo",
            "quemEnviou": "fulano beltrano"
        }
    */
   pessoasConectadas.forEach((pessoa) => pessoa.send(JSON.stringify(notificacao(corpoDeRequisicao.mensagem, corpoDeRequisicao.quemEnviou))))
   return res.status(200).json({})
})

ServidorWebSocket.on('connection', (socket) => {
    console.log('Cliente conectado. ' + socket);
    pessoasConectadas.push(socket)
    // Enviar uma mensagem para o cliente quando ele se conectar
    socket.send(JSON.stringify(notificacao('Olá, sou o WebSocket Techers :)!', 'Servidor do Dudao')));
  
    // Lidar com mensagens do cliente
    socket.on('message', (message) => {
      console.log(`Mensagem recebida: ${message}`);
  
      // Enviar uma resposta de volta para o cliente
      socket.send(`Você disse: ${message}`);
    });
  
    // Lidar com o evento de fechamento da conexão
    socket.on('close', () => {
      console.log('Cliente desconectado.');
    });
});

