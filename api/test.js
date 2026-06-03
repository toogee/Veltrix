// api/test.js - Endpoint de diagnostic simple
module.exports = (req, res) => {
  res.json({
    status: 'OK',
    message: 'Les fonctions API Veltrix fonctionnent correctement !',
    timestamp: new Date().toISOString()
  });
};
