# 📦 Guía de Instalación - Ruleta de Premios Helados Trébol

## Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Cuenta de Neon PostgreSQL (gratuita en https://neon.tech)

## Paso 1: Configurar Base de Datos Neon

1. Crear una cuenta en [Neon.tech](https://neon.tech)
2. Crear un nuevo proyecto
3. Copiar la connection string (DATABASE_URL)
   - Formato: `postgresql://usuario:password@host.neon.tech/dbname?sslmode=require`

## Paso 2: Instalar Dependencias

```bash
npm install
```

## Paso 3: Configurar Variables de Entorno

```bash
# Desarrollo (recomendado para empezar)
npm run env:dev

# O Producción
npm run env:prod

# Verificar entorno actual
npm run env:check
```

Esto creará automáticamente el archivo `.env.local` con la configuración correcta.

**⚠️ IMPORTANTE:** Las credenciales de base de datos ya están configuradas en los scripts. Solo necesitas ejecutar el comando correspondiente.

## Paso 4: Configurar Base de Datos

```bash
# Opción 1: Comando todo-en-uno (recomendado)
npm run db:setup

# Opción 2: Comandos individuales
npx prisma generate  # Generar cliente de Prisma
npx prisma db push   # Crear las tablas en la base de datos
```

El comando `db:setup` ejecuta ambos pasos automáticamente y verifica que todo esté correcto.

## Paso 5: Ejecutar la Aplicación

```bash
# Modo desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
```

## Paso 6: Crear Premios Iniciales

1. Abrir la aplicación en el navegador
2. Hacer clic en el menú (⋮) en la esquina superior derecha
3. Seleccionar "Gestionar premios"
4. Crear los premios que deseas ofrecer

## 🚀 Despliegue en Producción

### Vercel (Recomendado)

1. Subir el código a GitHub
2. Conectar el repositorio con Vercel
3. Agregar la variable de entorno `DATABASE_URL` en la configuración de Vercel
4. Desplegar

### Otras Plataformas

- Asegurarse de que la variable `DATABASE_URL` esté configurada
- Ejecutar `npm run build` antes del despliegue
- Ejecutar `npx prisma generate` en el proceso de build

## 🔧 Comandos Útiles

```bash
# Ver la base de datos en Prisma Studio
npm run db:studio

# Generar cliente Prisma después de cambios en schema
npm run db:generate

# Ejecutar migraciones (si usas migraciones)
npx prisma migrate dev
```

## 📝 Notas Importantes

- La aplicación está optimizada para tablets
- Los giros se ejecutan siempre desde el backend para garantizar consistencia
- Los premios sin stock no pueden ser seleccionados
- Cada giro registra el nombre del premio para mantener consistencia histórica

## 🔄 Cambiar Entre Entornos

El proyecto soporta dos entornos de base de datos:

- **Desarrollo**: `ep-dry-resonance-ac3splmm-pooler.sa-east-1.aws.neon.tech`
- **Producción**: `ep-gentle-cell-ac7k8ivc-pooler.sa-east-1.aws.neon.tech`

**Métodos para cambiar:**

1. **Scripts NPM** (recomendado):
   ```bash
   npm run env:dev   # Desarrollo
   npm run env:prod  # Producción
   ```

2. **Interfaz Visual**: Botón de configuración (⚙️) en la esquina inferior izquierda

3. **Manual**: Editar `.env.local` directamente

Ver [ENV_SETUP.md](./ENV_SETUP.md) para más detalles.

## 🐛 Solución de Problemas

### Error: "Can't reach database server"
- Verificar que la `DATABASE_URL` sea correcta
- Verificar que la base de datos Neon esté activa
- Verificar la conexión a internet

### Error: "Prisma Client not generated"
- Ejecutar `npx prisma generate`

### Error: "Table does not exist"
- Ejecutar `npx prisma db push`
