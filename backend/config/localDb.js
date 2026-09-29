const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'database', 'local_data.json');

const defaultData = {
  users: [],
  expenses: [],
  budgets: [],
};

// Ensure database directory and file exist
function initLocalDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

function readData() {
  initLocalDb();
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local db file, resetting to defaults:', err.message);
    return { ...defaultData };
  }
}

function writeData(data) {
  initLocalDb();
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to local db file:', err.message);
  }
}

module.exports = {
  readData,
  writeData,
};
