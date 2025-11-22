const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('diagnostico')
        .setDescription('🔍 Diagnóstico completo del bot y permisos')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const frasesCubanas = require('../utils/frases-cubanas');

        await interaction.deferReply();

        try {
            let diagnostico = `## 🔍 Diagnóstico del Bot\n\n`;
            
            // 1. Información básica
            diagnostico += `**🤖 Bot:**\n`;
            diagnostico += `• Nombre: ${interaction.client.user.tag}\n`;
            diagnostico += `• ID: ${interaction.client.user.id}\n`;
            diagnostico += `• Online: ✅\n\n`;

            // 2. Información del servidor
            diagnostico += `**🏠 Servidor:**\n`;
            diagnostico += `• Nombre: ${interaction.guild.name}\n`;
            diagnostico += `• ID: ${interaction.guild.id}\n`;
            diagnostico += `• Canales actuales: ${interaction.guild.channels.cache.size}\n\n`;

            // 3. Usuario que ejecuta
            diagnostico += `**👤 Usuario:**\n`;
            diagnostico += `• Nombre: ${interaction.user.tag}\n`;
            diagnostico += `• Es admin: ${interaction.member.permissions.has(PermissionFlagsBits.Administrator) ? '✅' : '❌'}\n`;
            diagnostico += `• Puede gestionar canales: ${interaction.member.permissions.has(PermissionFlagsBits.ManageChannels) ? '✅' : '❌'}\n\n`;

            // 4. Permisos del bot
            const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
            diagnostico += `**🤖 Permisos del Bot:**\n`;
            diagnostico += `• Gestionar canales: ${botMember.permissions.has(PermissionFlagsBits.ManageChannels) ? '✅' : '❌'}\n`;
            diagnostico += `• Ver canales: ${botMember.permissions.has(PermissionFlagsBits.ViewChannel) ? '✅' : '❌'}\n`;
            diagnostico += `• Enviar mensajes: ${botMember.permissions.has(PermissionFlagsBits.SendMessages) ? '✅' : '❌'}\n`;
            diagnostico += `• Administrador: ${botMember.permissions.has(PermissionFlagsBits.Administrator) ? '✅' : '❌'}\n\n`;

            // 5. Límites del servidor
            const maxChannels = 500; // Límite estándar de Discord
            const channelsUsed = interaction.guild.channels.cache.size;
            const channelsAvailable = maxChannels - channelsUsed;
            
            diagnostico += `**📊 Límites:**\n`;
            diagnostico += `• Canales usados: ${channelsUsed}/${maxChannels}\n`;
            diagnostico += `• Canales disponibles: ${channelsAvailable}\n`;
            diagnostico += `• Estado: ${channelsAvailable > 10 ? '✅ Suficiente espacio' : '⚠️ Poco espacio'}\n\n`;

            // 6. Test rápido
            diagnostico += `**🧪 Resultado:**\n`;
            
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                diagnostico += `❌ **Problema:** No tienes permisos de administrador\n`;
            } else if (!botMember.permissions.has(PermissionFlagsBits.ManageChannels)) {
                diagnostico += `❌ **Problema:** El bot no tiene permisos para gestionar canales\n`;
            } else if (channelsAvailable < 5) {
                diagnostico += `⚠️ **Problema:** Muy pocos canales disponibles (${channelsAvailable})\n`;
            } else {
                diagnostico += `✅ **Todo parece estar bien** - Los comandos deberían funcionar\n`;
            }

            diagnostico += `\n${frasesCubanas.getRandomFrase()}`;

            await interaction.editReply({
                content: diagnostico
            });

        } catch (error) {
            console.error('Error en diagnóstico:', error);
            await interaction.editReply({
                content: `❌ **Error en el diagnóstico**\n\n${frasesCubanas.getRandomFrase()} Algo raro está pasando, mi loco.\n\n**Error:** ${error.message}`,
                flags: 64
            });
        }
    },
};