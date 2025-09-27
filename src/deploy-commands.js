const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Cargar todos los comandos
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`✅ Comando cargado: ${command.data.name}`);
    } else {
        console.log(`⚠️  El comando en ${filePath} no tiene las propiedades requeridas.`);
    }
}

// Crear instancia REST
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Registrar comandos
(async () => {
    try {
        console.log(`🔄 Iniciando registro de ${commands.length} comandos slash...`);

        // Para comandos globales (toma hasta 1 hora en propagarse)
        // const data = await rest.put(
        //     Routes.applicationCommands(process.env.CLIENT_ID),
        //     { body: commands },
        // );

        // Para comandos de servidor específico (inmediato)
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log(`✅ ${data.length} comandos slash registrados exitosamente!`);
        
        // Mostrar comandos registrados
        console.log('\n📋 Comandos disponibles:');
        data.forEach(command => {
            console.log(`   • /${command.name} - ${command.description}`);
        });
        
    } catch (error) {
        console.error('❌ Error registrando comandos:', error);
    }
})();