module.exports = {
    up: async (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'Users', // table name
                'vkontakteId', // new field name
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                }
            ),
            queryInterface.addColumn('Users', 'odnoklassnikiId', {
                type: Sequelize.STRING,
                allowNull: true,
            }),
            queryInterface.addColumn('Users', 'facebookId', {
                type: Sequelize.STRING,
                allowNull: true,
            }),
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
    },
};
