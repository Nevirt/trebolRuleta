# 🔧 Configuración de Entornos - Base de Datos

Este proyecto soporta dos entornos de base de datos: **Desarrollo** y **Producción**.

## 📋 Entornos Disponibles

### 🔵 Desarrollo
- **Host**: `ep-dry-resonance-ac3splmm-pooler.sa-east-1.aws.neon.tech`
- **Uso**: Para pruebas y desarrollo local

### 🟢 Producción
- **Host**: `ep-gentle-cell-ac7k8ivc-pooler.sa-east-1.aws.neon.tech`
- **Uso**: Para el entorno de producción

## 🚀 Métodos para Cambiar de Entorno

### Método 1: Scripts NPM (Recomendado)

```bash
# Cambiar a desarrollo
npm run env:dev

# Cambiar a producción
npm run env:prod

# Verificar entorno actual
npm run env:check
```

### Método 2: Interfaz Visual

1. Abre la aplicación en el navegador
2. Haz clic en el botón de configuración (⚙️) en la esquina inferior izquierda
3. Selecciona el entorno deseado
4. Reinicia el servidor de desarrollo

### Método 3: Manual

Crea o edita el archivo `.env.local` en la raíz del proyecto:

**Para Desarrollo:**
```env
DATABASE_URL="postgresql://neondb_owner:npg_gZWq24KcCijD@ep-dry-resonance-ac3splmm-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"
```

**Para Producción:**
```env
DATABASE_URL="postgresql://neondb_owner:npg_gZWq24KcCijD@ep-gentle-cell-ac7k8ivc-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"
```

## ⚙️ Configuración Inicial

1. **Primera vez:**
   ```bash
   npm run env:dev  # Configura desarrollo por defecto
   ```

2. **Sincronizar esquema de base de datos:**
   ```bash
   npx prisma db push
   ```

3. **Verificar conexión:**
   ```bash
   npm run env:check
   ```

## 🔄 Flujo de Trabajo Recomendado

1. **Desarrollo Local:**
   ```bash
   npm run env:dev
   npm run dev
   ```

2. **Antes de Desplegar:**
   ```bash
   npm run env:prod
   npm run build
   npm run start  # Probar localmente con BD de producción
   ```

3. **Después de Probar:**
   ```bash
   npm run env:dev  # Volver a desarrollo
   ```

## ⚠️ Notas Importantes

- El archivo `.env.local` está en `.gitignore` y no se sube al repositorio
- Los cambios de entorno requieren **reiniciar el servidor** para aplicarse
- En producción, el entorno se configura mediante variables de entorno del hosting
- Nunca uses la base de datos de producción para desarrollo

## 🐛 Solución de Problemas

### Error: "No existe archivo .env.local"
```bash
npm run env:dev
```

### Error: "Can't reach database server"
- Verifica que el entorno esté correctamente configurado: `npm run env:check`
- Verifica tu conexión a internet
- Verifica que la base de datos Neon esté activa

### Ver entorno actual
```bash
npm run env:check
```
