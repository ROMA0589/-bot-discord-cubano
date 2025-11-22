const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eliminar-canal')
        .setDescription('Elimina un canal del servidor')
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal a eliminar')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('Razón para eliminar el canal')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const canal = interaction.options.getChannel('canal');
        const razon = interaction.options.getString('razon') || 'No especificada';

        // Verificar permisos del bot
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({
                content: '❌ No tengo permisos para gestionar canales.',
                flags: 64
            });
        }

        // Confirmación antes de eliminar
        const embed = {
            color: 0xff6b6b,
            title: '⚠️ Confirmar Eliminación de Canal',
            description: `¿Estás seguro de que quieres eliminar el canal **${canal.name}**?`,
            fields: [
                { name: 'Canal', value: `<#${canal.id}>`, inline: true },
                { name: 'Tipo', value: canal.type.toString(), inline: true },
                { name: 'Razón', value: razon, inline: false }
            ],
            footer: {
                text: 'Esta acción no se puede deshacer'
            }
        };

        const row = {
            type: 1,
            components: [
                {
                    type: 2,
                    style: 4, // Danger
                    label: 'Eliminar Canal',
                    custom_id: 'confirmar_eliminar',
                    emoji: { name: '🗑️' }
                },
                {
                    type: 2,
                    style: 2, // Secondary
                    label: 'Cancelar',
                    custom_id: 'cancelar_eliminar',
                    emoji: { name: '❌' }
                }
            ]
        };

        const response = await interaction.reply({
            embeds: [embed],
            components: [row],
            flags: 64
        });

        try {
            const confirmacion = await response.awaitMessageComponent({
                filter: i => i.user.id === interaction.user.id,
                time: 30000
            });

            if (confirmacion.customId === 'confirmar_eliminar') {
                // Guardar información del canal antes de eliminarlo
                const infoCanal = {
                    name: canal.name,
                    type: canal.type,
                    id: canal.id
                };

                await canal.delete(razon);

                const successEmbed = {
                    color: 0x00ff00,
                    title: '✅ Canal Eliminado',
                    fields: [
                        { name: 'Nombre', value: infoCanal.name, inline: true },
                        { name: 'ID', value: infoCanal.id, inline: true },
                        { name: 'Razón', value: razon, inline: false }
                    ],
                    footer: {
                        text: `Eliminado por ${interaction.user.tag}`,
                        icon_url: interaction.user.displayAvatarURL()
                    },
                    timestamp: new Date().toISOString()
                };

                await confirmacion.update({
                    embeds: [successEmbed],
                    components: []
                });

            } else {
                await confirmacion.update({
                    content: '❌ Eliminación cancelada.',
                    embeds: [],
                    components: []
                });
            }

        } catch (error) {
            if (error.name === 'Error [InteractionCollectorError]') {
                await interaction.editReply({
                    content: '❌ Tiempo agotado. Eliminación cancelada.',
                    embeds: [],
                    components: [],
                    flags: 64
                });
            } else {
                console.error('Error eliminando canal:', error);
                await interaction.editReply({
                    content: '❌ Error al eliminar el canal.',
                    embeds: [],
                    components: [],
                    flags: 64
                });
            }
        }
    }
};