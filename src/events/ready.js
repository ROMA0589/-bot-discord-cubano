const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`🇨🇺 ¡Eyyy! El bot está conectado como ${client.user.tag}`);
        console.log(`📊 Conectado a ${client.guilds.cache.size} servidores`);
        console.log(`👥 Sirviendo a ${client.users.cache.size} panas cubanos`);
        
        // Establecer estado del bot
        client.user.setActivity('Cuidando a los panas 🇨🇺', { 
            type: ActivityType.Playing 
        });

        // Mostrar información adicional
        console.log('📋 ¡Este bot está que vuela!');
        console.log('   • Crear/modificar/eliminar canales');
        console.log('   • Crear/asignar roles');
        console.log('   • Moderar usuarios (ban/kick/timeout)');
        console.log('   • Limpiar mensajes');
        console.log('   • ¡Y mucho más, mi hermano!');
        
        console.log('✅ ¡Dale que ya estamos listos para la candela! 🔥');
    },
};