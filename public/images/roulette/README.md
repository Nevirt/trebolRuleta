# 🎡 Imágenes de la Ruleta - Helados Trébol

Esta carpeta contiene todos los assets visuales de la ruleta.

## 📁 Estructura de Archivos Esperada

```
roulette/
├── wheel-complete.png        # ⭐ RULETA COMPLETA (imagen principal - ACTIVA)
├── center-logo.png           # Logo central de Helados Trébol (blanco)
├── border-green.png          # Contorno verde de la ruleta (borde exterior - opcional)
├── center-logo-hover.png     # Logo central cuando se hace hover (opcional)
├── pointer.png               # Indicador/puntero superior (triángulo rojo - opcional)
├── segments/
│   ├── segment-1.png         # Segmento 1 (Rosa - "Tenés otro intento")
│   ├── segment-2.png         # Segmento 2 (Gris - "Cucharita + Stickers")
│   ├── segment-3.png         # Segmento 3 (Teal - "Un sombrerito")
│   ├── segment-4.png         # Segmento 4 (Azul claro - "Suerte la próxima")
│   ├── segment-5.png         # Segmento 5 (Denim - "Un llavero")
│   └── segment-6.png         # Segmento 6 (Gris - "Una toallita")
└── skeleton/
    └── wheel-skeleton.svg    # Esqueleto/fallback de la ruleta
```

## 📝 Notas

- Todas las imágenes deben tener fondo transparente (PNG con transparencia)
- El contorno verde debe ser una imagen separada que se superpone
- Los segmentos pueden ser imágenes individuales o una imagen completa de la ruleta
- El logo central debe ser clickeable y animado al hacer hover/press
- El indicador debe estar fijo en la parte superior

## 🎨 Especificaciones Técnicas Recomendadas

- **Formato**: PNG con transparencia
- **Resolución**: Mínimo 1200x1200px para tablets
- **Tamaño optimizado**: Comprimir imágenes para web (usar herramientas como TinyPNG)
- **Nombres**: Usar nombres descriptivos y consistentes
