
const employee = [
    {
    "employee_id": 1,
    "name": "demo account",
    "email": "demo@demo.com",
    "password": "$2b$10$N9ynZzcYMdGREDkn0vab6.9.g7nXRJ0Kbfl4totnPbzuJ4ID112k.",
    "updatedAt": "2026-03-16T23:51:49.774Z",
    "createdAt": "2026-03-16T23:51:49.774Z"
    }
]

module.exports = {

 async up(queryInterface, Sequelize) {

  const data = employee.map(p => ({
   ...p,
   createdAt: new Date(),
   updatedAt: new Date()
  }))

  await queryInterface.bulkInsert('employee', data)

 },

 async down(queryInterface, Sequelize) {

  await queryInterface.bulkDelete('employee', null, {})

 }

}