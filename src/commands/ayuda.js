const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ayuda')
        .setDescription('📖 Muestra toda la ayuda y comandos del bot cubano'),

    async execute(interaction) {
        try {
            const { obtenerFrase } = require('../utils/frases-cubanas');
            const embed = new EmbedBuilder()
                .setColor('#FF6B35')
                .setTitle('🇨🇺 AYUDA DEL BOT CUBANO')
                .setDescription('¡Bienvenido a la ayuda oficial de Diciplina! Aquí tienes todo lo que puedes hacer con el bot cubano. Dale que está bueno!')
                .addFields(
                    { name: '🏗️ Estructura y administración', value: '`/copiar-estructura` - Copia canales de otro servidor\n`/crear-canal` - Crea un canal nuevo\n`/crear-gaming-completo` - Estructura gaming completa', inline: false },
                    { name: '🎮 Gaming y diversión', value: '`/gaming-basico` - Canales gaming básicos\n`/que-tal` - Saludo cubano\n`/bienvenida` - Configura mensajes automáticos', inline: false },
                    { name: '🛡️ Moderación y roles', value: '`/moderar` - Comandos de moderación\n`/asignar-rol` - Asigna o remueve roles\n`/auto-rol` - Rol automático para nuevos miembros', inline: false },
                    { name: '📋 Utilidad y diagnóstico', value: '`/info` - Información del bot\n`/diagnostico` - Diagnóstico completo\n`/test-canal` - Prueba de creación de canal', inline: false },
                        { name: '📰 Noticias y actualidad', value: '`/noticias` - Muestra las últimas noticias de videojuegos (IGN)', inline: false },
                    { name: '📖 ¿Cómo empezar?', value: '1️⃣ Usa `/ayuda` para ver todos los comandos\n2️⃣ Lee las reglas del servidor\n3️⃣ Preséntate en #presentaciones\n4️⃣ Usa `/asignar-rol` para obtener tus roles\n5️⃣ ¡Participa y disfruta!', inline: false },
                    { name: '🔗 Enlaces útiles', value: '[Invita el bot](https://discord.com/oauth2/authorize?client_id=1421480599469953177&permissions=8&scope=bot%20applications.commands) | [GitHub](https://github.com/ROMA0589/-bot-discord-cubano)', inline: false }
                )
                .setFooter({ text: obtenerFrase('saludos') + ' • Bot Cubano', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], flags: 64 });
        } catch (error) {
            // Solo responder si no se ha respondido antes
            if (!interaction.replied && !interaction.deferred) {
                const embedError = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Error en el comando /ayuda')
                    .setDescription('Ocurrió un error al mostrar la ayuda.')
                    .addFields({ name: 'Detalles', value: error.message || 'Error desconocido', inline: false })
                    .setFooter({ text: 'Bot Cubano • Error', iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();
                await interaction.reply({ embeds: [embedError], flags: 64 });
            } else {
                // Si ya se respondió, edita la respuesta
                await interaction.editReply({ content: `❌ Error en /ayuda: ${error.message || 'Error desconocido'}` });
            }
        }
    },
};