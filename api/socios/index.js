// Imports
const express = require("express");
const app = express();
const mysql = require("mysql");

// Configurações do banco de dadoscd 
const host = "185.239.210.154";
const username = "u919273444_Rootecf";
const password = "Root@cef1937";
const database = "u919273444_ecf";

// Cria uma conexão com o banco de dados
const connection = mysql.createConnection({
    host,
    username,
    password,
    database,
});

// Configurações de cabeçalho para permitir acesso de origens diferentes (CORS)
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});
app.listen(3000);

// Rota para cadastrar um novo usuário
app.post("/socios", (req, res) => {
    // Obtém os dados enviados no corpo da requisição
    const data = JSON.parse(req.body);

    // Verifica se todos os campos obrigatórios foram enviados
    if (
        data.nome &&
        data.cpf &&
        data.categoria_socio &&
        data.telefone &&
        data.data_nascimento &&
        data.data_adesao
    ) {
        // Prepara a consulta SQL para verificar se o usuário já existe
        const checkQuery = "SELECT * FROM socios WHERE cpf = '" + data.cpf + "'";
        const checkResult = connection.query(checkQuery);

        if (checkResult.length > 0) {
            // Retorna uma resposta de erro se o usuário já existe
            res.status(400).json({
                message: "Usuário com CPF já cadastrado.",
            });
        } else {
            // Prepara a consulta SQL para inserir um novo usuário
            const query = "INSERT INTO socios (nome, cpf, categoria_socio, telefone, data_nascimento, data_adesao) VALUES ('" +
                data.nome + "', '" +
                data.cpf + "', '" +
                data.categoria_socio + "', '" +
                data.telefone + "', '" +
                data.data_nascimento + "', '" +
                data.data_adesao + "')";

            // Executa a consulta
            connection.query(query, (err, results) => {
                if (err) {
                    // Retorna uma resposta de erro
                    res.status(500).json({
                        message: "Erro ao cadastrar usuário: " + err,
                    });
                } else {
                    // Retorna uma resposta de sucesso
                    res.status(201).json({
                        message: "Usuário cadastrado com sucesso.",
                    });
                }
            });
        }
    } else {
        // Retorna uma resposta de erro se algum campo obrigatório estiver faltando
        res.status(400).json({
            message: "Todos os campos obrigatórios devem ser preenchidos.",
        });
    }
});

// Rota para pesquisar usuários pelo CPF
app.get("/socios/:cpf", (req, res) => {
    // Obtém o CPF a ser pesquisado
    const cpf = req.params.cpf;

    // Prepara a consulta SQL para pesquisar o usuário pelo CPF
    const query = "SELECT * FROM socios WHERE cpf = '" + cpf + "'";

    // Executa a consulta
    connection.query(query, (err, results) => {
        if (err) {
            // Retorna uma resposta de erro
            res.status(500).json({
                message: "Erro ao pesquisar usuário: " + err,
            });
        } else {
            // Retorna o usuário em formato JSON
            res.json(results[0]);
        }
    })
});

// Rota para editar um sócio
app.put("/socios/:cpf", (req, res) => {
    // Obtém o CPF do sócio a ser editado
    const cpf = req.params.cpf;
  
    // Obtém os dados enviados no corpo da requisição
    const data = JSON.parse(req.body);
  
    // Prepara a consulta SQL para atualizar os dados do sócio
    const query = "UPDATE socios SET nome = '" + data.nome + "', categoria_socio = '" + data.categoria_socio + "', telefone = '" + data.telefone + "', data_nascimento = '" + data.data_nascimento + "', data_adesao = '" + data.data_adesao + "' WHERE cpf = '" + cpf + "'";
  
    // Executa a consulta
    connection.query(query, (err, results) => {
      if (err) {
        // Retorna uma resposta de erro
        res.status(500).json({
          message: "Erro ao editar usuário: " + err,
        });
      } else {
        // Retorna uma resposta de sucesso
        res.status(200).json({
          message: "Usuário editado com sucesso.",
        });
      }
    });
  });

  // Rota para excluir um usuário
app.delete("/socios/:cpf", (req, res) => {
    // Obtém o CPF do usuário a ser excluído
    const cpf = req.params.cpf;
  
    // Prepara a consulta SQL para excluir o usuário
    const query = "DELETE FROM socios WHERE cpf = '" + cpf + "'";
  
    // Executa a consulta
    connection.query(query, (err, results) => {
      if (err) {
        // Retorna uma resposta de erro
        res.status(500).json({
          message: "Erro ao excluir usuário: " + err,
        });
      } else {
        // Retorna uma resposta de sucesso
        res.status(200).json({
          message: "Usuário excluído com sucesso.",
        });
      }
    });
  });