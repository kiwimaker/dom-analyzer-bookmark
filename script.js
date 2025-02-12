(function () {
    let body = document.body;
    const currentUrl = window.location.href;

    function analyzeDOM(node, depth = 0, stats = { 
        totalNodes: 0, 
        elementNodes: 0, 
        textNodes: 0, 
        commentNodes: 0, 
        maxDepth: 0, 
        tagCounts: {}, 
        levels: {},
        attributes: {},
        accessibility: {
            missingAlt: 0,
            missingLabels: 0,
            missingAriaLabels: 0,
            interactiveElements: 0
        },
        seo: {
            headings: {h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0},
            metaTags: 0,
            linksWithoutText: 0,
            imagesWithoutAlt: 0
        },
        performance: {
            deeplyNested: [],    // Elementos con profundidad > 6
            heavyElements: [],   // Elementos con muchos hijos directos
            inlineStyles: 0,     // Solo estilos inline (style="...")
            inlineScripts: 0,    // Solo scripts inline (sin src)
            totalScriptSize: 0,  // Tamaño de scripts inline
            totalStyleSize: 0    // Tamaño de estilos inline
        }
    }) {
        stats.totalNodes++;
        
        if (node.nodeType === Node.ELEMENT_NODE) {
            stats.elementNodes++;
            let tag = node.tagName.toLowerCase();
            stats.tagCounts[tag] = (stats.tagCounts[tag] || 0) + 1;

            // Análisis de atributos
            Array.from(node.attributes).forEach(attr => {
                stats.attributes[attr.name] = (stats.attributes[attr.name] || 0) + 1;
            });

            // Análisis de accesibilidad
            if (tag === 'img' && !node.hasAttribute('alt')) {
                stats.accessibility.missingAlt++;
                stats.seo.imagesWithoutAlt++;
            }
            if ((tag === 'input' || tag === 'textarea') && !node.hasAttribute('label') && !node.hasAttribute('aria-label')) {
                stats.accessibility.missingLabels++;
            }
            if (node.hasAttribute('role') && !node.hasAttribute('aria-label')) {
                stats.accessibility.missingAriaLabels++;
            }
            if (tag === 'button' || tag === 'a' || tag === 'input' || tag === 'select') {
                stats.accessibility.interactiveElements++;
            }

            // Análisis SEO
            if (tag.match(/^h[1-6]$/)) {
                stats.seo.headings[tag]++;
            }
            if (tag === 'meta') {
                stats.seo.metaTags++;
            }
            if (tag === 'a' && !node.textContent.trim()) {
                stats.seo.linksWithoutText++;
            }

            // Análisis de rendimiento
            if (depth > 6) {
                stats.performance.deeplyNested.push({
                    tag,
                    depth,
                    path: getNodePath(node)
                });
            }
            if (node.children.length > 20) {
                stats.performance.heavyElements.push({
                    tag,
                    childCount: node.children.length,
                    path: getNodePath(node)
                });
            }
            if (node.hasAttribute('style')) {
                stats.performance.inlineStyles++;
                stats.performance.totalStyleSize += node.getAttribute('style').length;
            }
            if (tag === 'script' && !node.hasAttribute('src')) {
                stats.performance.inlineScripts++;
                if (node.textContent) {
                    stats.performance.totalScriptSize += node.textContent.length;
                }
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            stats.textNodes++;
        } else if (node.nodeType === Node.COMMENT_NODE) {
            stats.commentNodes++;
        }

        stats.maxDepth = Math.max(stats.maxDepth, depth);
        stats.levels[depth] = (stats.levels[depth] || 0) + 1;

        for (let child of node.childNodes) {
            analyzeDOM(child, depth + 1, stats);
        }

        return stats;
    }

    function saveStats(stats) {
        const timestamp = new Date().toISOString();
        // Obtener todas las estadísticas guardadas
        const allStats = JSON.parse(localStorage.getItem('domStatsByUrl') || '{}');
        
        // Obtener estadísticas para la URL actual
        const urlStats = allStats[currentUrl] || [];
        
        // Añadir nuevas estadísticas
        urlStats.push({
            timestamp,
            stats
        });
        
        // Mantener solo las últimas 10 ejecuciones para esta URL
        if (urlStats.length > 10) {
            urlStats.shift();
        }
        
        // Actualizar las estadísticas de esta URL
        allStats[currentUrl] = urlStats;
        
        // Guardar todo de vuelta en localStorage
        localStorage.setItem('domStatsByUrl', JSON.stringify(allStats));
        return timestamp;
    }

    function displayTagsTable(tagCounts) {
        // Convertir el objeto en array y ordenar por frecuencia
        const sortedTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1]);

        // Encontrar la longitud máxima para el padding
        const maxTagLength = Math.max(...sortedTags.map(([tag]) => tag.length));
        const maxCountLength = Math.max(...sortedTags.map(([,count]) => count.toString().length));

        // Crear la cabecera de la tabla
        console.log('\n📋 Distribución de etiquetas HTML:');
        console.log('╔' + '═'.repeat(maxTagLength + 2) + '╦' + '═'.repeat(maxCountLength + 2) + '╦════════╗');
        console.log('║ ' + 'Tag'.padEnd(maxTagLength) + ' ║ ' + 'Cant.'.padStart(maxCountLength) + ' ║ Gráfico ║');
        console.log('╠' + '═'.repeat(maxTagLength + 2) + '╬' + '═'.repeat(maxCountLength + 2) + '╬════════╣');

        // Encontrar el valor máximo para escalar la barra
        const maxCount = Math.max(...sortedTags.map(([,count]) => count));

        // Imprimir cada fila
        sortedTags.forEach(([tag, count]) => {
            const barLength = Math.round((count / maxCount) * 8);
            const bar = '█'.repeat(barLength);
            console.log(
                '║ ' + 
                tag.padEnd(maxTagLength) + 
                ' ║ ' + 
                count.toString().padStart(maxCountLength) + 
                ' ║ ' + 
                bar.padEnd(8) + 
                ' ║'
            );
        });

        // Cerrar la tabla
        console.log('╚' + '═'.repeat(maxTagLength + 2) + '╩' + '═'.repeat(maxCountLength + 2) + '╩════════╝');
    }

    function compareWithPrevious(currentStats, timestamp) {
        const allStats = JSON.parse(localStorage.getItem('domStatsByUrl') || '{}');
        const urlStats = allStats[currentUrl] || [];
        
        if (urlStats.length <= 1) {
            console.log(`⚠️ No hay datos previos para comparar en esta URL: ${currentUrl}`);
            return;
        }

        const previousStats = urlStats[urlStats.length - 2].stats;
        
        console.log(`\n📊 Comparación con la ejecución anterior en ${currentUrl}:`);
        
        function compareValue(current, previous, label) {
            const diff = current - previous;
            const symbol = diff > 0 ? '📈' : diff < 0 ? '📉' : '➡️';
            console.log(`${symbol} ${label}: ${previous} → ${current} (${diff >= 0 ? '+' : ''}${diff})`);
        }

        compareValue(currentStats.totalNodes, previousStats.totalNodes, "Total de nodos");
        compareValue(currentStats.elementNodes, previousStats.elementNodes, "Elementos HTML");
        compareValue(currentStats.textNodes, previousStats.textNodes, "Nodos de texto");
        compareValue(currentStats.commentNodes, previousStats.commentNodes, "Nodos de comentario");
        compareValue(currentStats.maxDepth, previousStats.maxDepth, "Nivel máximo de anidamiento");

        // Comparar cambios en tags específicos
        console.log("\n🔄 Cambios en etiquetas principales:");
        const allTags = new Set([
            ...Object.keys(currentStats.tagCounts),
            ...Object.keys(previousStats.tagCounts)
        ]);
        
        allTags.forEach(tag => {
            const prevCount = previousStats.tagCounts[tag] || 0;
            const currCount = currentStats.tagCounts[tag] || 0;
            if (prevCount !== currCount) {
                const diff = currCount - prevCount;
                const symbol = diff > 0 ? '📈' : '📉';
                console.log(`${symbol} <${tag}>: ${prevCount} → ${currCount} (${diff >= 0 ? '+' : ''}${diff})`);
            }
        });

        console.log(`\n📈 Historial de total de nodos para ${currentUrl} (últimas 10 ejecuciones):`);
        urlStats.forEach(entry => {
            console.log(`${new Date(entry.timestamp).toLocaleString()}: ${entry.stats.totalNodes} nodos`);
        });
    }

    function getNodePath(node) {
        const path = [];
        while (node && node.tagName) {
            let selector = node.tagName.toLowerCase();
            if (node.id) {
                selector += '#' + node.id;
            } else if (node.className && typeof node.className === 'string' && node.className.trim()) {
                selector += '.' + node.className.trim().split(' ')[0];
            }
            path.unshift(selector);
            node = node.parentNode;
        }
        return path.join(' > ');
    }

    function displayPerformanceMetrics(stats) {
        console.log('\n🚀 Métricas de Rendimiento:');
        
        // Tabla principal
        console.log('╔════════════════════════╦═══════════╗');
        console.log('║ Indicador              ║    Valor  ║');
        console.log('╠════════════════════════╬═══════════╣');
        console.log(`║ Elementos anidados     ║ ${stats.performance.deeplyNested.length.toString().padStart(9)} ║`);
        console.log(`║ Elementos pesados      ║ ${stats.performance.heavyElements.length.toString().padStart(9)} ║`);
        console.log(`║ Estilos inline         ║ ${stats.performance.inlineStyles.toString().padStart(9)} ║`);
        console.log(`║ Scripts inline         ║ ${stats.performance.inlineScripts.toString().padStart(9)} ║`);
        console.log('╚════════════════════════╩═══════════╝');

        // Información de rendimiento
        if (stats.performance.deeplyNested.length > 0) {
            console.log('\n⚠️ Se encontraron elementos muy anidados (>6 niveles)');
            console.log('   Los elementos muy anidados pueden hacer el DOM más lento y difícil de mantener.');
        }

        if (stats.performance.heavyElements.length > 0) {
            console.log('\n⚠️ Se encontraron elementos con muchos hijos directos (>20)');
            console.log('   Los elementos con demasiados hijos directos pueden afectar el rendimiento del renderizado.');
        }

        // Estadísticas de tamaño
        if (stats.performance.totalScriptSize > 0 || stats.performance.totalStyleSize > 0) {
            console.log('\n📦 Tamaños de código inline:');
            if (stats.performance.totalStyleSize > 0) {
                console.log(`   ↳ Estilos: ${(stats.performance.totalStyleSize / 1024).toFixed(2)}KB`);
            }
            if (stats.performance.totalScriptSize > 0) {
                console.log(`   ↳ Scripts: ${(stats.performance.totalScriptSize / 1024).toFixed(2)}KB`);
            }
        }

        // Recomendaciones
        if (stats.performance.deeplyNested.length > 0 || 
            stats.performance.heavyElements.length > 0 || 
            stats.performance.inlineStyles > 10 ||
            stats.performance.inlineScripts > 5) {
            console.log('\n💡 Recomendaciones de rendimiento:');
            if (stats.performance.deeplyNested.length > 0) {
                console.log('   • Considera aplanar la estructura del DOM para mejorar el rendimiento');
            }
            if (stats.performance.heavyElements.length > 0) {
                console.log('   • Evalúa dividir los elementos con muchos hijos en componentes más pequeños');
            }
            if (stats.performance.inlineStyles > 10) {
                console.log('   • Considera mover los estilos inline a una hoja de estilos');
            }
            if (stats.performance.inlineScripts > 5) {
                console.log('   • Considera mover los scripts inline a archivos externos');
            }
        }
    }

    function displayAccessibilityMetrics(stats) {
        console.log('\n♿ Métricas de Accesibilidad:');
        console.log('╔════════════════════════╦═══════╗');
        console.log('║ Indicador              ║ Valor ║');
        console.log('╠════════════════════════╬═══════╣');
        console.log(`║ Imágenes sin alt       ║ ${stats.accessibility.missingAlt.toString().padStart(5)} ║`);
        console.log(`║ Campos sin label       ║ ${stats.accessibility.missingLabels.toString().padStart(5)} ║`);
        console.log(`║ ARIA labels faltantes  ║ ${stats.accessibility.missingAriaLabels.toString().padStart(5)} ║`);
        console.log(`║ Elementos interactivos ║ ${stats.accessibility.interactiveElements.toString().padStart(5)} ║`);
        console.log('╚════════════════════════╩═══════╝');
    }

    function displaySEOMetrics(stats) {
        console.log('\n🔍 Métricas SEO:');
        console.log('╔════════════════════════╦═══════╗');
        console.log('║ Indicador              ║ Valor ║');
        console.log('╠════════════════════════╬═══════╣');
        Object.entries(stats.seo.headings).forEach(([tag, count]) => {
            console.log(`║ Headings ${tag.toUpperCase()}          ║ ${count.toString().padStart(5)} ║`);
        });
        console.log(`║ Meta tags              ║ ${stats.seo.metaTags.toString().padStart(5)} ║`);
        console.log(`║ Links sin texto        ║ ${stats.seo.linksWithoutText.toString().padStart(5)} ║`);
        console.log(`║ Imágenes sin alt       ║ ${stats.seo.imagesWithoutAlt.toString().padStart(5)} ║`);
        console.log('╚════════════════════════╩═══════╝');
    }

    function displayAttributesTable(attributes) {
        const sortedAttrs = Object.entries(attributes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);  // Top 10 atributos más usados

        console.log('\n🏷️  Atributos más utilizados:');
        console.log('╔════════════════════════╦═══════╗');
        console.log('║ Atributo              ║  Usos ║');
        console.log('╠════════════════════════╬═══════╣');
        sortedAttrs.forEach(([attr, count]) => {
            console.log(`║ ${attr.padEnd(20)} ║ ${count.toString().padStart(5)} ║`);
        });
        console.log('╚════════════════════════╩═══════╝');
    }

    let stats = analyzeDOM(body);

    // Calcular promedio de nodos por nivel
    let totalLevels = Object.keys(stats.levels).length;
    let avgNodesPerLevel = stats.totalNodes / totalLevels;

    // Imprimir resultados
    console.log("📊 Análisis del DOM dentro de <body>:");
    console.log(`✅ Total de nodos: ${stats.totalNodes}`);
    console.log(`🔹 Elementos HTML: ${stats.elementNodes}`);
    console.log(`📝 Nodos de texto: ${stats.textNodes}`);
    console.log(`💬 Nodos de comentario: ${stats.commentNodes}`);
    console.log(`📏 Nivel máximo de anidamiento: ${stats.maxDepth}`);
    console.log(`📊 Promedio de nodos por nivel: ${avgNodesPerLevel.toFixed(2)}`);
    
    displayTagsTable(stats.tagCounts);
    displayAttributesTable(stats.attributes);
    displayAccessibilityMetrics(stats);
    displaySEOMetrics(stats);
    displayPerformanceMetrics(stats);

    const timestamp = saveStats(stats);
    compareWithPrevious(stats, timestamp);
})();