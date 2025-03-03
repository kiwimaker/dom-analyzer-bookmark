javascript:(function() {
  // Función principal que analiza el DOM
  function analyzeDom() {
    // Contar nodos dentro del body
    const bodyNodes = document.body.getElementsByTagName('*');
    const totalNodes = bodyNodes.length + 1; // +1 para incluir el body
    
    // Calcular la profundidad máxima
    const maxDepth = getMaxDepth(document.body, 0);
    
    // Contar y resaltar nodos invisibles
    const hiddenNodesInfo = highlightHiddenNodes();
    
    // Mostrar resultados en la consola
    console.log('Total de nodos dentro de <body>:', totalNodes);
    console.log('Profundidad máxima del DOM:', maxDepth);
    console.log('Nodos invisibles:', hiddenNodesInfo.count);
    console.log('  - Por display:none:', hiddenNodesInfo.byType.displayNone);
    console.log('  - Por visibility:hidden:', hiddenNodesInfo.byType.visibilityHidden);
    console.log('  - Por opacity:0:', hiddenNodesInfo.byType.opacityZero);
    console.log('Porcentaje de nodos invisibles:', ((hiddenNodesInfo.count / totalNodes) * 100).toFixed(2) + '%');
    console.log('Los elementos ocultos han sido resaltados temporalmente con diferentes colores:');
    console.log('  - Rojo: display:none');
    console.log('  - Azul: visibility:hidden');
    console.log('  - Verde: opacity:0');
    console.log('Se restaurarán en 2 minutos.');
    
    // Restaurar los estilos originales después de 2 minutos
    setTimeout(() => {
      hiddenNodesInfo.hiddenElements.forEach(el => {
        // Restaurar estilos según el tipo de ocultamiento
        if (el.dataset.hiddenType === 'display') {
          el.style.display = 'none';
        } else if (el.dataset.hiddenType === 'visibility') {
          el.style.visibility = 'hidden';
        } else if (el.dataset.hiddenType === 'opacity') {
          el.style.opacity = '0';
        }
        
        // Restaurar borde
        el.style.border = el.dataset.originalBorder || 'none';
        el.style.backgroundColor = el.dataset.originalBg || '';
        
        // Limpiar datos temporales
        delete el.dataset.originalBorder;
        delete el.dataset.originalBg;
        delete el.dataset.hiddenType;
      });
      console.log('Estilos originales restaurados.');
    }, 120000);
  }

  // Función para obtener la profundidad máxima del DOM
  function getMaxDepth(node, depth) {
    if (!node) return depth;
    let maxChildDepth = depth;
    for (let i = 0; i < node.children.length; i++) {
      const childDepth = getMaxDepth(node.children[i], depth + 1);
      maxChildDepth = Math.max(maxChildDepth, childDepth);
    }
    return maxChildDepth;
  }

  // Función para contar y resaltar nodos invisibles
  function highlightHiddenNodes() {
    const allNodes = Array.from(document.body.getElementsByTagName('*'));
    // Añadir el body al array de nodos
    allNodes.unshift(document.body);
    
    // Conjunto para rastrear nodos ya contados
    const countedNodes = new Set();
    const hiddenElements = [];
    
    // Contadores por tipo de ocultamiento
    const byType = {
      displayNone: 0,
      visibilityHidden: 0,
      opacityZero: 0
    };
    
    // Primero identificar los elementos raíz que están ocultos
    for (let i = 0; i < allNodes.length; i++) {
      const node = allNodes[i];
      
      // Si ya contamos este nodo, saltarlo
      if (countedNodes.has(node)) continue;
      
      const computedStyle = window.getComputedStyle(node);
      let isHidden = false;
      let hiddenType = '';
      let highlightColor = '';
      let bgColor = '';
      
      // Verificar display:none
      if (computedStyle.display === 'none') {
        isHidden = true;
        hiddenType = 'display';
        highlightColor = '2px solid red';
        bgColor = 'rgba(255, 0, 0, 0.2)';
        byType.displayNone++;
      } 
      // Verificar visibility:hidden
      else if (computedStyle.visibility === 'hidden') {
        isHidden = true;
        hiddenType = 'visibility';
        highlightColor = '2px solid blue';
        bgColor = 'rgba(0, 0, 255, 0.2)';
        byType.visibilityHidden++;
      } 
      // Verificar opacity:0
      else if (computedStyle.opacity === '0') {
        isHidden = true;
        hiddenType = 'opacity';
        highlightColor = '2px solid green';
        bgColor = 'rgba(0, 255, 0, 0.2)';
        byType.opacityZero++;
      }
      
      if (isHidden) {
        // Verificar si el padre ya está oculto
        let parentHidden = false;
        let parent = node.parentElement;
        
        while (parent) {
          if (countedNodes.has(parent)) {
            parentHidden = true;
            break;
          }
          parent = parent.parentElement;
        }
        
        // Si el padre no está oculto, este es un elemento raíz oculto
        if (!parentHidden) {
          // Guardar estilos originales
          node.dataset.originalBorder = node.style.border;
          node.dataset.originalBg = node.style.backgroundColor;
          node.dataset.hiddenType = hiddenType;
          
          // Hacer visible y resaltar
          if (hiddenType === 'display') {
            node.style.display = 'block';
          } else if (hiddenType === 'visibility') {
            node.style.visibility = 'visible';
          } else if (hiddenType === 'opacity') {
            node.style.opacity = '1';
          }
          
          node.style.border = highlightColor;
          node.style.backgroundColor = bgColor;
          
          hiddenElements.push(node);
        }
        
        // Marcar este nodo como contado
        countedNodes.add(node);
        
        // Marcar todos sus descendientes como contados si es display:none
        // (ya que display:none oculta a todos los descendientes)
        if (hiddenType === 'display') {
          const descendants = node.getElementsByTagName('*');
          for (let j = 0; j < descendants.length; j++) {
            countedNodes.add(descendants[j]);
            byType.displayNone++;
          }
        }
      }
    }
    
    return {
      count: countedNodes.size,
      hiddenElements: hiddenElements,
      byType: byType
    };
  }

  // Iniciar análisis
  analyzeDom();
})();