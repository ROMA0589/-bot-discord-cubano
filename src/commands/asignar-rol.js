const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('asignar-rol')
        .setDescription('Asigna o remueve un rol de un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario al que asignar/remover el rol')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('Rol a asignar o remover')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('accion')
                .setDescription('Acción a realizar')
                .setRequired(true)
                .addChoices(
                    { name: 'Asignar', value: 'add' },
                    { name: 'Remover', value: 'remove' }
                ))
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('Razón para la acción')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        const usuario = interaction.options.getUser('usuario');
        const rol = interaction.options.getRole('rol');
        const accion = interaction.options.getString('accion');
        const razon = interaction.options.getString('razon') || `Acción realizada por ${interaction.user.tag}`;

        // Verificar permisos del bot
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({
                content: '❌ No tengo permisos para gestionar roles.',
                ephemeral: true
            });
        }

        // Obtener el miembro del servidor
        const miembro = await interaction.guild.members.fetch(usuario.id);
        if (!miembro) {
            return interaction.reply({
                content: '❌ El usuario no se encuentra en este servidor.',
                ephemeral: true
            });
        }

        // Verificar jerarquía de roles
        const botRolMasAlto = interaction.guild.members.me.roles.highest;
        const autorRolMasAlto = interaction.member.roles.highest;

        if (rol.position >= botRolMasAlto.position) {
            return interaction.reply({
                content: '❌ No puedo gestionar este rol porque está por encima de mi rol más alto.',
                ephemeral: true
            });
        }

        if (rol.position >= autorRolMasAlto.position && interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({
                content: '❌ No puedes gestionar este rol porque está por encima de tu rol más alto.',
                ephemeral: true
            });
        }

        try {
            let accionTexto;
            let emoji;

            if (accion === 'add') {
                if (miembro.roles.cache.has(rol.id)) {
                    return interaction.reply({
                        content: `❌ ${usuario.tag} ya tiene el rol ${rol.name}.`,
                        ephemeral: true
                    });
                }
                
                await miembro.roles.add(rol, razon);
                accionTexto = 'Asignado';
                emoji = '✅';
            } else {
                if (!miembro.roles.cache.has(rol.id)) {
                    return interaction.reply({
                        content: `❌ ${usuario.tag} no tiene el rol ${rol.name}.`,
                        ephemeral: true
                    });
                }
                
                await miembro.roles.remove(rol, razon);
                accionTexto = 'Removido';
                emoji = '🗑️';
            }

            const embed = {
                color: accion === 'add' ? 0x00ff00 : 0xff9500,
                title: `${emoji} Rol ${accionTexto}`,
                fields: [
                    { name: 'Usuario', value: `${usuario.tag} (${usuario.id})`, inline: true },
                    { name: 'Rol', value: `${rol.name} (<@&${rol.id}>)`, inline: true },
                    { name: 'Acción', value: accionTexto, inline: true },
                    { name: 'Razón', value: razon, inline: false }
                ],
                footer: {
                    text: `Acción realizada por ${interaction.user.tag}`,
                    icon_url: interaction.user.displayAvatarURL()
                },
                timestamp: new Date().toISOString()
            };

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error gestionando rol:', error);
            
            let errorMessage = '❌ Error al gestionar el rol.';
            
            if (error.code === 50013) {
                errorMessage = '❌ No tengo permisos suficientes para gestionar este rol.';
            }

            await interaction.reply({
                content: errorMessage,
                ephemeral: true
            });
        }
    }
};