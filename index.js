const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits  } = require('discord.js');
const onReady = require('./onReady');
const mainFunctions = require('./mainFunctions');

require("dotenv").config();

var channels, roles;

const client = new Client(
    { 
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers
        ]
    }
);

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

onReady(client, channels);
mainFunctions(client, channels, roles);


client.login(process.env.CLIENT_TOKEN);