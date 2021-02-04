/* eslint-disable no-unused-vars */
const { Sequelize } = require('sequelize');
const path = require('path');
const { defineTask } = require('../tasks/model');
const { defineWorker } = require('../workers/model');
/**
 * setup relation ship
 * @param {Sequelize} orm sequalize instance
 */
function setupRelationship(orm) {
  worker = defineWorker(orm);
  task = defineTask(orm);

  task.belongsTo(worker, {
    onDelete: 'cascade',
    foreignKey: 'assigneeId',
  });
}

async function init() {
  const orm = new Sequelize('sanbercode1', 'postgres', 'postgres', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false,
  });
  await orm.authenticate();
  setupRelationship(orm);
  await orm.drop({ cascade: true });
  await orm.sync({ force: true, alter: true });
}

async function write(table, data) {
	switch(table){
		case 'worker':
			return worker.create(data);
		case 'task':
			return task.create(data);
		default:
			return "table not found;"
	}
}

async function read(table){
  switch(table){
		case 'worker':
			return worker.findAll();
		case 'task':
			return task.findAndCountAll({
				include: worker,
			});
		default:
			return "table not found;"
	}
}

async function del(table, idx) {
	switch(table){
		case 'worker':
			return worker.destroy({
				where: {
					id: idx
				}
			});
		case 'task':
			return task.destroy({
				where: {
					id: idx
				}
			});
		default:
			return "table not found;"
	}
}

module.exports = {
	init,
};