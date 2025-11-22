const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

// Crear cliente con intents necesarios para bienvenidas
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers, // ¡NECESARIO para detectar nuevos miembros!
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages
    ]
});

// Colección de comandos
client.commands = new Collection();

// Cargar comandos dinámicamente
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Comando cargado: ${command.data.name}`);
    } else {
        console.log(`⚠️  El comando en ${filePath} no tiene las propiedades requeridas.`);
    }
}

// Cargar eventos dinámicamente
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`✅ Evento cargado: ${event.name}`);
}

// Manejar interacciones de comandos slash
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No se encontró el comando ${interaction.commandName}.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error ejecutando ${interaction.commandName}:`, error);
        const errorMessage = {
            content: `❌ Hubo un error al ejecutar este comando.\n\n**Detalles:** ${error.message || 'Error desconocido'}`,
            flags: 64
        };
        // Solo responde si no se ha respondido antes
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply(errorMessage);
        } else {
            await interaction.followUp(errorMessage);
        }
    }
});

// Iniciar sesión del bot
client.login(process.env.DISCORD_TOKEN);
// Responder a mensajes directos (DM) con frases cubanas
const frasesCubanas = require('./utils/frases-cubanas');
client.on(Events.MessageCreate, async message => {
    // Solo responder si es un DM y no es de un bot
    if (message.channel.type === 1 && !message.author.bot) {
        const frase = frasesCubanas.obtenerFrase('saludos');
        await message.reply(`${frase} 🇨🇺\n\nSi quieres ver los comandos, úsalos en un servidor o escribe /ayuda.`);
    }
});