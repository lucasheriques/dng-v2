import { action } from "./_generated/server";

export const getDiscordMembers = action(async () => {
  try {
    const response = await fetch(
      "https://discord.com/api/v10/guilds/1247029732457971723/preview",
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );

    const guild = await response.json();

    return {
      totalMembers: guild.approximate_member_count as number,
    };
  } catch (error) {
    console.error("Error fetching Discord members:", error);
    return {
      totalMembers: 180,
    };
  }
});
