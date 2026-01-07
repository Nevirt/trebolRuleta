# 📸 Instrucciones para Subir Imágenes de la Ruleta

## 📁 Estructura de Carpetas

```
public/images/roulette/
├── border-green.png          ← Contorno verde (OBLIGATORIO)
├── center-logo.png           ← Logo central (OBLIGATORIO)
├── pointer.png               ← Indicador superior (OBLIGATORIO)
├── segments/                 ← Segmentos individuales (OPCIONAL)
│   ├── segment-1.png
│   ├── segment-2.png
│   ├── segment-3.png
│   ├── segment-4.png
│   ├── segment-5.png
│   └── segment-6.png
└── skeleton/                 ← Esqueleto/base (OPCIONAL)
    └── wheel-skeleton.png
```

## 🎯 Archivos Requeridos (Mínimos)

### 1. **border-green.png** (Contorno verde)
- **Ubicación**: `public/images/roulette/border-green.png`
- **Descripción**: El borde verde que rodea toda la ruleta
- **Formato**: PNG con transparencia
- **Tamaño recomendado**: 1200x1200px mínimo

### 2. **center-logo.png** (Logo central)
- **Ubicación**: `public/images/roulette/center-logo.png`
- **Descripción**: Logo de Helados Trébol que va en el centro (botón clickeable)
- **Formato**: PNG con transparencia
- **Tamaño recomendado**: 400x400px
- **Nota**: Este será el botón para girar la ruleta (sin texto "GIRAR")

### 3. **pointer.png** (Indicador superior)
- **Ubicación**: `public/images/roulette/pointer.png`
- **Descripción**: El triángulo/indicador que apunta hacia la ruleta desde arriba
- **Formato**: PNG con transparencia
- **Tamaño recomendado**: 100x100px

## 📦 Archivos Opcionales

### Segmentos Individuales
Si el diseñador proporcionó cada segmento por separado:
- `segment-1.png` hasta `segment-6.png`
- Cada uno debe ser un PNG con transparencia
- Deben encajar perfectamente cuando se rotan

### Esqueleto/Base
Si existe una imagen base de la ruleta:
- `skeleton/wheel-skeleton.png`
- Se mostrará detrás de los segmentos

## ✅ Checklist de Subida

- [ ] `border-green.png` subido
- [ ] `center-logo.png` subido
- [ ] `pointer.png` subido
- [ ] (Opcional) Segmentos individuales subidos
- [ ] (Opcional) Esqueleto/base subido

## 🔍 Verificación

Después de subir las imágenes:

1. Ejecuta `npm run dev`
2. Abre `http://localhost:3000`
3. Verifica que:
   - El contorno verde se ve correctamente
   - El logo central aparece y es clickeable
   - El indicador superior está visible
   - La ruleta gira correctamente al hacer clic en el logo

## 💡 Notas Importantes

- **Formato**: Todas las imágenes deben ser PNG con fondo transparente
- **Optimización**: Comprime las imágenes antes de subirlas (usa TinyPNG o similar)
- **Nombres**: Usa exactamente los nombres indicados (son case-sensitive)
- **Tamaños**: Las imágenes se escalarán automáticamente, pero mejor calidad = mejor resultado

## 🐛 Solución de Problemas

### La imagen no aparece
- Verifica que el nombre del archivo sea exacto (case-sensitive)
- Verifica que esté en la carpeta correcta
- Verifica que el formato sea PNG

### El logo no es clickeable
- Verifica que `center-logo.png` exista
- Verifica que no haya errores en la consola del navegador

### La ruleta no gira
- Verifica que haya premios creados en la base de datos
- Verifica la consola del navegador para errores
