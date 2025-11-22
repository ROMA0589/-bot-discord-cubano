const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test-canal')
        .setDescription('🧪 Crear un solo canal para probar si funciona')
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('Nombre del canal de prueba')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de canal')
                .setRequired(true)
                .addChoices(
                    { name: '💬 Texto', value: 'texto' },
                    { name: '🔊 Voz', value: 'voz' }
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const { obtenerFrase } = require('../utils/frases-cubanas');
        
        const nombre = interaction.options.getString('nombre');
        const tipo = interaction.options.getString('tipo');

        await interaction.deferReply();

        try {
            await interaction.editReply({
                content: `🧪 Creando canal de prueba: **${nombre}** (${tipo === 'texto' ? 'texto' : 'voz'})\n\n${obtenerFrase('saludos')}`
            });

            const opciones = {
                name: nombre,
                type: tipo === 'texto' ? ChannelType.GuildText : ChannelType.GuildVoice
            };

            if (tipo === 'texto') {
                opciones.topic = 'Canal de prueba creado por el bot cubano';
            }

            if (tipo === 'voz') {
                opciones.userLimit = 5;
            }

            const nuevoCanal = await interaction.guild.channels.create(opciones);

            await interaction.editReply({
                content: `## ✅ ¡Canal creado exitosamente!\n\n🎉 **${nombre}** fue creado sin problemas, mi pana.\n\n📍 **Canal:** ${nuevoCanal}\n💭 **Tipo:** ${tipo === 'texto' ? 'Texto 💬' : 'Voz 🔊'}\n\n${obtenerFrase('exitosas')}`
            });

        } catch (error) {
            console.error('Error creando canal de prueba:', error);
            
            let mensajeError = "Error desconocido";
            
            if (error.code === 50013) {
                mensajeError = "El bot no tiene permisos para crear canales";
            } else if (error.code === 30013) {
                mensajeError = "Se alcanzó el límite máximo de canales en el servidor";
            } else if (error.code === 50035) {
                mensajeError = "El nombre del canal no es válido";
            }

            await interaction.editReply({
                content: `❌ **Error creando el canal**\n\n${obtenerFrase('errores')} Algo salió mal, mi loco.\n\n**Causa:** ${mensajeError}\n**Código:** ${error.code || 'N/A'}\n**Detalle:** ${error.message}`,
                flags: 64
            });
        }
    },
};