// 1. Importação dos pacotes necessários
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 2. Configuração inicial
const app = express();
const PORT = 3000;
const JWT_SECRET = 'seu_segredo_super_secreto_pode_ser_qualquer_coisa';
const MONGO_URI = 'mongodb+srv://admin:B2UDpYdwy8sg8DSa@cluster0.klszy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// 3. Middlewares
app.use(cors());
app.use(express.json());

// 4. Conexão com o Banco de Dados
mongoose.connect(MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB com sucesso!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// 5. Definições de Schema e Modelos
// Modelo de Usuário
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// Modelo de Coleta (ATUALIZADO)
const ColetaSchema = new mongoose.Schema({
    origem: { type: String, required: true },
    pecas: {
        camisaMalha: { type: Number, default: 0 },
        gandolaRipstop: { type: Number, default: 0 },
        calcaRipstop: { type: Number, default: 0 },
        chapeuRipstop: { type: Number, default: 0 },
        camisaOxford: { type: Number, default: 0 },
        calcaOxford: { type: Number, default: 0 },
        chapeuOxford: { type: Number, default: 0 }
    },
    // NOVO CAMPO para peças dinâmicas
    outrasPecas: [{
        tipo: String,
        peso: Number,
        co2: Number
    }],
    pesoTotalKg: { type: Number, required: true },
    co2EvitadoKg: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    registadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Coleta = mongoose.model('Coleta', ColetaSchema);


// 6. Middleware de Autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};


// 7. Rotas da API

// --- ROTAS DE AUTENTICAÇÃO ---
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Este email já está em uso.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
        res.status(200).json({ message: 'Login bem-sucedido!', token });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


// --- ROTAS DE COLETA (CRUD) ---

// ROTA PARA SALVAR NOVA COLETA (ATUALIZADA)
app.post('/api/coletas', authenticateToken, async (req, res) => {
    try {
        const { origem, pecas, outrasPecas } = req.body;
        const userId = req.user.id;

        const fatores = {
            camisaMalha: { peso: 0.25, co2: 7.5 },
            gandolaRipstop: { peso: 0.80, co2: 24.0 },
            calcaRipstop: { peso: 0.70, co2: 21.0 },
            chapeuRipstop: { peso: 0.15, co2: 4.5 },
            camisaOxford: { peso: 0.30, co2: 9.0 },
            calcaOxford: { peso: 0.60, co2: 18.0 },
            chapeuOxford: { peso: 0.12, co2: 3.6 }
        };

        let pesoTotal = 0;
        let co2Total = 0;

        for (const peca in pecas) {
            if (pecas[peca] > 0) {
                pesoTotal += pecas[peca] * fatores[peca].peso;
                co2Total += pecas[peca] * fatores[peca].co2;
            }
        }

        if (outrasPecas && outrasPecas.length > 0) {
            outrasPecas.forEach(peca => {
                pesoTotal += peca.peso || 0;
                co2Total += peca.co2 || 0;
            });
        }

        const novaColeta = new Coleta({
            origem,
            pecas,
            outrasPecas,
            pesoTotalKg: pesoTotal,
            co2EvitadoKg: co2Total,
            registadoPor: userId
        });

        await novaColeta.save();
        res.status(201).json({ message: 'Coleta registada com sucesso!', coleta: novaColeta });

    } catch (error) {
        console.error("Erro ao salvar coleta:", error);
        res.status(500).json({ message: 'Erro interno do servidor ao salvar a coleta.' });
    }
});

// Rota para buscar todas as coletas
app.get('/api/coletas', authenticateToken, async (req, res) => {
    try {
        const coletas = await Coleta.find().sort({ timestamp: -1 });
        res.status(200).json(coletas);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Rota para apagar uma coleta
app.delete('/api/coletas/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedColeta = await Coleta.findByIdAndDelete(id);
        if (!deletedColeta) {
            return res.status(404).json({ message: 'Coleta não encontrada.' });
        }
        res.status(200).json({ message: 'Coleta apagada com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Rota para editar uma coleta
app.put('/api/coletas/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { origem, pecas, outrasPecas } = req.body;

         const fatores = {
            camisaMalha: { peso: 0.25, co2: 7.5 },
            gandolaRipstop: { peso: 0.80, co2: 24.0 },
            calcaRipstop: { peso: 0.70, co2: 21.0 },
            chapeuRipstop: { peso: 0.15, co2: 4.5 },
            camisaOxford: { peso: 0.30, co2: 9.0 },
            calcaOxford: { peso: 0.60, co2: 18.0 },
            chapeuOxford: { peso: 0.12, co2: 3.6 }
        };

        let pesoTotal = 0;
        let co2Total = 0;

        for (const peca in pecas) {
            if (pecas[peca] > 0) {
                pesoTotal += pecas[peca] * fatores[peca].peso;
                co2Total += pecas[peca] * fatores[peca].co2;
            }
        }
        
        if (outrasPecas && outrasPecas.length > 0) {
            outrasPecas.forEach(peca => {
                pesoTotal += peca.peso || 0;
                co2Total += peca.co2 || 0;
            });
        }

        const updatedData = {
            origem,
            pecas,
            outrasPecas,
            pesoTotalKg: pesoTotal,
            co2EvitadoKg: co2Total
        };

        const updatedColeta = await Coleta.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedColeta) {
            return res.status(404).json({ message: 'Coleta não encontrada.' });
        }
        res.status(200).json({ message: 'Coleta atualizada com sucesso!', coleta: updatedColeta });
    } catch (error) {
        console.error("Erro ao editar coleta:", error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


// 8. Inicia o Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});

