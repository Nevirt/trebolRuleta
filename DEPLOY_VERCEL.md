# Desplegar en Vercel - Helados Trébol Ruleta

## 🚀 Pasos para Desplegar

### 1. Variables de Entorno en Vercel

En tu proyecto de Vercel, ve a **Settings → Environment Variables** y agrega:

```
DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require
```

**IMPORTANTE:** Usa la URL de la base de datos de PRODUCCIÓN (ep-gentle-cell-ac7k8ivc-pooler)

### 2. Despliega en Vercel

```bash
git push origin main
```

O desde Vercel Dashboard: **Deploy**

### 3. Inicializar Premios en Producción

Ve a [Neon Console](https://console.neon.tech) y ejecuta este SQL en tu base de datos de producción:

```sql
-- Insertar premios reales
INSERT INTO prizes (name, "quantityTotal", "quantityRemaining")
VALUES 
  ('Cucharita + Stickers', 100, 100),
  ('Un llavero', 80, 80),
  ('Un sombrerito', 60, 60),
  ('Una toallita', 50, 50),
  ('Tenés otro intento', 999999, 999999),
  ('Suerte la próxima', 999999, 999999);
```

**¡Listo!** Tu ruleta ya funcionará con todos los premios inicializados.

## 📝 Variables de Entorno Necesarias

```bash
# En Vercel - Settings → Environment Variables
DATABASE_URL=postgresql://[TU_URL_DE_PRODUCCION]
```

## ✅ Verificar que todo funciona

1. Ve a tu sitio en Vercel
2. La ruleta debería cargar sin el mensaje de "No hay premios disponibles"
3. Prueba girar la ruleta

## 🔧 Switch de Ambiente

- El switch DEV/PROD **solo aparece en desarrollo local**
- En Vercel (producción), **NO aparecerá el switch**
- La app siempre usará la base de datos configurada en `DATABASE_URL`

## 🔄 Para actualizar cantidades de premios

1. Ve a tu sitio en Vercel
2. Navega a `/admin`
3. Edita las cantidades desde la interfaz web

## ⚠️ Importante

- **NO subas** el archivo `.env` o `.env.local` a Git
- Mantén tus URLs de base de datos seguras
- En producción, la app siempre usa la variable `DATABASE_URL` de Vercel
- El switch de ambiente es solo para desarrollo local
