// 1. Importar Express
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');

// 2. Criar aplicação
const app = express();

// 3. Definir porta
const PORT = 3000;
const SECRET = 'segredo123';

// 4. Middleware para JSON
app.use(express.json());

const db = new sqlite3.Database('./banco.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT UNIQUE,
            senha TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descricao TEXT,
            status TEXT,
            usuario_id INTEGER,
            FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
        )
    `);

    db.get("SELECT COUNT(*) as total FROM tarefas", (err, row) => {
        if (row.total === 0) {
            const stmt = db.prepare("INSERT INTO tarefas (titulo, descricao, status, usuario_id) VALUES (?, ?, ?, ?)");
            for (let i = 1; i <= 20; i++) {
                stmt.run(`Tarefa ${i}`, `Descrição ${i}`, 'pendente', 1);
            }
            stmt.finalize();
        }
    });

    db.run("INSERT OR IGNORE INTO usuarios (id, usuario, senha) VALUES (1, 'admin', '1234')");
});

function verificarToken(req, res, next) {
    const auth = req.headers.authorization;

    if (!auth) {
        return res.status(401).json({ erro: 'Token não enviado' });
    }

    const token = auth.split(' ')[1];

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ erro: 'Token inválido' });
        }

        req.usuario = decoded;
        next();
    });
}

// 5. Criar primeiro endpoint
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API funcionando',
        status: 'sucesso',
        timestamp: new Date().toISOString()
    });
});

// 6. Endpoint de informações
app.get('/info', (req, res) => {
    res.json({
        nome: 'API REST CRUD SQLite',
        versao: '1.0.0',
        autor: 'Davi'
    });
});

app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;

    db.get(
        "SELECT * FROM usuarios WHERE usuario = ? AND senha = ?",
        [usuario, senha],
        (err, row) => {
            if (!row) {
                return res.status(401).json({ erro: 'Login inválido' });
            }

            const token = jwt.sign(
                { id: row.id, usuario: row.usuario },
                SECRET,
                { expiresIn: '1h' }
            );

            res.json({ token });
        }
    );
});

app.get('/tarefas', verificarToken, (req, res) => {
    let { pagina = 1, limite = 5, ordem = 'id', status } = req.query;

    const offset = (pagina - 1) * limite;

    let sql = `
        SELECT tarefas.*, usuarios.usuario
        FROM tarefas
        JOIN usuarios ON tarefas.usuario_id = usuarios.id
    `;

    let params = [];

    if (status) {
        sql += " WHERE tarefas.status = ?";
        params.push(status);
    }

    sql += ` ORDER BY ${ordem} LIMIT ? OFFSET ?`;
    params.push(Number(limite), Number(offset));

    db.all(sql, params, (err, rows) => {
        res.json(rows);
    });
});

app.get('/tarefas/:id', verificarToken, (req, res) => {
    db.get(
        "SELECT * FROM tarefas WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (!row) {
                return res.status(404).json({ erro: 'Tarefa não encontrada' });
            }

            res.json(row);
        }
    );
});

app.post('/tarefas', verificarToken, (req, res) => {
    const { titulo, descricao, status } = req.body;

    if (!titulo || titulo.length < 3) {
        return res.status(400).json({ erro: 'Título inválido' });
    }

    db.run(
        "INSERT INTO tarefas (titulo, descricao, status, usuario_id) VALUES (?, ?, ?, ?)",
        [titulo, descricao, status || 'pendente', req.usuario.id],
        function (err) {
            res.status(201).json({
                id: this.lastID,
                mensagem: 'Tarefa criada'
            });
        }
    );
});

app.put('/tarefas/:id', verificarToken, (req, res) => {
    const { titulo, descricao, status } = req.body;

    db.run(
        "UPDATE tarefas SET titulo = ?, descricao = ?, status = ? WHERE id = ?",
        [titulo, descricao, status, req.params.id],
        function (err) {
            if (this.changes === 0) {
                return res.status(404).json({ erro: 'Tarefa não encontrada' });
            }

            res.json({ mensagem: 'Tarefa atualizada' });
        }
    );
});

app.delete('/tarefas/:id', verificarToken, (req, res) => {
    db.run(
        "DELETE FROM tarefas WHERE id = ?",
        [req.params.id],
        function (err) {
            if (this.changes === 0) {
                return res.status(404).json({ erro: 'Tarefa não encontrada' });
            }

            res.json({ mensagem: 'Tarefa removida' });
        }
    );
});

// 7. Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});