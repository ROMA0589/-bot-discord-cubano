const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crear-gaming-completo')
        .setDescription('🎮 Crea una estructura completa de canales gaming (Battlefield, DOTA, Rust, etc.)')
        .addBooleanOption(option =>
            option.setName('incluir_categorias')
                .setDescription('Si crear categorías para organizar los juegos (por defecto: true)')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('solo_vista_previa')
                .setDescription('Solo mostrar qué se creará, sin crear nada (por defecto: false)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const frasesCubanas = require('../utils/frases-cubanas');
        
        const incluirCategorias = interaction.options.getBoolean('incluir_categorias') ?? true;
        const soloVista = interaction.options.getBoolean('solo_vista_previa') ?? false;

        await interaction.deferReply();

        try {
            const estructuraGaming = {
                // Categorías
                categorias: [
                    { nombre: '🎯 BATTLEFIELD SAGA', descripcion: 'Todos los juegos de Battlefield' },
                    { nombre: '🎮 JUEGOS POPULARES', descripcion: 'DOTA, Rust, CS2, etc.' },
                    { nombre: '🔥 BATTLE ROYALE', descripcion: 'Fortnite, Apex, PUBG, etc.' },
                    { nombre: '⚔️ ESTRATEGIA & MMO', descripcion: 'Estrategia y MMORPGs' },
                    { nombre: '🏁 CARRERAS & DEPORTES', descripcion: 'Racing y deportes' }
                ],
                
                // Canales de cada categoría
                canales: {
                    battlefield: [
                        { nombre: '🎯battlefield-general', tipo: 'texto', tema: 'Chat general para toda la saga Battlefield' },
                        { nombre: '🎯bf-2042', tipo: 'texto', tema: 'Battlefield 2042 - Portal y All-Out Warfare' },
                        { nombre: '🎯bf-1', tipo: 'texto', tema: 'Battlefield 1 - La Gran Guerra' },
                        { nombre: '🎯bf-v', tipo: 'texto', tema: 'Battlefield V - Segunda Guerra Mundial' },
                        { nombre: '🎯bf-4', tipo: 'texto', tema: 'Battlefield 4 - Guerra moderna' },
                        { nombre: '🎯bf-3', tipo: 'texto', tema: 'Battlefield 3 - Clásico moderno' },
                        { nombre: '🎯bf-bad-company-2', tipo: 'texto', tema: 'Bad Company 2 - Destrucción total' },
                        { nombre: '🔊battlefield-squad', tipo: 'voz', limite: 8 },
                        { nombre: '🔊bf-escuadron-1', tipo: 'voz', limite: 4 },
                        { nombre: '🔊bf-escuadron-2', tipo: 'voz', limite: 4 }
                    ],
                    
                    populares: [
                        { nombre: '🧙‍♂️dota-2', tipo: 'texto', tema: 'DOTA 2 - MOBA competitivo' },
                        { nombre: '🏗️rust', tipo: 'texto', tema: 'Rust - Supervivencia y construcción' },
                        { nombre: '🔫cs2', tipo: 'texto', tema: 'Counter-Strike 2' },
                        { nombre: '🎯valorant', tipo: 'texto', tema: 'Valorant - Tactical shooter' },
                        { nombre: '⚡overwatch-2', tipo: 'texto', tema: 'Overwatch 2 - Hero shooter' },
                        { nombre: '🎮rainbow-six-siege', tipo: 'texto', tema: 'R6 Siege - Tactical FPS' },
                        { nombre: '🔊dota-team', tipo: 'voz', limite: 5 },
                        { nombre: '🔊rust-clan', tipo: 'voz', limite: 10 },
                        { nombre: '🔊cs2-matchmaking', tipo: 'voz', limite: 5 }
                    ],
                    
                    battleRoyale: [
                        { nombre: '🏆fortnite', tipo: 'texto', tema: 'Fortnite Battle Royale' },
                        { nombre: '🎯apex-legends', tipo: 'texto', tema: 'Apex Legends' },
                        { nombre: '🪂pubg', tipo: 'texto', tema: 'PUBG - PlayerUnknown Battlegrounds' },
                        { nombre: '⚔️warzone', tipo: 'texto', tema: 'Call of Duty Warzone' },
                        { nombre: '🔊br-squad-1', tipo: 'voz', limite: 4 },
                        { nombre: '🔊br-squad-2', tipo: 'voz', limite: 4 },
                        { nombre: '🔊br-squad-3', tipo: 'voz', limite: 3 }
                    ],
                    
                    estrategia: [
                        { nombre: '🏰age-of-empires', tipo: 'texto', tema: 'Age of Empires saga' },
                        { nombre: '⚔️total-war', tipo: 'texto', tema: 'Total War series' },
                        { nombre: '🌟civilization', tipo: 'texto', tema: 'Civilization VI' },
                        { nombre: '🗡️wow', tipo: 'texto', tema: 'World of Warcraft' },
                        { nombre: '🎭ffxiv', tipo: 'texto', tema: 'Final Fantasy XIV' },
                        { nombre: '🔊mmo-party', tipo: 'voz', limite: 8 },
                        { nombre: '🔊estrategia-team', tipo: 'voz', limite: 6 }
                    ],
                    
                    carreras: [
                        { nombre: '🏎️f1-2024', tipo: 'texto', tema: 'F1 24 - Fórmula 1' },
                        { nombre: '🏁forza-horizon', tipo: 'texto', tema: 'Forza Horizon series' },
                        { nombre: '⚽fifa-24', tipo: 'texto', tema: 'EA Sports FC 24' },
                        { nombre: '🏀nba-2k24', tipo: 'texto', tema: 'NBA 2K24' },
                        { nombre: '🔊racing-lobby', tipo: 'voz', limite: 8 },
                        { nombre: '🔊fifa-team', tipo: 'voz', limite: 4 }
                    ]
                }
            };

            // Generar resumen
            let resumen = `## 🎮 Estructura Gaming Completa\n\n`;
            
            if (incluirCategorias) {
                resumen += `**📁 Categorías (${estructuraGaming.categorias.length}):**\n`;
                estructuraGaming.categorias.forEach(categoria => {
                    resumen += `• ${categoria.nombre}\n`;
                });
                resumen += '\n';
            }

            // Contar canales
            let totalTexto = 0;
            let totalVoz = 0;
            
            Object.values(estructuraGaming.canales).forEach(categoria => {
                categoria.forEach(canal => {
                    if (canal.tipo === 'texto') totalTexto++;
                    else totalVoz++;
                });
            });

            resumen += `**💬 Canales de Texto:** ${totalTexto}\n`;
            resumen += `**🔊 Canales de Voz:** ${totalVoz}\n`;
            resumen += `**🎯 Total:** ${totalTexto + totalVoz} canales\n\n`;

            resumen += `**🎯 Battlefield Saga:** BF 2042, BF1, BFV, BF4, BF3, BC2\n`;
            resumen += `**🎮 Populares:** DOTA 2, Rust, CS2, Valorant, Overwatch 2\n`;
            resumen += `**🏆 Battle Royale:** Fortnite, Apex, PUBG, Warzone\n`;
            resumen += `**⚔️ Estrategia:** AoE, Total War, Civ VI, WoW, FFXIV\n`;
            resumen += `**🏁 Carreras:** F1 24, Forza, FIFA 24, NBA 2K24\n`;

            if (soloVista) {
                return await interaction.editReply({
                    content: resumen + `\n${frasesCubanas.getRandomFrase()} ¡Esa sí va a ser una estructura gaming de primera, mi pana! Para crearla de verdad, usa el comando sin \`solo_vista_previa\`.`
                });
            }

            // Crear la estructura
            let creados = 0;
            let errores = 0;
            const mapaCategorias = new Map();

            await interaction.editReply({
                content: `🚀 ¡Creando la estructura gaming completa! ${frasesCubanas.getRandomFrase()}\n\n${resumen}`
            });

            // Crear categorías
            if (incluirCategorias) {
                for (const categoria of estructuraGaming.categorias) {
                    try {
                        const nuevaCategoria = await interaction.guild.channels.create({
                            name: categoria.nombre,
                            type: ChannelType.GuildCategory
                        });
                        mapaCategorias.set(categoria.nombre, nuevaCategoria.id);
                        creados++;
                    } catch (error) {
                        console.error(`Error creando categoría ${categoria.nombre}:`, error);
                        errores++;
                    }
                }
            }

            // Crear canales por categoría
            const categoriasCanales = {
                'battlefield': '🎯 BATTLEFIELD SAGA',
                'populares': '🎮 JUEGOS POPULARES', 
                'battleRoyale': '🔥 BATTLE ROYALE',
                'estrategia': '⚔️ ESTRATEGIA & MMO',
                'carreras': '🏁 CARRERAS & DEPORTES'
            };

            for (const [clave, nombreCategoria] of Object.entries(categoriasCanales)) {
                const canales = estructuraGaming.canales[clave];
                
                for (const canal of canales) {
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

                        if (incluirCategorias && mapaCategorias.has(nombreCategoria)) {
                            opciones.parent = mapaCategorias.get(nombreCategoria);
                        }

                        await interaction.guild.channels.create(opciones);
                        creados++;
                    } catch (error) {
                        console.error(`Error creando canal ${canal.nombre}:`, error);
                        errores++;
                    }
                }
            }

            const mensaje = errores > 0 
                ? `¡Listo mi pana! Se crearon **${creados}** canales con **${errores}** errores. ${frasesCubanas.getRandomFrase()}`
                : `¡Perfecto! Se crearon **${creados}** canales gaming sin problemas. ${frasesCubanas.getRandomFrase()}`;

            await interaction.editReply({
                content: `## ✅ Estructura Gaming Creada\n\n${mensaje}\n\n🎮 **Tu servidor ahora está listo para:**\n• Toda la saga Battlefield\n• DOTA 2, Rust, CS2 y más\n• Battle Royales\n• Estrategia y MMOs\n• Carreras y deportes\n\n¡A jugar se ha dicho! 🇨🇺🎯`
            });

        } catch (error) {
            console.error('Error creando estructura gaming:', error);
            await interaction.editReply({
                content: `${frasesCubanas.getRandomFrase()} Algo salió mal creando la estructura gaming, mi loco.\n\n**Error:** ${error.message}`,
                ephemeral: true
            });
        }
    },
};