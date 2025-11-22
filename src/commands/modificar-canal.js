const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

function getModificacionesYCambios(canal, nuevoNombre, nuevaDescripcion, limiteUsuarios, nsfw) {
    const modificaciones = {};
    const cambios = [];

    if (nuevoNombre) {
        modificaciones.name = nuevoNombre;
        cambios.push(`Nombre: ${canal.name} → ${nuevoNombre}`);
    }

    if (nuevaDescripcion !== null) {
        modificaciones.topic = nuevaDescripcion;
        cambios.push(`Descripción: ${nuevaDescripcion || 'Eliminada'}`);
    }

    if (limiteUsuarios !== null && canal.isVoiceBased()) {
        modificaciones.userLimit = limiteUsuarios;
        cambios.push(`Límite de usuarios: ${limiteUsuarios === 0 ? 'Sin límite' : limiteUsuarios}`);
    }

    if (nsfw !== null && canal.isTextBased()) {
        modificaciones.nsfw = nsfw;
        cambios.push(`NSFW: ${nsfw ? 'Activado' : 'Desactivado'}`);
    }

    return { modificaciones, cambios };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modificar-canal')
        .setDescription('Modifica las propiedades de un canal existente')
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal a modificar')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('Nuevo nombre del canal')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('descripcion')
                .setDescription('Nueva descripción del canal')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('limite-usuarios')
                .setDescription('Límite de usuarios (solo para canales de voz)')
                .setMinValue(0)
                .setMaxValue(99)
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('nsfw')
                .setDescription('Marcar como NSFW (solo canales de texto)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const canal = interaction.options.getChannel('canal');
        const nuevoNombre = interaction.options.getString('nombre');
        const nuevaDescripcion = interaction.options.getString('descripcion');
        const limiteUsuarios = interaction.options.getInteger('limite-usuarios');
        const nsfw = interaction.options.getBoolean('nsfw');

        // Verificar permisos del bot
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({
                content: '❌ No tengo permisos para gestionar canales.',
                flags: 64
            });
        }

        try {
            const { modificaciones, cambios } = getModificacionesYCambios(
                canal,
                nuevoNombre,
                nuevaDescripcion,
                limiteUsuarios,
                nsfw
            );

            if (Object.keys(modificaciones).length === 0) {
                return interaction.reply({
                    content: '❌ No se especificaron modificaciones válidas.',
                    flags: 64
                });
            }

            // Aplicar modificaciones
            await canal.edit(modificaciones);

            const embed = {
                color: 0x0099ff,
                title: '✅ Canal Modificado Exitosamente',
                fields: [
                    { name: 'Canal', value: `<#${canal.id}>`, inline: true },
                    { name: 'Cambios Realizados', value: cambios.join('\n'), inline: false }
                ],
                footer: {
                    text: `Modificado por ${interaction.user.tag}`,
                    icon_url: interaction.user.displayAvatarURL()
                },
                timestamp: new Date().toISOString()
            };

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error modificando canal:', error);
            
            let errorMessage = '❌ Error al modificar el canal.';
            
            if (error.code === 50013) {
                errorMessage = '❌ No tengo permisos suficientes para modificar este canal.';
            } else if (error.code === 50035) {
                errorMessage = '❌ Los datos proporcionados no son válidos.';
            }

            await interaction.reply({
                content: errorMessage,
                flags: 64
            });
        }
    }
};