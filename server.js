const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./database.db');

const port = 3000;

//processar o header da requisão caso tenha um json
app.use(bodyParser.json());

//rotas da aplicação
app.get('/', (req, res) => {
	res.send('Hellow World');
});

app.get('/tarefas', (req, res) => {
	db.all('SELECT * FROM TAREFAS', (err, rows) =>
		res.send(JSON.stringify({status: 'Ok', results: rows}))
	);
});

app.get('/tarefas/:id/', (req, res) => {
	db.all(
		'SELECT * FROM TAREFAS WHERE id LIKE ?',
		[req.params.id],
		(err, rows) => res.send(rows)
	);
});

app.post('/tarefas', (req, res) => {
	//inserir no banco os dados enviados como JSON
	//receber os dados JSON
	//passar os dados para uma query
	db.run(
		`INSERT INTO TAREFAS (titulo, descricao, status)
    VALUES (?, ?, ?)`,
		[req.body.titulo, req.body.descricao, req.body.status]
	);
	console.log(req.body);
	res.status(200).send('Requisição enviada');
});

app.delete('/tarefas/:id', (req, res) => {
	db.run(`DELETE FROM TAREFAS WHERE id = ?`, [req.params.id]);
	res.status(200).send('Requisição enviada');
});

app.put('/tarefas/:id', (req, res) => {
	db.run(
		`UPDATE TAREFAS SET titulo = ?, descricao = ?, status = ? where id =?`,
		[req.body.titulo, req.body.descricao, req.body.status, req.params.id]
	);
	res.status(200).send('Tarefa Atualizada');
});

/*app.put('/tarefas/:id', (req, resp) => {
	db.run(
		`UPDATE TAREFAS SET titulo = ?, descricao = ?, status = ? where id =?`,
		[req.body.titulo, req.body.descricao, req.body.status, req.params.id],
		(err) => {
			if (err) console.log('Deu ruim');
		}
	);

	resp.status(200).send('Item modificado');
});*/

process.on('SIGINT', () => {
	db.close((err) => {
		console.log('Banco encerrado com sucesso!');
		process.exit(0);
	});
});

app.listen(port, () => {
	console.log(`Server running on port http://localhost:${port}`);
});
