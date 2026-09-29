const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
=====================================================
🚀 TeenSpend Server running in ${process.env.NODE_ENV || 'development'} mode!
🌐 URL: http://localhost:${PORT}
🩺 Health Check: http://localhost:${PORT}/api/health
=====================================================
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = server;
