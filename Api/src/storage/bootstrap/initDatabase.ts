import modelMapper from '../ModelMapper';
const fs = require('fs');

export async function initDatabase() {
    await modelMapper.dropSchema('public', {});
    await modelMapper.createSchema('public', {});
    const installSql = fs.readFileSync(__dirname + '/posts.sql', 'utf-8');
    await modelMapper.query(installSql);
}
