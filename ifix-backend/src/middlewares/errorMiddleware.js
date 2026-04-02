const errorMiddleware = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Dados inválidos.',
      details: err.errors?.map((e) => e.message),
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor.';

  res.status(status).json({ error: message });
};

const notFoundMiddleware = (req, res) => {
  res.status(404).json({ error: `Rota ${req.method} ${req.path} não encontrada.` });
};

module.exports = { errorMiddleware, notFoundMiddleware };