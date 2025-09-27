# 🇨🇺 Bot de Discord Para Cubanos - "Disciplina"

Un bot de Discord potente y completo desarrollado con Node.js y Discord.js v14, especialmente diseñado para la comunidad cubana. Con lenguaje y expresiones familiares, puede realizar **TODAS** las funciones administrativas de un servidor, incluyendo:

## ✨ Características Principales

### 🏗️ Gestión de Canales
- **Crear canales** de cualquier tipo (texto, voz, categorías, anuncios, foros)
- **Modificar canales** existentes (nombre, descripción, límites, NSFW)
- **Eliminar canales** con confirmación de seguridad
- Soporte completo para categorías y jerarquías

### 👑 Gestión de Roles
- **Crear roles** personalizados con colores y permisos
- **Asignar y remover roles** de usuarios
- Control de jerarquías y permisos
- Configuración avanzada de roles

### 🛡️ Moderación Avanzada
- **Ban/Kick** usuarios con razones personalizadas
- **Timeout** temporal de usuarios
- **Limpieza masiva** de mensajes
- Sistema de moderación completo y seguro

### 📊 Información y Estadísticas
- Información detallada del bot y servidor
- Estadísticas en tiempo real
- Estado personalizable del bot

### 🇨🇺 Características Especiales para Cubanos
- **Lenguaje cubano:** Expresiones y frases familiares
- **Comando `/que-tal`:** Saludo especial cubano
- **Mensajes personalizados:** Con sabor cubano en todas las respuestas

## 🚀 Instalación y Configuración

### 1. Prerrequisitos
- Node.js v16.11.0 o superior
- Una aplicación de Discord creada en el [Portal de Desarrolladores](https://discord.com/developers/applications)

### 2. Configuración del Bot de Discord

1. **Crear la aplicación:**
   - Ve a https://discord.com/developers/applications
   - Haz clic en "New Application"
   - Dale un nombre a tu bot

2. **Configurar el bot:**
   - Ve a la sección "Bot" en el panel izquierdo
   - Haz clic en "Add Bot"
   - Copia el token (lo necesitarás después)

3. **Configurar permisos:**
   - En la sección "OAuth2" > "URL Generator"
   - Selecciona "bot" y "applications.commands"
   - Selecciona estos permisos:
     - ✅ **Administrator** (recomendado para funcionalidad completa)
     - O selecciona permisos específicos:
       - Manage Channels
       - Manage Roles
       - Ban Members
       - Kick Members
       - Manage Messages
       - Moderate Members
       - Send Messages
       - Use Slash Commands

4. **Invitar el bot:**
   - Copia la URL generada e invita el bot a tu servidor

### 3. Configuración del Proyecto

1. **Clonar/descargar el proyecto**
2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   - Copia `.env.example` a `.env`
   - Completa las variables:
   ```env
   DISCORD_TOKEN=tu_token_del_bot_aqui
   CLIENT_ID=tu_client_id_aqui
   GUILD_ID=tu_guild_id_aqui
   ```

4. **Registrar comandos slash:**
   ```bash
   node src/deploy-commands.js
   ```

5. **Iniciar el bot:**
   ```bash
   npm start
   ```

   Para desarrollo (con recarga automática):
   ```bash
   npm run dev
   ```

## 📋 Comandos Disponibles

### 🏗️ Gestión de Canales
- `/crear-canal` - Crea un nuevo canal (texto, voz, categoría, etc.)
- `/modificar-canal` - Modifica propiedades de canales existentes
- `/eliminar-canal` - Elimina un canal (con confirmación)

### 👑 Gestión de Roles
- `/crear-rol` - Crea un nuevo rol personalizado
- `/asignar-rol` - Asigna o remueve roles de usuarios

### 🛡️ Moderación
- `/moderar ban` - Banea usuarios del servidor
- `/moderar kick` - Expulsa usuarios del servidor
- `/moderar timeout` - Aplica timeout temporal
- `/moderar limpiar` - Limpia mensajes del canal

### 📊 Información
- `/info` - Muestra información del bot y servidor

### 🇨🇺 Comandos Especiales Cubanos
- `/que-tal` - Saludo cubano especial para los panas

## 🔧 Estructura del Proyecto

```
Bot-Discord/
├── src/
│   ├── commands/          # Comandos slash del bot
│   │   ├── crear-canal.js
│   │   ├── modificar-canal.js
│   │   ├── eliminar-canal.js
│   │   ├── crear-rol.js
│   │   ├── asignar-rol.js
│   │   ├── moderar.js
│   │   └── info.js
│   ├── events/            # Eventos del bot
│   │   └── ready.js
│   ├── deploy-commands.js # Script para registrar comandos
│   └── index.js          # Archivo principal del bot
├── .env.example          # Plantilla de variables de entorno
├── package.json          # Dependencias y scripts
└── README.md            # Documentación
```

## 🛡️ Seguridad y Permisos

El bot incluye múltiples capas de seguridad:

- **Verificación de permisos:** El bot verifica tanto sus propios permisos como los del usuario
- **Jerarquía de roles:** Respeta la jerarquía de roles para evitar escalación de privilegios
- **Confirmaciones:** Acciones destructivas requieren confirmación
- **Logging:** Todas las acciones se registran con información detallada

## 🔧 Personalización

### Añadir Nuevos Comandos
1. Crea un archivo en `src/commands/`
2. Sigue la estructura de los comandos existentes
3. Ejecuta `node src/deploy-commands.js` para registrar

### Modificar Funcionalidades
- Los comandos son modulares y fáciles de modificar
- Cada comando tiene su propia validación y manejo de errores
- Utiliza las últimas características de Discord.js v14

## ❓ Solución de Problemas

### El bot no responde
- Verifica que el token sea correcto
- Asegúrate de que el bot tenga los permisos necesarios
- Comprueba que los comandos estén registrados

### Errores de permisos
- El bot necesita permisos de **Administrator** o permisos específicos
- Verifica que el rol del bot esté por encima de los roles que quiere gestionar

### Comandos no aparecen
- Ejecuta `node src/deploy-commands.js` para registrar comandos
- Para comandos globales, puede tomar hasta 1 hora en propagarse

## 📞 Soporte

Si necesitas ayuda:
1. Verifica la documentación
2. Revisa los logs del bot en la consola
3. Asegúrate de tener la versión correcta de Node.js
4. Verifica que todas las dependencias estén instaladas

## 🎉 ¡Funcionalidades Ilimitadas!

Este bot puede hacer **TODO** lo que necesitas en tu servidor de Discord:

- ✅ Crear y gestionar canales de cualquier tipo
- ✅ Crear, modificar y asignar roles
- ✅ Moderar usuarios (ban, kick, timeout)
- ✅ Limpiar mensajes masivamente
- ✅ Sistema de permisos robusto
- ✅ Interfaz de comandos slash moderna
- ✅ Embeds informativos y atractivos
- ✅ Manejo de errores completo
- ✅ Seguridad y validaciones
- ✅ Fácil de extender y personalizar

¡Tu bot está listo para administrar completamente tu servidor de Discord! 🚀