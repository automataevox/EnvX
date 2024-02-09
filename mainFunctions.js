const { EmbedBuilder, Events } = require('discord.js');

module.exports = (client) => {
    client.once(Events.GuildMemberAdd, async (member) => {
      addRole(client, member);
      welcomeMessage(client, member);
    });

    client.once(Events.InteractionCreate, async interaction => {
      if (!interaction.isChatInputCommand()) return;
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
      }
    });
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

async function welcomeMessage(client, member){
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

  client.users.send(member.id, {embeds: [embed] })
}