const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gaming-basico')
        .setDescription('🎮 Crea canales gaming básicos para probar (Battlefield, DOTA, Rust)')
        .addStringOption(option =>
            option.setName('categoria')
                .setDescription('Qué tipo de juegos crear')
                .setRequired(true)
                .addChoices(
                    { name: '🎯 Solo Battlefield', value: 'battlefield' },
                    { name: '🎮 Populares (DOTA, Rust, CS2)', value: 'populares' },
                    { name: '🏆 Battle Royale', value: 'br' },
                    { name: '🎯 Todos (pocos canales)', value: 'todos' }
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const frasesCubanas = require('../utils/frases-cubanas');
        
        const categoria = interaction.options.getString('categoria');

        await interaction.deferReply();

        try {
            let canalesCrear = [];

            switch (categoria) {
                case 'battlefield':
                    canalesCrear = [
                        { nombre: '🎯battlefield-general', tipo: 'texto', tema: 'Chat general Battlefield' },
                        { nombre: '🎯bf-2042', tipo: 'texto', tema: 'Battlefield 2042' },
                        { nombre: '🎯bf-1', tipo: 'texto', tema: 'Battlefield 1' },
                        { nombre: '🔊bf-squad', tipo: 'voz', limite: 4 }
                    ];
                    break;
                    
                case 'populares':
                    canalesCrear = [
                        { nombre: '🧙‍♂️dota-2', tipo: 'texto', tema: 'DOTA 2' },
                        { nombre: '🏗️rust', tipo: 'texto', tema: 'Rust - Supervivencia' },
                        { nombre: '🔫cs2', tipo: 'texto', tema: 'Counter-Strike 2' },
                        { nombre: '🔊gaming-team', tipo: 'voz', limite: 5 }
                    ];
                    break;
                    
                case 'br':
                    canalesCrear = [
                        { nombre: '🏆fortnite', tipo: 'texto', tema: 'Fortnite Battle Royale' },
                        { nombre: '🎯apex-legends', tipo: 'texto', tema: 'Apex Legends' },
                        { nombre: '🪂pubg', tipo: 'texto', tema: 'PUBG' },
                        { nombre: '🔊br-squad', tipo: 'voz', limite: 4 }
                    ];
                    break;
                    
                case 'todos':
                    canalesCrear = [
                        { nombre: '🎯battlefield-2042', tipo: 'texto', tema: 'Battlefield 2042' },
                        { nombre: '🧙‍♂️dota-2', tipo: 'texto', tema: 'DOTA 2' },
                        { nombre: '🏗️rust', tipo: 'texto', tema: 'Rust' },
                        { nombre: '🏆fortnite', tipo: 'texto', tema: 'Fortnite' },
                        { nombre: '🔊gaming-general', tipo: 'voz', limite: 8 }
                    ];
                    break;
            }

            let resumen = `## 🎮 Creando canales gaming\n\n`;
            resumen += `**Canales a crear:** ${canalesCrear.length}\n\n`;
            canalesCrear.forEach(canal => {
                const icono = canal.tipo === 'texto' ? '💬' : '🔊';
                resumen += `• ${icono} ${canal.nombre}\n`;
            });

            await interaction.editReply({
                content: `🚀 ¡Empezando a crear canales gaming! ${frasesCubanas.getRandomFrase()}\n\n${resumen}`
            });

            let creados = 0;
            let errores = 0;

            // Crear canales uno por uno con delay
            for (const canal of canalesCrear) {
                try {
                    const opciones = {
                        name: canal.nombre,
                        type: canal.tipo === 'texto' ? ChannelType.GuildText : ChannelType.GuildVoice
                    };

                    if (canal.tipo === 'texto' && canal.tema) {
                        opciones.topic = canal.tema;
                    }

                    if (canal.tipo === 'voz' && canal.limite) {
                        opciones.userLimit = canal.limite;
                    }

                    await interaction.guild.channels.create(opciones);
                    creados++;
                    
                    // Delay más largo para evitar problemas
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (error) {
                    console.error(`Error creando canal ${canal.nombre}:`, error);
                    errores++;
                }
            }

            const mensaje = errores > 0 
                ? `¡Listo mi pana! Se crearon **${creados}** canales gaming con **${errores}** errores. ${frasesCubanas.getRandomFrase()}`
                : `¡Perfecto! Se crearon **${creados}** canales gaming sin problemas. ${frasesCubanas.getRandomFrase()}`;

            await interaction.editReply({
                content: `## ✅ Canales Gaming Creados\n\n${mensaje}\n\n🎮 **¡A jugar se ha dicho!** Los canales están listos para usar. 🇨🇺`
            });

        } catch (error) {
            console.error('Error creando canales gaming:', error);
            await interaction.editReply({
                content: `${frasesCubanas.getRandomFrase()} Algo salió mal, mi loco.\n\n**Posibles causas:**\n• No tienes permisos de administrador\n• El bot no tiene permisos para crear canales\n• El servidor alcanzó el límite de canales\n\n**Error:** ${error.message}`,
                ephemeral: true
            });
        }
    },
};