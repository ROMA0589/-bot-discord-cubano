const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crear-rol')
        .setDescription('Crea un nuevo rol en el servidor')
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('Nombre del rol')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Color del rol (hex, ej: #ff0000)')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('separado')
                .setDescription('Mostrar miembros por separado')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('mencionable')
                .setDescription('Permitir mencionar el rol')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('Razón para crear el rol')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        const nombre = interaction.options.getString('nombre');
        const color = interaction.options.getString('color');
        const separado = interaction.options.getBoolean('separado') ?? false;
        const mencionable = interaction.options.getBoolean('mencionable') ?? false;
        const razon = interaction.options.getString('razon') || `Rol creado por ${interaction.user.tag}`;

        // Verificar permisos del bot
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({
                content: '❌ No tengo permisos para gestionar roles.',
                ephemeral: true
            });
        }

        try {
            const roleOptions = {
                name: nombre,
                hoist: separado,
                mentionable: mencionable,
                reason: razon
            };

            // Validar y agregar color si se proporciona
            if (color) {
                const colorRegex = /^#[0-9A-F]{6}$/i;
                if (colorRegex.test(color)) {
                    roleOptions.color = color;
                } else {
                    return interaction.reply({
                        content: '❌ Color inválido. Usa formato hexadecimal (ej: #ff0000).',
                        ephemeral: true
                    });
                }
            }

            const nuevoRol = await interaction.guild.roles.create(roleOptions);

            const embed = {
                color: nuevoRol.color || 0x99aab5,
                title: '✅ Rol Creado Exitosamente',
                fields: [
                    { name: 'Nombre', value: nuevoRol.name, inline: true },
                    { name: 'ID', value: nuevoRol.id, inline: true },
                    { name: 'Color', value: nuevoRol.hexColor, inline: true },
                    { name: 'Separado', value: separado ? 'Sí' : 'No', inline: true },
                    { name: 'Mencionable', value: mencionable ? 'Sí' : 'No', inline: true },
                    { name: 'Posición', value: nuevoRol.position.toString(), inline: true }
                ],
                footer: {
                    text: `Rol creado por ${interaction.user.tag}`,
                    icon_url: interaction.user.displayAvatarURL()
                },
                timestamp: new Date().toISOString()
            };

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error creando rol:', error);
            
            let errorMessage = '❌ Error al crear el rol.';
            
            if (error.code === 50013) {
                errorMessage = '❌ No tengo permisos suficientes para crear roles.';
            } else if (error.code === 50035) {
                errorMessage = '❌ Los datos del rol no son válidos.';
            }

            await interaction.reply({
                content: errorMessage,
                ephemeral: true
            });
        }
    }
};