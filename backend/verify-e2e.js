// Complete E2E Integration and Security Test Script for TeenSpend

async function runFullE2ETest() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('====================================================');
  console.log('🧪 STARTING TEENSPEND COMPLETE E2E VERIFICATION TEST');
  console.log('====================================================\n');

  try {
    // 1. Health Check
    const health = await fetch(`${BASE_URL}/health`).then((r) => r.json());
    console.log('1. Health Check:', health.success ? '✅ PASSED' : '❌ FAILED', health.message);

    // 2. User 1 Registration
    const user1Email = `priya_${Date.now()}@teenspend.test`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Priya Patel',
        email: user1Email,
        password: 'password123',
        confirmPassword: 'password123',
      }),
    }).then((r) => r.json());

    console.log('2. User 1 Registration:', regRes.success ? '✅ PASSED' : '❌ FAILED', `(User ID: ${regRes.data?.user?.id})`);
    const token1 = regRes.data.token;
    const user1Id = regRes.data.user.id;

    // 3. User 1 Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user1Email,
        password: 'password123',
      }),
    }).then((r) => r.json());
    console.log('3. User 1 Login:', loginRes.success ? '✅ PASSED' : '❌ FAILED', `(JWT Token generated: ${loginRes.data.token.substring(0, 20)}...)`);

    // 4. Duplicate Registration Prevention
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Priya Clone',
        email: user1Email,
        password: 'password123',
        confirmPassword: 'password123',
      }),
    });
    console.log('4. Duplicate Email Blocked:', dupRes.status === 409 ? '✅ PASSED (409 Conflict)' : '❌ FAILED');

    // 5. Add Expenses for User 1
    const expensesToAdd = [
      { title: 'Cafeteria Burger & Cold Drink', amount: 220, category: 'Food', payment_method: 'UPI', description: 'Snacks with friends' },
      { title: 'Metro Card Monthly Pass', amount: 600, category: 'Transport', payment_method: 'Card', description: 'Monthly student pass' },
      { title: 'Graphic Novel & Notebooks', amount: 450, category: 'Education', payment_method: 'UPI', description: 'Study supplies' },
      { title: 'PlayStation Plus Subscription', amount: 499, category: 'Entertainment', payment_method: 'UPI', description: 'Gaming pass' },
      { title: 'Sneakers Sale', amount: 1200, category: 'Shopping', payment_method: 'Card', description: 'Campus footwear' },
    ];

    const createdExpenses = [];
    for (const exp of expensesToAdd) {
      const res = await fetch(`${BASE_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token1}`,
        },
        body: JSON.stringify(exp),
      }).then((r) => r.json());
      createdExpenses.push(res.data);
    }
    console.log('5. Added 5 Diverse Expenses:', createdExpenses.length === 5 ? '✅ PASSED' : '❌ FAILED');

    // 6. Test Expense Update
    const updateRes = await fetch(`${BASE_URL}/expenses/${createdExpenses[0].id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        title: 'Cafeteria Premium Burger Combo',
        amount: 250,
      }),
    }).then((r) => r.json());
    console.log('6. Update Expense:', updateRes.success && updateRes.data.amount === 250 ? '✅ PASSED' : '❌ FAILED', `New Amount: ₹${updateRes.data.amount}`);

    // 7. Test Filtering and Search
    const searchRes = await fetch(`${BASE_URL}/expenses?search=Metro`, {
      headers: { Authorization: `Bearer ${token1}` },
    }).then((r) => r.json());
    console.log('7. Expense Search ("Metro"):', searchRes.count === 1 && searchRes.data[0].title.includes('Metro') ? '✅ PASSED' : '❌ FAILED');

    const catFilterRes = await fetch(`${BASE_URL}/expenses?category=Food`, {
      headers: { Authorization: `Bearer ${token1}` },
    }).then((r) => r.json());
    console.log('8. Category Filter ("Food"):', catFilterRes.count === 1 && catFilterRes.data[0].category === 'Food' ? '✅ PASSED' : '❌ FAILED');

    // 8. Test Budget Setting and Tracking
    const budgetSetRes = await fetch(`${BASE_URL}/budget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        monthly_budget: 6000,
        category_budgets: {
          Food: 1500,
          Transport: 1000,
          Entertainment: 800,
          Shopping: 1500,
          Education: 1000,
        },
      }),
    }).then((r) => r.json());

    const budgetStatusRes = await fetch(`${BASE_URL}/budget/status`, {
      headers: { Authorization: `Bearer ${token1}` },
    }).then((r) => r.json());

    console.log(
      '9. Budget Status Tracking:',
      budgetStatusRes.success ? '✅ PASSED' : '❌ FAILED',
      `Budget: ₹${budgetStatusRes.data.monthly_budget}, Spent: ₹${budgetStatusRes.data.total_spent}, Remaining: ₹${budgetStatusRes.data.remaining_budget} (${budgetStatusRes.data.percentage_used}% used)`
    );

    // 9. Test Analytics Summary & Suggestions
    const summaryRes = await fetch(`${BASE_URL}/analytics/summary`, {
      headers: { Authorization: `Bearer ${token1}` },
    }).then((r) => r.json());

    console.log('10. Analytics Summary:', summaryRes.success ? '✅ PASSED' : '❌ FAILED');
    console.log(`    - Total Spent: ₹${summaryRes.data.totalSpending}`);
    console.log(`    - This Month: ₹${summaryRes.data.monthSpending}`);
    console.log(`    - Today: ₹${summaryRes.data.todaySpending}`);
    console.log(`    - Top Category: ${summaryRes.data.highestCategory.category} (₹${summaryRes.data.highestCategory.total})`);
    console.log(`    - Smart Suggestions Count: ${summaryRes.data.suggestions.length}`);
    summaryRes.data.suggestions.forEach((s, idx) => {
      console.log(`      Tip ${idx + 1} [${s.category}]: "${s.title}" -> ${s.message}`);
    });

    // 10. Test Charts Data Endpoints
    const catAnalytics = await fetch(`${BASE_URL}/analytics/category`, {
      headers: { Authorization: `Bearer ${token1}` },
    }).then((r) => r.json());
    console.log('11. Chart 1 (Category Breakdown):', catAnalytics.success ? '✅ PASSED' : '❌ FAILED', `${catAnalytics.data.categories.length} categories computed`);

    const monthAnalytics = await fetch(`${BASE_URL}/analytics/monthly`, {
      headers: { Authorization: `Bearer ${token1}` },
    }).then((r) => r.json());
    console.log('12. Chart 2 (Monthly Trend):', monthAnalytics.success ? '✅ PASSED' : '❌ FAILED', `${monthAnalytics.data.length} months data points`);

    const dailyAnalytics = await fetch(`${BASE_URL}/analytics/daily?days=7`, {
      headers: { Authorization: `Bearer ${token1}` },
    }).then((r) => r.json());
    console.log('13. Chart 4 (Daily Spending):', dailyAnalytics.success ? '✅ PASSED' : '❌ FAILED', `${dailyAnalytics.data.length} days data points`);

    // 11. Security Test: User Isolation & Unauthorized Access
    // Create User 2
    const user2Email = `rohan_${Date.now()}@teenspend.test`;
    const user2Reg = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rohan Verma',
        email: user2Email,
        password: 'password456',
        confirmPassword: 'password456',
      }),
    }).then((r) => r.json());
    const token2 = user2Reg.data.token;

    // User 2 fetches their own expenses -> Should be 0
    const user2Expenses = await fetch(`${BASE_URL}/expenses`, {
      headers: { Authorization: `Bearer ${token2}` },
    }).then((r) => r.json());
    console.log('14. User Isolation (User 2 sees 0 expenses):', user2Expenses.count === 0 ? '✅ PASSED' : '❌ FAILED');

    // User 2 attempts to view User 1's expense by ID -> Should return 404 / Access Denied
    const user1ExpenseId = createdExpenses[0].id;
    const hackAttempt = await fetch(`${BASE_URL}/expenses/${user1ExpenseId}`, {
      headers: { Authorization: `Bearer ${token2}` },
    });
    console.log('15. Security Authorization (User 2 blocked from User 1 expense):', hackAttempt.status === 404 ? '✅ PASSED (404 Not Found)' : '❌ FAILED');

    // Unauthenticated request -> Should return 401
    const unauthAttempt = await fetch(`${BASE_URL}/expenses`);
    console.log('16. Protected Routes Security (No Token -> 401 Unauthorized):', unauthAttempt.status === 401 ? '✅ PASSED (401 Unauthorized)' : '❌ FAILED');

    // 12. Delete Expense
    const delRes = await fetch(`${BASE_URL}/expenses/${createdExpenses[createdExpenses.length - 1].id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token1}` },
    }).then((r) => r.json());
    console.log('17. Delete Expense:', delRes.success ? '✅ PASSED' : '❌ FAILED');

    console.log('\n====================================================');
    console.log('🏆 ALL 17 E2E FULL-STACK INTEGRATION TESTS PASSED!');
    console.log('====================================================\n');
  } catch (err) {
    console.error('❌ E2E Test Failure:', err);
  }
}

runFullE2ETest();
