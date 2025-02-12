# 🔍 DOM Analyzer Bookmark

Una herramienta de análisis del DOM que se ejecuta como un marcador de navegador, proporcionando estadísticas detalladas sobre la estructura, accesibilidad, SEO y rendimiento de cualquier página web.

## 📋 Características

- **Estadísticas Generales**
  - Total de nodos
  - Elementos HTML
  - Nodos de texto
  - Nodos de comentario
  - Profundidad máxima del DOM
  - Promedio de nodos por nivel

- **🚀 Métricas de Rendimiento**
  - Elementos muy anidados (>6 niveles)
  - Elementos con muchos hijos (>20)
  - Scripts y estilos inline
  - Tamaño de código inline

- **♿ Análisis de Accesibilidad**
  - Imágenes sin atributo alt
  - Campos de formulario sin label
  - ARIA labels faltantes
  - Conteo de elementos interactivos

- **🔍 Métricas SEO**
  - Estructura de encabezados (h1-h6)
  - Meta tags
  - Links sin texto
  - Imágenes sin texto alternativo

- **📊 Análisis de Etiquetas**
  - Top 10 etiquetas más usadas
  - Distribución de atributos
  - Estadísticas por tipo de elemento

- **💾 Persistencia de Datos**
  - Guarda estadísticas por URL
  - Mantiene historial de las últimas 10 ejecuciones
  - Comparación con análisis anteriores

## 🚀 Instalación

1. Crea un nuevo marcador en tu navegador
2. Como nombre, escribe "Analizar DOM" (o el que prefieras)
3. En el campo URL, copia y pega todo el contenido del archivo `bookmark.js`
4. Guarda el marcador

## 📖 Uso

1. Navega a cualquier página web que quieras analizar
2. Abre la consola del navegador (F12 o Cmd+Option+J en Mac)
3. Haz clic en el marcador "Analizar DOM"
4. Los resultados aparecerán en la consola del navegador

## 📊 Ejemplo de Salida

```
📊 Análisis del DOM:
✅ Total de nodos: 1234
🔹 Elementos HTML: 567
📝 Nodos de texto: 456
💬 Comentarios: 21
📏 Profundidad máxima: 8
📊 Promedio nodos/nivel: 12.34

🚀 Rendimiento:
• Elementos muy anidados (>6): 5
• Elementos con muchos hijos (>20): 3
• Scripts inline: 2
• Estilos inline: 15

🔍 SEO:
• H1: 1
• H2: 5
• H3: 8
• Meta tags: 10
• Links sin texto: 2

♿ Accesibilidad:
• Imágenes sin alt: 3
• Campos sin label: 2
• ARIA labels faltantes: 4
• Elementos interactivos: 25

📋 Top 10 etiquetas:
• div: 150
• span: 89
• p: 67
• a: 45
...
```

## 🛠️ Características Técnicas

- No requiere dependencias externas
- Funciona en cualquier navegador moderno
- Análisis no intrusivo de la página
- Almacenamiento local para comparaciones históricas
- Detección automática de problemas comunes

## ⚠️ Consideraciones

- El análisis se realiza sobre el DOM actual, incluyendo cualquier modificación dinámica
- Los datos se almacenan en localStorage, específicos para cada URL
- Se mantiene un historial de las últimas 10 ejecuciones por URL
- El análisis es instantáneo y no afecta el rendimiento de la página

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Algunas ideas para mejorar:
- Añadir más métricas de rendimiento
- Mejorar el análisis de accesibilidad
- Añadir exportación de datos
- Implementar visualizaciones gráficas
- Añadir recomendaciones específicas de mejora

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de usar, modificar y distribuir el código. 