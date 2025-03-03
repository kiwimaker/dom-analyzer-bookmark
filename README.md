# DOM Analyzer Bookmark

Un simple marcador de JavaScript que analiza la estructura del DOM de cualquier página web y muestra métricas clave en la consola del navegador.

## Características

El script proporciona las siguientes métricas:

- **Total de nodos**: Cuenta el número total de elementos dentro de la etiqueta `<body>`.
- **Profundidad máxima del DOM**: Calcula la profundidad máxima de anidación en la estructura del DOM.
- **Nodos invisibles**: Identifica y cuenta los elementos ocultos mediante diferentes técnicas:
  - `display: none`
  - `visibility: hidden`
  - `opacity: 0`
- **Visualización de elementos ocultos**: Resalta temporalmente los elementos ocultos para verificación visual, usando diferentes colores según el método de ocultamiento.

## Cómo usar

### Versión estándar

1. Crea un nuevo marcador en tu navegador.
2. Dale un nombre como "DOM Analyzer".
3. En el campo URL, copia y pega el código JavaScript del archivo `script.js`.
4. Guarda el marcador.
5. Navega a cualquier página web y haz clic en el marcador para analizar su DOM.
6. Abre la consola del navegador (F12 o Cmd+Option+J) para ver los resultados.
7. Los elementos ocultos se restaurarán a su estado original después de 5 segundos.

### Versión para Chrome

Si estás usando Chrome y tienes problemas con los saltos de línea en los marcadores:

1. Usa el archivo `script-tab.js` que contiene una versión compacta del script (sin saltos de línea).
2. Copia todo el contenido y pégalo en el campo URL del marcador.
3. Esta versión funciona igual que la versión estándar, pero tiene un tiempo de restauración de 2 minutos en lugar de 5 segundos, lo que te da más tiempo para examinar los elementos ocultos.

## Visualización de elementos ocultos

Cuando ejecutas el script, los elementos ocultos se hacen temporalmente visibles con diferentes colores según el método de ocultamiento:

- **Rojo**: Elementos con `display: none`
- **Azul**: Elementos con `visibility: hidden`
- **Verde**: Elementos con `opacity: 0`

Esto te permite verificar visualmente qué elementos están siendo detectados como ocultos y mediante qué técnica.

## Ejemplo de salida

```
Total de nodos dentro de <body>: 1250
Profundidad máxima del DOM: 15
Nodos invisibles: 350
  - Por display:none: 320
  - Por visibility:hidden: 25
  - Por opacity:0: 5
Porcentaje de nodos invisibles: 28.00%
Los elementos ocultos han sido resaltados temporalmente con diferentes colores:
  - Rojo: display:none
  - Azul: visibility:hidden
  - Verde: opacity:0
Se restaurarán en 5 segundos. (2 minutos en la versión para Chrome)
```

## Uso técnico

Este script es útil para:

- Analizar la complejidad de una página web
- Identificar posibles problemas de rendimiento debido a un DOM demasiado profundo
- Detectar elementos ocultos que podrían estar afectando el rendimiento
- Verificar visualmente la estructura de elementos ocultos
- Identificar diferentes técnicas de ocultamiento utilizadas en la página

## Consideraciones

- El script solo analiza elementos dentro del `<body>`.
- Para elementos con `display: none`, se cuentan también todos sus descendientes como ocultos.
- Para elementos con `visibility: hidden` y `opacity: 0`, solo se cuenta el elemento específico, ya que sus descendientes pueden tener diferentes configuraciones de visibilidad.