import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Tests whether the bot is up.');
export async function execute(interaction) {
	await interaction.reply({ content: `Pong! ${Date.now() - interaction.createdAt}ms latency, ${interaction.client.ws.ping}ms API latency`, ephemeral: true });
}