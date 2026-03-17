const host: string = process.env.HOST || 'http://localhost:9000';
const config = {
    host: host,
    api: host + '/api',
    operationsType: {
        income: 'income',
        expense: 'expense',
    }
}

export default config;