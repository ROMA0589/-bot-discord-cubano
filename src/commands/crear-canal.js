const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crear-canal')
        .setDescription('Crea un nuevo canal en el servidor')
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('Nombre del canal')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de canal')
                .setRequired(true)
                .addChoices(
                    { name: 'Texto', value: 'text' },
                    { name: 'Voz', value: 'voice' },
                    { name: 'Categoría', value: 'category' },
                    { name: 'Anuncios', value: 'announcement' },
                    { name: 'Foro', value: 'forum' }
                ))
        .addStringOption(option =>
            option.setName('descripcion')
                .setDescription('Descripción del canal (opcional)')
                .setRequired(false))
        .addChannelOption(option =>
            option.setName('categoria')
                .setDescription('Categoría donde crear el canal (opcional)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const nombre = interaction.options.getString('nombre');
        const tipo = interaction.options.getString('tipo');
        const descripcion = interaction.options.getString('descripcion');
        const categoria = interaction.options.getChannel('categoria');

        // Verificar permisos del bot
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({
                content: '❌ No tengo permisos para gestionar canales.',
                flags: 64
            });
        }

        try {
            const channelOptions = {
                name: nombre,
                type: getChannelType(tipo),
                topic: descripcion || undefined,
                parent: categoria?.id || undefined
            };

            const nuevoCanal = await interaction.guild.channels.create(channelOptions);

            const embed = {
                color: 0x00ff00,
                title: '✅ Canal Creado Exitosamente',
                fields: [
                    { name: 'Nombre', value: nuevoCanal.name, inline: true },
                    { name: 'Tipo', value: tipo, inline: true },
                    { name: 'ID', value: nuevoCanal.id, inline: true }
                ],
                footer: {
                    text: `Canal creado por ${interaction.user.tag}`,
                    icon_url: interaction.user.displayAvatarURL()
                },
                timestamp: new Date().toISOString()
            };

            if (descripcion) {
                embed.fields.push({ name: 'Descripción', value: descripcion });
            }

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error creando canal:', error);
            await interaction.reply({
                content: '❌ Error al crear el canal. Verifica que tengo los permisos necesarios.',
                ephemeral: true
            });
        }
    }
};

function getChannelType(tipo) {
    const types = {
        'text': ChannelType.GuildText,
        'voice': ChannelType.GuildVoice,
        'category': ChannelType.GuildCategory,
        'announcement': ChannelType.GuildAnnouncement,
        'forum': ChannelType.GuildForum
    };
    return types[tipo] || ChannelType.GuildText;
}