const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        const frasesCubanas = require('../utils/frases-cubanas');
        
        // Mensajes de despedida cubanos
        const mensajesDespedida = [
            `🇨🇺 **${member.user.tag}** se fue pa'l carajo... ¡Que le vaya bien por ahí!`,
            `🌊 **${member.user.tag}** cogió el bote y se fue. ¡Hasta la vista, mi pana!`,
            `✈️ **${member.user.tag}** voló de aquí. ¡Ojalá encuentre lo que anda buscando!`,
            `🚪 **${member.user.tag}** cerró la puerta y se fue. ¡Que tenga suerte en su camino!`,
            `🌅 **${member.user.tag}** se despidió de la familia. ¡Siempre será bienvenido de vuelta!`,
            `🎭 **${member.user.tag}** salió del show. ¡Nos vemos cuando regrese, hermano!`
        ];

        try {
            // Buscar canal de despedidas o general
            const canalDespedida = member.guild.channels.cache.find(channel => 
                channel.isTextBased() && 
                (channel.name.includes('despedida') || 
                 channel.name.includes('goodbye') || 
                 channel.name.includes('general') || 
                 channel.name.includes('lobby'))
            ) || member.guild.channels.cache.find(channel => channel.isTextBased());

            if (!canalDespedida) {
                console.log(`No se encontró canal de despedida en ${member.guild.name}`);
                return;
            }

            // Seleccionar mensaje aleatorio
            const mensajeAleatorio = mensajesDespedida[Math.floor(Math.random() * mensajesDespedida.length)];

            // Crear embed de despedida
            const embedDespedida = new EmbedBuilder()
                .setColor('#FF4444')
                .setTitle('👋 ¡Hasta la vista!')
                .setDescription(mensajeAleatorio)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: '📉 Miembros restantes', value: `${member.guild.memberCount}`, inline: true },
                    { name: '⏰ Se fue', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
                )
                .setFooter({ text: `${frasesCubanas.getRandomFrase()} • Bot Cubano 🔥` })
                .setTimestamp();

            await canalDespedida.send({ embeds: [embedDespedida] });

            console.log(`✅ Despedida enviada para ${member.user.tag} en ${member.guild.name}`);

        } catch (error) {
            console.error('Error enviando mensaje de despedida:', error);
        }
    },
};