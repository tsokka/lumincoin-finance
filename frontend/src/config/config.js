const host = process.env.HOST;
const config = {
    host: host,
    api: host + '/api',
    operationsType: {
        income: 'income',
        expense: 'expense',
    }
}

export default config;