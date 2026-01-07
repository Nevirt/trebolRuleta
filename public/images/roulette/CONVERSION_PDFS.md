# 🔄 Conversión de PDFs a PNG/SVG (Recomendado)

Los PDFs funcionan, pero para mejor rendimiento y compatibilidad web, es recomendable convertirlos a PNG o SVG.

## 🎯 Archivos Actuales (PDFs)

- `centro.pdf` → Logo central
- `tenes otro intento.pdf` → Segmento 1
- `suerte la proxima.pdf` → Segmento 2  
- `Un sombrerito.pdf` → Segmento 3
- `un llavero.pdf` → Segmento 4
- `Una toallita.pdf` → Segmento 5

## 📝 Archivos Necesarios Después de Conversión

### En `public/images/roulette/`:
- `center-logo.png` o `center-logo.svg` (de `centro.pdf`)
- `border-green.png` o `border-green.svg` (contorno verde - falta)
- `pointer.png` o `pointer.svg` (indicador superior - falta)

### En `public/images/roulette/segments/`:
- `segment-1.png` hasta `segment-6.png` (de los PDFs correspondientes)

## 🛠️ Herramientas para Conversión

### Opción 1: Online (Fácil)
- **CloudConvert**: https://cloudconvert.com/pdf-to-png
- **ILovePDF**: https://www.ilovepdf.com/es/pdf_a_png
- Sube cada PDF y descarga como PNG

### Opción 2: Adobe Illustrator/Photoshop
1. Abre el PDF
2. Exporta como PNG con transparencia
3. Guarda con el nombre correspondiente

### Opción 3: Command Line (Avanzado)
```bash
# Con ImageMagick instalado
magick convert -density 300 input.pdf -quality 100 output.png
```

## ✅ Ventajas de PNG/SVG sobre PDF

- ✅ Mejor rendimiento en navegadores
- ✅ Carga más rápida
- ✅ Mejor compatibilidad móvil
- ✅ Menor tamaño de archivo
- ✅ Mejor calidad visual en web

## 📋 Checklist de Conversión

- [ ] Convertir `centro.pdf` → `center-logo.png`
- [ ] Convertir `tenes otro intento.pdf` → `segment-1.png`
- [ ] Convertir `suerte la proxima.pdf` → `segment-2.png`
- [ ] Convertir `Un sombrerito.pdf` → `segment-3.png`
- [ ] Convertir `un llavero.pdf` → `segment-4.png`
- [ ] Convertir `Una toallita.pdf` → `segment-5.png`
- [ ] Obtener `border-green.png` (contorno verde)
- [ ] Obtener `pointer.png` (indicador superior)

## 💡 Nota

El código actual **funciona con PDFs**, pero si conviertes a PNG/SVG, el componente los detectará automáticamente y funcionará mejor.
