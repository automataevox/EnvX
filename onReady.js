const ip = require("ip");
const { Events, ChannelType, ActivityType } = require('discord.js');

module.exports = async (client, channels) => {
  client.once(Events.ClientReady, async () => {
    console.log("DEV MODE ENABLED!\n");    
    client.user.setPresence({
      activities: [
        {
          name: "We will take over the world!",
          type: ActivityType.Custom,
        },
      ],
      status: "dnd",
    });
    
    channels = await getChannelIDs();
    
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
