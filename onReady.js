const fs = require('fs');
const { Events, ChannelType, ActivityType } = require('discord.js');
const statusesData = fs.readFileSync('statuses.json');
const statuses = JSON.parse(statusesData);

module.exports = async (client, channels) => {
  client.once(Events.ClientReady, async () => {
    console.log("DEV MODE ENABLED!\n");
    let index = 0;
    
    setPresence(statuses[index]);

   
    setInterval(() => {
        index = (index + 1) % statuses.length;
        setPresence(statuses[index]);
    }, 15000);

    channels = await getChannelIDs();

    function setPresence(status) {
      client.user.setPresence({
        activities: [{
          name: status,
          type: ActivityType.Custom
        }],
        status: 'dnd'
      });
    }

    function getChannelIDs() {
      var array = [];
      let channels = client.channels.cache;
      for (const channel of channels.values()) {
        if (channel.type !== ChannelType.GuildCategory) {
          array.push({ name: channel.name, id: channel.id });
        }
      }
      console.log(array);
      console.log(`Found ${array.length} channels`)
      return array;
    }
  });
};
