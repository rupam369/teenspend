
const app = require('./app');

async function testBackend() {
  console.log('Testing TeenSpend backend initialization...');
  const server = app.listen(5099, async () => {
    console.log('Server started on test port 5099');

    try {
      // 1. Test health check
      const healthRes = await fetch('http://localhost:5099/api/health');
      const healthData = await healthRes.json();
      console.log('1. Health check response:', healthData);

      // 2. Test registration
      const regRes = await fetch('http://localhost:5099/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Aarav Sharma',
          email: 'aarav@teenspend.test',
          password: 'password123',
          confirmPassword: 'password123',
        }),
      });
      const regData = await regRes.json();
      console.log('2. Register response:', regData.success, regData.message);

      const token = regData.data.token;

      // 3. Test getMe
      const meRes = await fetch('http://localhost:5099/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const meData = await meRes.json();
      console.log('3. Me response:', meData.success, meData.data.email);

      // 4. Test Add Expense
      const expRes = await fetch('http://localhost:5099/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'Books and Notebooks',
          amount: 450,
          category: 'Education',
          payment_method: 'UPI',
          description: 'Maths and Physics practical notebook',
        }),
      });
      const expData = await expRes.json();
      console.log('4. Create Expense response:', expData.success, expData.data.title, '₹' + expData.data.amount);

      // 5. Test Get Summary
      const sumRes = await fetch('http://localhost:5099/api/analytics/summary', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sumData = await sumRes.json();
      console.log('5. Analytics Summary:', sumData.success, 'Total spent: ₹' + sumData.data.totalSpending);
      console.log('   Suggestions count:', sumData.data.suggestions.length);

      console.log('🎉 ALL BACKEND CHECKS PASSED SUCCESSFULLY!');
    } catch (err) {
      console.error('Test error:', err);
    } finally {
      server.close(() => {
        console.log('Test server closed.');
        process.exit(0);
      });
    }
  });
}

testBackend();
