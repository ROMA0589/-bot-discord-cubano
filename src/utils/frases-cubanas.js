/**
 * Frases y expresiones        errores: [
        moderacion: [
        'Tú no me calculas... 🔨',
        'Eres más rollo que película... 👮‍♂️',
        'No metas la cuchareta aquí... 🥄',
        'Se acabó dar muela... 🗣️',
        'Deja de ser tan cotorra... 🦜',
        'Esa pincha no va aquí... 🚫',
        'Tú eres un baboso... 😤',
        'Toma chocolate, paga lo que debes ☕'
    ],acabó como la fiesta del Guatao... 😅',
        'Andas al berro con eso... 🤔',
        'La jugada está apretá... 🔧',
        'Amaneció con el moño virao... 😬',
        'Eso quedó arroz con mango... 🍚',
        '¡Ñó, eso está en candela! 🔥',
        'Hay que tirar un cabo aquí... 🤝',
        'Ando enfermo de los nervios con esto... 😵',
        '¡Ay! ¡Se me corre de pierna a pierna! 😰'
    ],on: [
        'Tú no me calculas... 🔨',
        'Eres más rollo que película... 👮‍♂️',
        'No metas la cuchareta aquí... 🥄',
        'Se acabó dar muela... 🗣️',
        'Deja de ser tan cotorra... 🦜',
        'Esa pincha no va aquí... 🚫'
    ], para el bot
 */

const frasesCubanas = {
    saludos: [
        'Asere, ¿qué bolá?',
        '¡Ey, qué tal!',
        '¿Cómo tú \'tás?',
        '¡Klk, mi loco!',
        '¿Qué tal andas?',
        '¡Ñó, qué tal!',
        'Oye, ¿qué es la cosa?'
    ],

    exitosas: [
        '¡Coger un diez! ✅',
        '¡Eso salió perfecto! 🎉',
        '¡Dale pa\' que veas! 🔥',
        '¡Tremendo trabajo! 🏆',
        '¡Eso está que vuela! 🚀',
        '¡Te quedaste maceta con eso! 💰',
        '¡Eres tremendo aplatanao haciendo esto! 🌴'
    ],

    errores: [
        'Acabó como la fiesta del Guatao... 😅',
        'Andas al berro con eso... 🤔',
        'La jugada está apretá... 🔧',
        'Amaneció con el moño virao... 😬',
        'Eso quedó arroz con mango... 🍚',
        '¡Ñó, eso está en candela! 🔥',
        'Hay que tirar un cabo aquí... �'
    ],

    moderacion: [
        'Tú no me calculas... 🔨',
        'Eres más rollo que película... 👮‍♂️',
        '¡Eso sí no se permite aquí! ⛔',
        'Se acabó la fiesta para ese... �',
        '¡Dale que aquí se respeta! 💪'
    ],

    despedidas: [
        '¡Dale, nos vemos!',
        'Que estés bien, asere',
        'Dale pa\' lante',
        'Cuídense, mi gente',
        'Nos vemos en la lucha',
        'Coge la guagua con cuidado 🚌',
        'Que tengas buena pincha 💼'
    ],

    // Nuevas categorías con expresiones cubanas auténticas
    expresiones: [
        'Eres tremendo maceta 💰',
        'No seas tan cotorra 🦜',
        'Deja de meter la cuchareta 🥄',
        'Vamos a coger botella 🚗',
        'Ese está aplatanao ya 🌴',
        'Eso quedó arroz con mango 🍚',
        'No des tanta muela 🗣️',
        'Hay que tirar un cabo 🤝',
        'Ese almendrón está brutal 🚗',
        'Los yumas no entienden esto 🌍',
        'Lleva esa jaba pa\' allá 👜',
        'Voy en la guagua 🚌',
        'Busco una casa particular 🏠',
        'Vamos al paladar 🍽️',
        'Toma chocolate, paga lo que debes ☕',
        'Tú eres un baboso 😤',
        'Ando enfermo de los nervios 😵',
        'Yo lo que no tengo es que esconderlo 🤷‍♂️'
    ],

    reacciones: [
        '¡Ñó! 😲',
        '¡Dale pa\' que veas!',
        '¡Brutal, asere!',
        '¡Qué clase de cosa!',
        '¡Eso sí está bueno!',
        '¡Tremenda cosa!',
        '¡Dale con eso!'
    ]
};

/**
 * Función para obtener una frase aleatoria de una categoría
 * @param {string} categoria - Categoría de frases
 * @returns {string} Frase aleatoria
 */
function obtenerFrase(categoria) {
    const frases = frasesCubanas[categoria] || frasesCubanas.saludos;
    return frases[Math.floor(Math.random() * frases.length)];
}

/**
 * Función para obtener una expresión cubana aleatoria
 * @returns {string} Expresión cubana
 */
function obtenerExpresionCubana() {
    return obtenerFrase('expresiones');
}

/**
 * Función para obtener una reacción cubana aleatoria
 * @returns {string} Reacción cubana
 */
function obtenerReaccionCubana() {
    return obtenerFrase('reacciones');
}

/**
 * Función para cubantizar un mensaje
 * @param {string} mensaje - Mensaje original
 * @param {string} tipo - Tipo de cubanización (exitosa, error, moderacion)
 * @returns {string} Mensaje cubanizado
 */
function cubanizar(mensaje, tipo = 'exitosas') {
    const frase = obtenerFrase(tipo);
    return `${frase}\n\n${mensaje} 🇨🇺`;
}

module.exports = {
    frasesCubanas,
    obtenerFrase,
    obtenerExpresionCubana,
    obtenerReaccionCubana,
    cubanizar
};