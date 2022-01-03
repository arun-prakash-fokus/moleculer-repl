"use strict";

const parse = require("yargs-parser");
const kleur = require("kleur");
const fs = require("fs");
const path = require("path");

/**
 * Command logic
 * @param {import("moleculer").ServiceBroker} broker Moleculer's Service Broker
 * @param {Object} args Parsed arguments
 */
async function loadHandler(broker, args) {
	let filePath = path.resolve(args.servicePath);
	if (fs.existsSync(filePath)) {
		console.log(kleur.yellow(`>> Load '${filePath}'...`));
		let service = broker.loadService(filePath);
		if (service) console.log(kleur.green(">> Loaded successfully!"));
	} else {
		console.warn(kleur.red("The service file is not exists!", filePath));
	}
}

/**
 * Command logic
 * @param {import("moleculer").ServiceBroker} broker Moleculer's Service Broker
 * @param {Object} args Parsed arguments
 */
async function loadFolderHandler(broker, args) {
	let filePath = path.resolve(args.serviceFolder);
	if (fs.existsSync(filePath)) {
		console.log(kleur.yellow(`>> Load services from '${filePath}'...`));
		const count = broker.loadServices(filePath, args.fileMask);
		console.log(kleur.green(`>> Loaded ${count} services!`));
	} else {
		console.warn(kleur.red("The folder is not exists!", filePath));
	}
}

/**
 * Command option declarations
 * @param {import("commander").Command} program Commander
 * @param {import("moleculer").ServiceBroker} broker Moleculer's Service Broker
 */
function declaration(program, broker) {
	// Register load command
	program
		.command("load <servicePath>")
		.description("Load a service from file")
		.hook("preAction", (thisCommand) => {
			// Parse the args that commander.js managed to process
			let parsedArgs = { ...thisCommand._optionValues };
			delete parsedArgs._;

			// Set the params
			thisCommand.params = {
				options: parsedArgs,
				rawCommand: thisCommand.args.join(" "),
			};
		})
		.action(async function () {
			// Get the params
			await loadHandler(broker, this.params);

			// Clear the parsed values for next execution
			this._optionValues = {};
		});

	// Register loadFolder command
	program
		.command("loadFolder <serviceFolder> [fileMask]")
		.description("Load all services from folder")
		.hook("preAction", (thisCommand) => {
			// Parse the args that commander.js managed to process
			let parsedArgs = { ...thisCommand._optionValues };
			delete parsedArgs._;

			// Set the params
			thisCommand.params = {
				options: parsedArgs,
				rawCommand: thisCommand.args.join(" "),
			};
		})
		.action(async function () {
			// Get the params
			await loadFolderHandler(broker, this.params);

			// Clear the parsed values for next execution
			this._optionValues = {};
		});
}

module.exports = { declaration, loadHandler, loadFolderHandler };
