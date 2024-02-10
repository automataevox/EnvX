const { Client, GatewayIntentBits } = require('discord.js');
const initializeFunctions = require('./functions');
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Map();

(async () => {
    await initializeFunctions.renderBanner();
    console.log("Initializing...");

    client.once('ready', async () => {
        try {
            await initializeFunctions.loadCommands(client);
            console.log("Initializing finished.");
            await initializeFunctions.setPresence(client);
        } catch (error) {
            console.error("Error during initialization:", error);
        }
    });

    await client.login(process.env.CLIENT_TOKEN);
})();

module.exports = client;
