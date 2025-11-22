const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const { obtenerFrase } = require('../utils/frases-cubanas');
        
        // Mensajes de bienvenida cubanos
        const mensajesBienvenida = [
            `🇨🇺 ¡Oye, qué bolá ${member}! Bienvenido a la familia cubana. Aquí se habla claro y se vive chévere. ¡Dale que llegaste a tu casa!`,
            `🌴 ¡Asere! ${member} acaba de llegar. ¡Bienvenido al lugar más sabrosón de Discord! Aquí todos somos panas.`,
            `🔥 ¡Ey ${member}! Te damos la bienvenida con mucho swing. Aquí se respeta, se divierte y se echa un pie. ¡Siéntete como en el malecón!`,
            `🎵 ¡Qué tal ${member}! Llegaste al servidor más bueno. Aquí hay buena vibra, música y mucho sabor caribeño. ¡Welcome to the party!`,
            `☀️ ¡Mi loco ${member}! Bienvenido al rinconcito cubano de Discord. Aquí se habla de todo y se pasa chévere. ¡Dale que vamos a disfrutar!`,
            `🏝️ ¡Klk ${member}! Acabas de llegar al lugar más chévere. Aquí la cosa está buena y la gente es de lo mejor. ¡Bienvenido a la candela!`,
            `🌊 ¡Tremendo! ${member} se unió a nuestra familia. Aquí se vive con sabor, se habla con cariño y se divierte a lo grande. ¡Dale!`
        ];

        try {
            console.log(`🔄 Nuevo miembro detectado: ${member.user.tag} en ${member.guild.name}`);
            
            // Buscar un canal llamado 'bienvenidas', 'general', o el primer canal de texto disponible
            const canalBienvenida = member.guild.channels.cache.find(channel => 
                channel.isTextBased() && 
                (channel.name.includes('bienvenida') || 
                 channel.name.includes('general') || 
                 channel.name.includes('lobby'))
            ) || member.guild.channels.cache.find(channel => channel.isTextBased());

            if (!canalBienvenida) {
                console.log(`❌ No se encontró canal de bienvenida en ${member.guild.name}`);
                return;
            }

            console.log(`📺 Canal encontrado: ${canalBienvenida.name}`);

            // Seleccionar mensaje aleatorio
            const mensajeAleatorio = mensajesBienvenida[Math.floor(Math.random() * mensajesBienvenida.length)];

            // Primero intentar enviar mensaje simple para debug
            console.log(`💬 Enviando mensaje simple primero...`);
            await canalBienvenida.send(`🇨🇺 ¡Bienvenido ${member}! ${obtenerFrase('saludos')}`);

            // Crear embed de bienvenida
            const embedBienvenida = new EmbedBuilder()
                .setColor('#FF6B35')
                .setTitle('🇨🇺 ¡Nuevo Miembro!')
                .setDescription(mensajeAleatorio)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: '👤 Usuario', value: `${member.user.tag}`, inline: true },
                    { name: '📅 Cuenta creada', value: `<t:${Math.floor(member.user.createdAt.getTime() / 1000)}:R>`, inline: true },
                    { name: '👥 Miembro #', value: `${member.guild.memberCount}`, inline: true }
                )
                .setFooter({ text: `${obtenerFrase('saludos')} • Bot Cubano 🔥` })
                .setTimestamp();

            console.log(`📤 Enviando mensaje de bienvenida a ${canalBienvenida.name}...`);
            await canalBienvenida.send({ embeds: [embedBienvenida] });

            console.log(`✅ Bienvenida enviada para ${member.user.tag} en ${member.guild.name}`);

        } catch (error) {
            console.error('❌ Error enviando mensaje de bienvenida:', error);
            console.error('Detalles del error:', error.message);
        }
    },
};