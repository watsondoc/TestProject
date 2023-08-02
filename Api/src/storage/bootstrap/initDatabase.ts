import modelMapper from '../ModelMapper';
const fs = require('fs');

export async function initDatabase() {
    await modelMapper.dropSchema('public', {});
    await modelMapper.createSchema('public', {});
    // TODO: I have no idea why mysql fails if all scripts are in one file
    // PostgreSql has DO BEGIN syntax, so I split it into two
    const installSql = fs.readFileSync(__dirname + '/users.sql', 'utf-8');
    const installSql2 = fs.readFileSync(__dirname + '/posts.sql', 'utf-8');
    // await modelMapper.query(installSql);
    await modelMapper.query(installSql2);
}
