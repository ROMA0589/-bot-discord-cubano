const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enviar-dm')
        .setDescription('Envía un mensaje privado a un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario al que enviar el mensaje')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mensaje')
                .setDescription('Mensaje a enviar')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const usuario = interaction.options.getUser('usuario');
        const mensaje = interaction.options.getString('mensaje');
        const { obtenerFrase } = require('../utils/frases-cubanas');

        try {
            await usuario.send(`📩 Mensaje privado de ${interaction.user.tag}:

${mensaje}\n\n${obtenerFrase('saludos')}`);
            await interaction.reply({
                content: `✅ Mensaje enviado a ${usuario.tag} correctamente.`,
                flags: 64
            });
        } catch (error) {
            await interaction.reply({
                content: `❌ No pude enviar el mensaje privado a ${usuario.tag}. Es posible que tenga los DMs cerrados.`,
                flags: 64
            });
        }
    }
};
