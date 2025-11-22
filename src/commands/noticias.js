const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('noticias')
        .setDescription('📰 Muestra las últimas noticias de videojuegos (IGN)')
        .addStringOption(option =>
            option.setName('juego')
                .setDescription('Filtrar por nombre de juego (opcional)')
                .setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply();
        const juego = interaction.options.getString('juego');
        try {
            // Usamos el RSS de IGN para videojuegos
            const rssUrl = 'https://feeds.ign.com/ign/games-all';
            const res = await fetch(rssUrl);
            const xml = await res.text();

            // Extraer los títulos y enlaces de las noticias (simple parsing)
            const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 5);
            let noticias = [];
            for (const item of items) {
                const titulo = item[1].match(/<title>([\s\S]*?)<\/title>/)?.[1] || 'Sin título';
                const link = item[1].match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
                if (!juego || titulo.toLowerCase().includes(juego.toLowerCase())) {
                    noticias.push({ titulo, link });
                }
            }

            if (noticias.length === 0) {
                await interaction.editReply('❌ No se encontraron noticias para ese juego.');
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('📰 Últimas noticias de videojuegos')
                .setDescription('Fuente: IGN')
                .addFields(noticias.map(n => ({ name: n.titulo, value: `[Leer más](${n.link})`, inline: false })))
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply('❌ Error obteniendo noticias: ' + error.message);
        }
    },
};
