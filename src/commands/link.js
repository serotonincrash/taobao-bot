import { SlashCommandBuilder } from '@discordjs/builders';
import fetch from 'node-fetch';
import djs from 'discord.js';
const { MessageEmbed } = djs;
export const data = new SlashCommandBuilder()
	.setName('link')
	.setDescription('Clean up a taobao link. Supports m.taobao and taobao.com links.')
	.addStringOption(option => option
		.setName("url")
		.setDescription("The URL to clean up.")
		.setRequired(true)
	);
export async function execute(interaction) {
	let url = new URL(interaction.options.getString("url"));
	console.log(url.host);
	console.log(url.href);
	console.log(url.protocol);
	if (!url.searchParams.has("id")) {
		await interaction.reply({ content: "This URL doesn't have a valid ID!", ephemeral: true });
		return;
	}
	if (!(url.host !== "item.taobao.com" || url.host !== "detail.tmall.com")) {
		await interaction.reply({ content: "Invalid taobao URL!", ephemeral: true });
		return;
	}
	if (url.protocol !== "https:") {
		await interaction.reply({ content: "Invalid protocol!", ephemeral: true });
		return;
	}

	let itemID = url.searchParams.get("id");

	let newURL = new URL(url.origin + url.pathname);
	newURL.searchParams.append("id", itemID);

	console.log(newURL.href);
	const sender = interaction.user;
	const channel = interaction.channel;
	const embed = new MessageEmbed()
		.setColor("#ff4404")
		.setTitle("Cleaned-up link")
		.setDescription(newURL.href)
		.setAuthor({ name: `Requested from ${sender.username + "#" + sender.discriminator}`, iconURL: sender.avatarURL() });

	await interaction.reply({ embeds: [embed] });




}