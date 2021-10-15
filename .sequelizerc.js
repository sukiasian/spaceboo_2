import 'path';

const db = 'database';

module.exports = {
    config: path.resolve(db, 'config', 'config.json'),
    'migrations-path': path.resolve(db, 'migrations', '20210911113129-modify_users_add_new_fields.ts'),
    'models-path': path.resolve(db, 'models'),
    'seeders-path': path.resolve(db, 'seeders'),
};
