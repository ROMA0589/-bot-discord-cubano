const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moderar')
        .setDescription('Comandos de moderación del servidor')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ban')
                .setDescription('Banea a un usuario del servidor')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('Usuario a banear')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('razon')
                        .setDescription('Razón del ban')
                        .setRequired(false))
                .addIntegerOption(option =>
                    option.setName('eliminar-mensajes')
                        .setDescription('Días de mensajes a eliminar (0-7)')
                        .setMinValue(0)
                        .setMaxValue(7)
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('kick')
                .setDescription('Expulsa a un usuario del servidor')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('Usuario a expulsar')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('razon')
                        .setDescription('Razón de la expulsión')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('timeout')
                .setDescription('Aplica timeout a un usuario')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('Usuario al que aplicar timeout')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('duracion')
                        .setDescription('Duración en minutos (1-40320)')
                        .setMinValue(1)
                        .setMaxValue(40320)
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('razon')
                        .setDescription('Razón del timeout')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('limpiar')
                .setDescription('Elimina mensajes de un canal')
                .addIntegerOption(option =>
                    option.setName('cantidad')
                        .setDescription('Cantidad de mensajes a eliminar (1-100)')
                        .setMinValue(1)
                        .setMaxValue(100)
                        .setRequired(true))
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('Eliminar solo mensajes de este usuario')
                        .setRequired(false)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'ban':
                await handleBan(interaction);
                break;
            case 'kick':
                await handleKick(interaction);
                break;
            case 'timeout':
                await handleTimeout(interaction);
                break;
            case 'limpiar':
                await handleClear(interaction);
                break;
        }
    }
};

async function handleBan(interaction) {
    const usuario = interaction.options.getUser('usuario');
    const razon = interaction.options.getString('razon') || 'No especificada';
    const eliminarMensajes = interaction.options.getInteger('eliminar-mensajes') || 0;

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
        return interaction.reply({
            content: '❌ No tengo permisos para banear miembros.',
            flags: 64
        });
    }

    try {
        const miembro = await interaction.guild.members.fetch(usuario.id);
        
        if (miembro.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({
                content: '❌ No puedes banear a este usuario porque tiene un rol igual o superior al tuyo.',
                flags: 64
            });
        }

        await interaction.guild.members.ban(usuario, {
            deleteMessageSeconds: eliminarMensajes * 24 * 60 * 60,
            reason: razon
        });

        const embed = {
            color: 0xff0000,
            title: '🔨 Usuario Baneado',
            fields: [
                { name: 'Usuario', value: `${usuario.tag} (${usuario.id})`, inline: true },
                { name: 'Moderador', value: interaction.user.tag, inline: true },
                { name: 'Razón', value: razon, inline: false }
            ],
            timestamp: new Date().toISOString()
        };

        await interaction.reply({ embeds: [embed] });

    } catch (error) {
        console.error('Error baneando usuario:', error);
        await interaction.reply({
            content: '❌ Error al banear el usuario. Verifica que tengo los permisos necesarios.',
            flags: 64
        });
    }
}

async function handleKick(interaction) {
    const usuario = interaction.options.getUser('usuario');
    const razon = interaction.options.getString('razon') || 'No especificada';

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
        return interaction.reply({
            content: '❌ No tengo permisos para expulsar miembros.',
            flags: 64
        });
    }

    try {
        const miembro = await interaction.guild.members.fetch(usuario.id);
        
        if (miembro.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({
                content: '❌ No puedes expulsar a este usuario porque tiene un rol igual o superior al tuyo.',
                flags: 64
            });
        }

        await miembro.kick(razon);

        const embed = {
            color: 0xff9500,
            title: '👢 Usuario Expulsado',
            fields: [
                { name: 'Usuario', value: `${usuario.tag} (${usuario.id})`, inline: true },
                { name: 'Moderador', value: interaction.user.tag, inline: true },
                { name: 'Razón', value: razon, inline: false }
            ],
            timestamp: new Date().toISOString()
        };

        await interaction.reply({ embeds: [embed] });

    } catch (error) {
        console.error('Error expulsando usuario:', error);
        await interaction.reply({
            content: '❌ Error al expulsar el usuario.',
            flags: 64
        });
    }
}

async function handleTimeout(interaction) {
    const usuario = interaction.options.getUser('usuario');
    const duracion = interaction.options.getInteger('duracion');
    const razon = interaction.options.getString('razon') || 'No especificada';

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
        return interaction.reply({
            content: '❌ No tengo permisos para moderar miembros.',
            flags: 64
        });
    }

    try {
        const miembro = await interaction.guild.members.fetch(usuario.id);
        
        if (miembro.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({
                content: '❌ No puedes aplicar timeout a este usuario.',
                flags: 64
            });
        }

        const timeoutDuration = duracion * 60 * 1000; // Convertir minutos a milisegundos
        await miembro.timeout(timeoutDuration, razon);

        const embed = {
            color: 0xffff00,
            title: '⏰ Timeout Aplicado',
            fields: [
                { name: 'Usuario', value: `${usuario.tag} (${usuario.id})`, inline: true },
                { name: 'Duración', value: `${duracion} minutos`, inline: true },
                { name: 'Moderador', value: interaction.user.tag, inline: true },
                { name: 'Razón', value: razon, inline: false }
            ],
            timestamp: new Date().toISOString()
        };

        await interaction.reply({ embeds: [embed] });

    } catch (error) {
        console.error('Error aplicando timeout:', error);
        await interaction.reply({
            content: '❌ Error al aplicar timeout.',
            flags: 64
        });
    }
}

async function handleClear(interaction) {
    const cantidad = interaction.options.getInteger('cantidad');
    const usuario = interaction.options.getUser('usuario');

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return interaction.reply({
            content: '❌ No tengo permisos para gestionar mensajes.',
            flags: 64
        });
    }

    try {
        const mensajes = await interaction.channel.messages.fetch({ limit: cantidad });
        let mensajesAEliminar = mensajes;

        if (usuario) {
            mensajesAEliminar = mensajes.filter(msg => msg.author.id === usuario.id);
        }

        const eliminados = await interaction.channel.bulkDelete(mensajesAEliminar, true);

        const embed = {
            color: 0x00ff00,
            title: '🧹 Mensajes Eliminados',
            description: 'Se eliminaron ' + eliminados.size + ' mensajes' + (usuario ? ' de ' + usuario.tag : '') + '.',
            footer: {
                text: `Acción realizada por ${interaction.user.tag}`,
                icon_url: interaction.user.displayAvatarURL()
            },
            timestamp: new Date().toISOString()
        };

        await interaction.reply({ embeds: [embed], flags: 64 });

    } catch (error) {
        console.error('Error limpiando mensajes:', error);
        await interaction.reply({
            content: '❌ Error al limpiar mensajes. Los mensajes de más de 14 días no se pueden eliminar en masa.',
            flags: 64
        });
    }
}