const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('copiar-estructura')
        .setDescription('🏗️ Copia la estructura de canales de otro servidor (requiere permisos de admin)')
        .addStringOption(option =>
            option.setName('servidor_id')
                .setDescription('ID del servidor del cual copiar la estructura')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('incluir_categorias')
                .setDescription('Si incluir las categorías (por defecto: true)')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('solo_vista_previa')
                .setDescription('Solo mostrar qué se copiará, sin crear nada (por defecto: false)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        async execute(interaction) {
            const frasesCubanas = require('../utils/frases-cubanas');
    
            const servidorId = interaction.options.getString('servidor_id');
            const incluirCategorias = interaction.options.getBoolean('incluir_categorias') ?? true;
            const soloVista = interaction.options.getBoolean('solo_vista_previa') ?? false;
    
            await interaction.deferReply();
    
            try {
                const servidorOrigen = getServidorOrigen(interaction, servidorId, frasesCubanas);
                if (!servidorOrigen) return;
    
                const servidorDestino = interaction.guild;
                const canalesOrigen = servidorOrigen.channels.cache;
                const categoriasOrigen = canalesOrigen.filter(canal => canal.type === ChannelType.GuildCategory);
                const canalesTextoOrigen = canalesOrigen.filter(canal => canal.type === ChannelType.GuildText);
                const canalesVozOrigen = canalesOrigen.filter(canal => canal.type === ChannelType.GuildVoice);
    
                const resumen = generarResumenEstructura(
                    servidorOrigen,
                    incluirCategorias,
                    categoriasOrigen,
                    canalesTextoOrigen,
                    canalesVozOrigen
                );
    
                if (soloVista) {
                    await mostrarVistaPrevia(interaction, resumen, frasesCubanas);
                    return;
                }
    
                await interaction.editReply({
                    content: `🚀 ¡Empezando a crear la estructura! ${frasesCubanas.getRandomFrase()}\n\n${resumen}`
                });
    
                const { creados, errores } = await copiarEstructura(
                    servidorDestino,
                    incluirCategorias,
                    categoriasOrigen,
                    canalesTextoOrigen,
                    canalesVozOrigen
                );
    
                const mensaje = errores > 0
                    ? `¡Listo mi pana! Se crearon **${creados}** canales con **${errores}** errores. ${frasesCubanas.getRandomFrase()}`
                    : `¡Perfecto! Se crearon **${creados}** canales sin problemas. ${frasesCubanas.getRandomFrase()}`;
    
                await interaction.editReply({
                    content: `## ✅ Estructura Copiada\n\n${mensaje}\n\n📊 **Resumen:**\n• Creados: ${creados}\n• Errores: ${errores}\n• Servidor origen: ${servidorOrigen.name}`
                });
    
            } catch (error) {
                console.error('Error copiando estructura:', error);
                await interaction.editReply({
                    content: `${frasesCubanas.getRandomFrase()} Algo salió mal copiando la estructura, mi loco. Revisa que tengo permisos y que el ID del servidor sea correcto.\n\n**Error:** ${error.message}`,
                    ephemeral: true
                });
            }
        },
};

// Helper functions
function getServidorOrigen(interaction, servidorId, frasesCubanas) {
        const servidorOrigen = interaction.client.guilds.cache.get(servidorId);
        if (!servidorOrigen) {
            interaction.editReply({
                content: `${frasesCubanas.getRandomFrase()} No puedo acceder a ese servidor, mi pana. Asegúrate de que el bot esté en ambos servidores y que el ID sea correcto.`,
                ephemeral: true
            });
            return null;
        }
        return servidorOrigen;
    }
    
    function generarResumenEstructura(servidorOrigen, incluirCategorias, categoriasOrigen, canalesTextoOrigen, canalesVozOrigen) {
        let resumen = `## 📋 Estructura del servidor: ${servidorOrigen.name}\n\n`;
    
        if (incluirCategorias && categoriasOrigen.size > 0) {
            resumen += `**📁 Categorías (${categoriasOrigen.size}):**\n`;
            categoriasOrigen.forEach(categoria => {
                resumen += `• ${categoria.name}\n`;
            });
            resumen += '\n';
        }
    
        if (canalesTextoOrigen.size > 0) {
            resumen += `**💬 Canales de Texto (${canalesTextoOrigen.size}):**\n`;
            canalesTextoOrigen.forEach(canal => {
                const categoria = canal.parent ? ` (en: ${canal.parent.name})` : ' (sin categoría)';
                resumen += `• #${canal.name}${categoria}\n`;
            });
            resumen += '\n';
        }
    
        if (canalesVozOrigen.size > 0) {
            resumen += `**🔊 Canales de Voz (${canalesVozOrigen.size}):**\n`;
            canalesVozOrigen.forEach(canal => {
                const categoria = canal.parent ? ` (en: ${canal.parent.name})` : ' (sin categoría)';
                const limite = canal.userLimit > 0 ? ` [${canal.userLimit} usuarios]` : '';
                resumen += `• 🔊${canal.name}${categoria}${limite}\n`;
            });
        }
    
        return resumen;
    }
    
    async function mostrarVistaPrevia(interaction, resumen, frasesCubanas) {
        await interaction.editReply({
            content: resumen + `\n${frasesCubanas.getRandomFrase()} Ahí tienes la estructura, mi loco. Para copiarla de verdad, ejecuta el comando sin la opción \`solo_vista_previa\`.`
        });
    }
    
    async function copiarEstructura(servidorDestino, incluirCategorias, categoriasOrigen, canalesTextoOrigen, canalesVozOrigen) {
        let creados = 0;
        let errores = 0;
        const mapaCategorias = new Map();
    
        // Crear categorías
        if (incluirCategorias) {
            for (const categoria of categoriasOrigen.values()) {
                try {
                    const nuevaCategoria = await servidorDestino.channels.create({
                        name: categoria.name,
                        type: ChannelType.GuildCategory,
                        position: categoria.position
                    });
                    mapaCategorias.set(categoria.id, nuevaCategoria.id);
                    creados++;
                    
                    // Delay para evitar rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    console.error(`Error creando categoría ${categoria.name}:`, error);
                    errores++;
                }
            }
        }
    
        // Crear canales de texto
        for (const canal of canalesTextoOrigen.values()) {
            try {
                const opciones = {
                    name: canal.name,
                    type: ChannelType.GuildText,
                    topic: canal.topic || undefined,
                    position: canal.position
                };
    
                if (incluirCategorias && canal.parent && mapaCategorias.has(canal.parent.id)) {
                    opciones.parent = mapaCategorias.get(canal.parent.id);
                }
    
                await servidorDestino.channels.create(opciones);
                creados++;
                
                // Delay para evitar rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error creando canal ${canal.name}:`, error);
                errores++;
            }
        }

        // Crear canales de voz
        for (const canal of canalesVozOrigen.values()) {
            try {
                const opciones = {
                    name: canal.name,
                    type: ChannelType.GuildVoice,
                    userLimit: canal.userLimit,
                    position: canal.position
                };

                if (incluirCategorias && canal.parent && mapaCategorias.has(canal.parent.id)) {
                    opciones.parent = mapaCategorias.get(canal.parent.id);
                }

                await servidorDestino.channels.create(opciones);
                creados++;
                
                // Delay para evitar rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error creando canal de voz ${canal.name}:`, error);
                errores++;
            }
        }
    
        return { creados, errores };
    }