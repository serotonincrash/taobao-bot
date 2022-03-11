import { Client, Collection, Intents } from 'discord.js';
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const { token } = require("./config.json");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
import glob from 'glob-promise';

let commandFiles = [];

// get files and populate the client commands
(async () => {
	await glob('./src/commands/**/*.js', { "ignore": ['./src/commands/helpers', './src/commands/helpers/*'] }).then((res) => {
		commandFiles = res;
	}).catch((err) => {
		console.error(err);
	})
	client.commands = new Collection();
	client.perms = [{
		id: "225968473929547777",
		type: "USER",
		permission: true
	}
	]
	for (const file of commandFiles) {
		let command = await import(file);
		client.commands.set(command.data.name, command);
	}

})();

client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}! ${[...client.commands].length} commands loaded.`);
	let commands = [];
	commands = await client.api.applications(client.user.id).commands.get();
	for (const command of commands) {
		/*
		if (command.default_permission === false) {
			let clientCommand = await client.application?.commands.fetch(command.id);
			await client.application.commands.permissions.set({ guild: "", command: command.id, permissions: client.perms });
			console.log("Permissions added for command " + command.id.toString());
		}
		*/
	}



});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
	}
});

client.login(token);
