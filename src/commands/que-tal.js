const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('que-tal')
        .setDescription('¡Saludo cubano! 🇨🇺')
        .addUserOption(option =>
            option.setName('pana')
                .setDescription('¿A quién quieres saludar?')
                .setRequired(false)),

    async execute(interaction) {
        const pana = interaction.options.getUser('pana');
        
        const saludos = [
            'Asere, ¿qué bolá?',
            '¡Ñó, qué tal!',
            '¿Cómo tú \'tás?',
            '¡Klk, mi loco!',
            'Oye, ¿qué es la cosa?'
        ];

        const respuestas = [
            'Aquí andamos en la lucha 💪',
            'Coger un diez siempre 🚀',
            'En la pincha, pero con buena vibra 💼',
            'Dale que vamos pa\' arriba 📈',
            'La jugada está apretá, pero vamos bien ✨',
            'Aquí, resolviendo como siempre 🔧',
            'Dale pa\' que veas 🔥',
            'Buscando el maceta siempre 💰',
            'En mi casa particular, tranquilo 🏠',
            'Esperando la guagua 🚌',
            'Yo lo que no tengo es que esconderlo 🤷‍♂️',
            'Ando enfermo de los nervios, pero bien 😵',
            'Toma chocolate y todo se resuelve ☕'
        ];

        const saludo = saludos[Math.floor(Math.random() * saludos.length)];
        const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];

        let mensaje;
        
        if (pana) {
            mensaje = `${saludo} ${pana} 🇨🇺\n\n${respuesta}`;
        } else {
            mensaje = `${saludo} 🇨🇺\n\n${respuesta}`;
        }

        // Añadir una expresión cubana aleatoria
        const expresionesCubanas = [
            'No seas tan cotorra 🦜',
            'Eres tremendo maceta 💰',
            'Ese está aplatanao ya 🌴',
            'Vamos a coger botella 🚗',
            'No des tanta muela 🗣️',
            'Dale pa\' que veas',
            'Los yumas no entienden esto 🌍',
            'Hay que tirar un cabo 🤝',
            'Toma chocolate, paga lo que debes ☕',
            'Ando enfermo de los nervios 😵',
            'Yo lo que no tengo es que esconderlo 🤷‍♂️',
            '¡Ay! ¡Se me corre de pierna a pierna! 😰',
            'Tú eres un baboso 😤'
        ];

        const expresionExtra = expresionesCubanas[Math.floor(Math.random() * expresionesCubanas.length)];

        const embed = {
            color: 0x00ff00,
            title: '🇨🇺 ¡Saludo Cubano de Pura Cepa!',
            description: mensaje,
            fields: [
                {
                    name: '💬 Expresión del Día',
                    value: expresionExtra,
                    inline: false
                }
            ],
            footer: {
                text: '¡Dale que este bot tiene sabor cubano de pura cepa! 🌴',
                icon_url: interaction.user.displayAvatarURL()
            },
            timestamp: new Date().toISOString()
        };

        await interaction.reply({ embeds: [embed] });
    }
};