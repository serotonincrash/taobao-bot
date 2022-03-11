import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const { token, clientId } = require("./config.json");
import glob from 'glob-promise';

let commandFiles = [];
let commands = [];

const guildIds = ['657601463350067220', '742651131653521499']


const rest = new REST({ version: '9' }).setToken(token);

(async () => {

  await glob('./src/commands/**/*.js', { "ignore": ['./src/commands/helpers', './src/commands/helpers/*'] }).then((res) => {
    commandFiles = res;
  })

  for (const file of commandFiles) {
    let command = await import(file);
    commands.push(command.data.toJSON());
  }

  console.log(`Started refreshing ${commands.length} application (/) commands.`);
  for (const guildId of guildIds) {
    await rest.put(
      Routes.applicationGuildCommands(clientId,guildId),
      { body: commands },
    ).then(() => {
      console.log(`Successfully reloaded ${commands.length} application (/) commands for guild ${guildId}.`);
    }).catch((err) => { console.error(err) });
  }
  
})();
