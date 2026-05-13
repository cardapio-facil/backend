const express = require('express');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// ============================================
// ===== MAPEAMENTO DE LOJAS (ATÉ 10) =========
// ============================================
const chaves = {
    'https://painel40grauslafa.vercel.app': process.env.LOJA1,
    'https://loja2.vercel.app': process.env.LOJA2,
    'https://loja3.vercel.app': process.env.LOJA3,
    'https://loja4.vercel.app': process.env.LOJA4,
    'https://loja5.vercel.app': process.env.LOJA5,
    'https://loja6.vercel.app': process.env.LOJA6,
    'https://loja7.vercel.app': process.env.LOJA7,
    'https://loja8.vercel.app': process.env.LOJA8,
    'https://loja9.vercel.app': process.env.LOJA9,
    'https://loja10.vercel.app': process.env.LOJA10
};

// ============================================
// ===== ROTA DE ASSINATURA ===================
// ============================================
app.post('/sign-message', function(req, res) {
    const dominio = req.headers.origin || '';
    const chave = chaves[dominio];
    
    if (!chave) {
        console.error('❌ Domínio não autorizado:', dominio);
        return res.status(403).send('Dominio nao autorizado');
    }
    
    try {
        const signature = crypto
            .createSign('SHA512')
            .update(req.body.request)
            .sign(chave, 'base64');
        
        console.log('✅ Assinatura gerada para:', dominio);
        res.send(signature);
    } catch (err) {
        console.error('❌ Erro ao assinar:', err);
        res.status(500).send('Erro ao assinar');
    }
});

// ============================================
// ===== ROTA DE VERIFICAÇÃO ==================
// ============================================
app.get('/', function(req, res) {
    res.send('QZ Sign Server OK - ' + new Date().toISOString());
});

module.exports = app;
