const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Muestra información sobre el bot y sus capacidades'),

    async execute(interaction) {
        const bot = interaction.client;
        const server = interaction.guild;

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('🇨🇺 Asere, ¿qué bolá? - Info del Bot')
            .setThumbnail(bot.user.displayAvatarURL())
            .addFields(
                { 
                    name: '📊 Los Números, Asere', 
                    value: `**Servidores:** ${bot.guilds.cache.size}\n**La Gente Conectada:** ${bot.users.cache.size}\n**Canales:** ${bot.channels.cache.size}`, 
                    inline: true 
                },
                { 
                    name: '⚙️ La Cosa Que Hace Este Bot', 
                    value: '• **Maneja los Canales**\n  - Crear, modificar, borrar\n• **Controla los Roles**\n  - Crear, dar, quitar\n• **Modera Como Un Jefe**\n  - Ban, kick, timeout, limpiar\n• **¡Coger un diez siempre!**', 
                    inline: true 
                },
                { 
                    name: '🔧 Los Comandos Que Tienes', 
                    value: '`/crear-canal` - Crear canales nuevos\n`/modificar-canal` - Modificar los que ya tienes\n`/eliminar-canal` - Borrar canales\n`/crear-rol` - Crear roles nuevos\n`/asignar-rol` - Dar o quitar roles\n`/moderar` - Para moderar el server\n`/info` - Ver esta info', 
                    inline: false 
                }
            )
            .setFooter({ 
                text: `Bot hecho pa' la gente de ${server.name} - Dale pa' que veas 🇨🇺`, 
                iconURL: server.iconURL() 
            })
            .setTimestamp();

        // Información adicional del servidor
        if (server) {
            embed.addFields({
                name: '🏠 Información del Servidor',
                value: `**Nombre:** ${server.name}\n**Miembros:** ${server.memberCount}\n**Creado:** <t:${Math.floor(server.createdTimestamp / 1000)}:D>`,
                inline: true
            });
        }

        await interaction.reply({ embeds: [embed] });
    }
};