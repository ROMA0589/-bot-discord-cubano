const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bienvenida')
        .setDescription('🇨🇺 Configura mensajes de bienvenida automáticos para nuevos miembros')
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal donde enviar las bienvenidas')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mensaje')
                .setDescription('Mensaje personalizado (usa {usuario} para mencionar)')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('activar')
                .setDescription('Activar o desactivar las bienvenidas (por defecto: true)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const { obtenerFrase } = require('../utils/frases-cubanas');
        
        const canal = interaction.options.getChannel('canal');
        const mensajePersonalizado = interaction.options.getString('mensaje');
        const activar = interaction.options.getBoolean('activar') ?? true;

        // Mensajes de bienvenida cubanos por defecto
        const mensajesPorDefecto = [
            "🇨🇺 ¡Oye, qué bolá {usuario}! Bienvenido a la familia cubana. Aquí se habla claro y se vive chévere. ¡Dale que llegaste a tu casa!",
            "🌴 ¡Asere! {usuario} acaba de llegar. ¡Bienvenido al lugar más sabrosón de Discord! Aquí todos somos panas.",
            "🔥 ¡Ey {usuario}! Te damos la bienvenida con mucho swing. Aquí se respeta, se divierte y se echa un pie. ¡Siéntete como en el malecón!",
            "🎵 ¡Qué tal {usuario}! Llegaste al servidor más bueno. Aquí hay buena vibra, música y mucho sabor caribeño. ¡Welcome to the party!",
            "☀️ ¡Mi loco {usuario}! Bienvenido al rinconcito cubano de Discord. Aquí se habla de todo y se pasa chévere. ¡Dale que vamos a disfrutar!"
        ];

        const mensajeFinal = mensajePersonalizado || mensajesPorDefecto[Math.floor(Math.random() * mensajesPorDefecto.length)];

        // Aquí normalmente guardarías en una base de datos
        // Por ahora simularemos que se guardó la configuración
        
        const embed = new EmbedBuilder()
            .setColor('#FF6B35')
            .setTitle('🇨🇺 Sistema de Bienvenida Configurado')
            .setDescription(`${obtenerFrase('saludos')} La bienvenida está ${activar ? 'activada' : 'desactivada'}, mi pana!`)
            .addFields(
                { name: '📺 Canal', value: `${canal}`, inline: true },
                { name: '📝 Estado', value: activar ? '✅ Activado' : '❌ Desactivado', inline: true },
                { name: '💬 Mensaje de prueba', value: mensajeFinal.replace('{usuario}', `<@${interaction.user.id}>`), inline: false }
            )
            .setFooter({ text: 'Bot Cubano • Siempre con buena vibra 🔥' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // Enviar mensaje de prueba al canal configurado
        if (activar && canal.isTextBased()) {
            try {
                const mensajePrueba = mensajeFinal.replace('{usuario}', `<@${interaction.user.id}>`);
                await canal.send(`🧪 **Mensaje de prueba:**\n${mensajePrueba}`);
            } catch (error) {
                console.error('Error enviando mensaje de prueba:', error);
                await interaction.followUp({ 
                    content: `⚠️ No pude enviar el mensaje de prueba al canal ${canal}. Verifica que el bot tenga permisos.`,
                    flags: 64
                });
            }
        }
    },
};