const fs = require('fs').promises;
const path = require('path');
const { ChannelType, ActivityType, EmbedBuilder, Events } = require('discord.js');

async function renderBanner() {
    try {
        const data = await fs.readFile('banner.txt', 'utf8');
        console.log(data);
    } catch (err) {
        console.error('Error reading banner file:', err);
        throw err;
    }
}

async function setPresence(client) {
    const statuses = await readStatuses();
    let index = 0;

    function updatePresence() {
        const status = statuses[index];
        client.user.setPresence({
            activities: [{
                name: status,
                type: ActivityType.Custom
            }],
            status: 'dnd'
        });
        index = (index + 1) % statuses.length;
    }

    updatePresence();
    setInterval(updatePresence, 15000);
}

async function readStatuses() {
    try {
        const statusesData = await fs.readFile('statuses.json', 'utf8');
        return JSON.parse(statusesData);
    } catch (err) {
        console.error('Error reading statuses file:', err);
        throw err;
    }
}

function getChannelIDs(client) {
    const channels = client.channels.cache;
    const array = [];
    for (const channel of channels.values()) {
        if (channel.type !== ChannelType.GuildCategory) {
            array.push({ name: channel.name, id: channel.id });
        }
    }
    console.log(`Found ${array.length} channels.`);
    return array;
}

async function loadCommands(client) {
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = await fs.readdir(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = (await fs.readdir(commandsPath)).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}

async function addRole(client, member) {
    const guild = member.guild;
    const role = guild.roles.cache.find((r) => r.name === 'Slave');
    const logChannel = await client.channels.fetch("1169686017851260978");

    if (role) {
        if (!member.roles.cache.has(role.id)) {
            try {
                await member.roles.add(role);
                console.log(`Added the role ${role.name} to ${member.user.tag}.`);
                logChannel?.send(`Added the role ${role.name} to ${member.user.tag}.`);
            } catch (error) {
                console.error(`Error adding role: ${error}`);
                logChannel?.send(`Error adding role: ${error}`);
            }
        } else {
            console.log(`${member.user.tag} already has the role ${role.name}.`);
            logChannel?.send(`${member.user.tag} already has the role ${role.name}.`);
        }
    } else {
        console.error(`Role not found: 'Slave'`);
        logChannel?.send(`Role not found: 'Slave'`);
    }
}

async function welcomeMessage(client, member) {
    const guild = member.guild;

    const embed = new EmbedBuilder()
        .setColor('#fa0000')
        .setTitle(`Welcome to ${guild.name}!`)
        .setDescription(`Hi **${member.user.username}** 👋\nWe're thrilled to have you join our community here at **${guild.name}** 😈\n\nHere are a few things to get you started 🚀\n\n\n`)
        .addFields(
            { name: '📖 Read the Rules', value: 'Please take a moment to review our server rules to ensure a safe and enjoyable experience for everyone.', inline: false },
            { name: '🗣️ Introduce Yourself', value: "Tell us a bit about yourself. We'd love to get to know you!", inline: false },
            { name: '🚀 Chat and Engage', value: "Whether you're into gaming, art, music, or just casual chatting, we have a place for you.", inline: false },
            { name: '🔔 Stay Updated', value: 'Keep an eye for **FREE GAMES**, **NEW MUSIC RELEASES**, server updates and events!', inline: false },
        )

    client.users.send(member.id, { embeds: [embed] })
}

module.exports = {
    renderBanner,
    setPresence,
    readStatuses,
    getChannelIDs,
    loadCommands,
    addRole,
    welcomeMessage
};