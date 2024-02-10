const { REST, Routes } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

require("dotenv").config();

async function loadCommands() {
    try {
        const foldersPath = path.join(__dirname, 'commands');
        const commandFolders = await fs.readdir(foldersPath);

        const commands = await Promise.all(commandFolders.map(async folder => {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = (await fs.readdir(commandsPath)).filter(file => file.endsWith('.js'));
            return Promise.all(commandFiles.map(async file => {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                if (command.hasOwnProperty('data') && command.hasOwnProperty('execute')) {
                    return command.data.toJSON();
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                    return null;
                }
            }));
        }));

        const flattenedCommands = commands.flat().filter(command => command !== null);
        console.log(`Loaded ${flattenedCommands.length} application (/) commands.`);
        return flattenedCommands;
    } catch (error) {
        console.error("Error while loading commands:", error);
        return [];
    }
}

async function refreshCommands() {
    try {
        const commands = await loadCommands();

        const rest = new REST({ version: '9' }).setToken(process.env.CLIENT_TOKEN);

        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.APP_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error("Error while refreshing commands:", error);
    }
}

refreshCommands();
