# Módulo de Ubicación con Mapa Interactivo - Documentación

## 📱 Descripción

Este módulo permite capturar la ubicación actual de un dispositivo (teléfono o computadora) y comparar dos ubicaciones para verificar si están dentro de un rango máximo de **5 metros**. Incluye un **mapa interactivo en tiempo real** que visualiza las ubicaciones y el área de validación.

## 🚀 Características

- ✅ Obtención de ubicación en tiempo real usando la API de Geolocalización del navegador
- ✅ **Mapa interactivo con OpenStreetMap**
- ✅ **Visualización en tiempo real de ubicaciones en el mapa**
- ✅ **Círculo de 5 metros alrededor de la ubicación guardada**
- ✅ **Marcadores personalizados (azul para actual, rojo para guardada)**
- ✅ Cálculo preciso de distancia entre dos coordenadas usando la fórmula de Haversine
- ✅ Validación automática de rango máximo (5 metros)
- ✅ Interfaz intuitiva y responsive
- ✅ Manejo de errores y permisos de ubicación
- ✅ Zoom automático y recentrado del mapa

## 📁 Estructura de Archivos

```
src/
├── utils/
│   └── location.js          # Utilidades de geolocalización
├── components/
│   ├── LocationModule.jsx   # Componente principal
│   ├── LocationModule.css   # Estilos del componente
│   ├── MapView.jsx          # Componente del mapa interactivo
│   └── MapView.css          # Estilos del mapa
└── App.jsx                  # Aplicación principal
```

## 🗺️ Funcionalidades del Mapa

### Visualización Interactiva
- **Marcador Azul (📍)**: Ubicación actual en tiempo real
- **Marcador Rojo (📍)**: Ubicación guardada de referencia  
- **Círculo Verde/Rojo**: Área de 5 metros alrededor de la ubicación guardada
  - 🟢 Verde: Cuando estás dentro del rango
  - 🔴 Rojo: Cuando estás fuera del rango

### Controles del Mapa
- Zoom in/out con botones o rueda del mouse
- Arrastrar para mover el mapa
- Click en marcadores para ver información detallada
- Popups con coordenadas exactas y datos de precisión

## 🔧 Funciones Principales

### `location.js` - Utilidades

#### `calcularDistancia(lat1, lon1, lat2, lon2)`
Calcula la distancia entre dos coordenadas geográficas usando la fórmula de Haversine.
- **Parámetros**: 
  - `lat1`, `lon1`: Latitud y longitud del primer punto
  - `lat2`, `lon2`: Latitud y longitud del segundo punto
- **Retorna**: Distancia en metros (número)

#### `obtenerUbicacionActual()`
Obtiene la ubicación actual del dispositivo.
- **Retorna**: Promise con objeto `{latitude, longitude, accuracy}`
- **Maneja**: Errores de permisos, timeout y disponibilidad

#### `verificarRangoUbicacion(lat1, lon1, lat2, lon2, rangoMaximo)`
Verifica si dos ubicaciones están dentro del rango especificado.
- **Parámetros**: 
  - Coordenadas de ambos puntos
  - `rangoMaximo`: Distancia máxima permitida (por defecto 5 metros)
- **Retorna**: Objeto `{dentroDelRango: boolean, distancia: number}`

## 📖 Cómo Usar

### 1. Iniciar la aplicación

```bash
npm install
npm run dev
```

### 2. Uso del módulo

1. **Obtener Ubicación Actual**: Haz clic en el botón verde para capturar tu posición actual
2. **Guardar Ubicación de Referencia**: Guarda esta ubicación como punto de comparación
3. **Moverse**: Desplázate físicamente a otra ubicación
4. **Comparar**: Haz clic en "Comparar con Ubicación Guardada"
5. **Ver Resultado**: El sistema mostrará:
   - Distancia exacta en metros
   - Si estás dentro o fuera del rango de 5 metros

### 3. Ejemplo de Código

```javascript
import { obtenerUbicacionActual, verificarRangoUbicacion } from './utils/location';

// Obtener ubicación actual
const ubicacion1 = await obtenerUbicacionActual();
console.log(ubicacion1); // {latitude: 4.6097, longitude: -74.0817, accuracy: 10}

// Simular segunda ubicación
const ubicacion2 = await obtenerUbicacionActual();

// Comparar ubicaciones
const resultado = verificarRangoUbicacion(
  ubicacion1.latitude,
  ubicacion1.longitude,
  ubicacion2.latitude,
  ubicacion2.longitude,
  5 // rango máximo en metros
);

console.log(resultado);
// {dentroDelRango: true, distancia: 3.45}
```

## 🎯 Algoritmo de Cálculo

El módulo utiliza la **Fórmula de Haversine** para calcular la distancia entre dos puntos en una esfera (la Tierra):

```
a = sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)
c = 2 × atan2(√a, √(1−a))
d = R × c
```

Donde:
- φ = latitud en radianes
- λ = longitud en radianes  
- R = radio de la Tierra (6,371,000 metros)
- d = distancia en metros

## 🔐 Permisos Necesarios

El módulo requiere que el usuario otorgue permisos de ubicación al navegador. Los navegadores modernos solicitan este permiso automáticamente.

## ⚙️ Configuración de Precisión

El módulo está configurado con alta precisión:
```javascript
{
  enableHighAccuracy: true,  // Máxima precisión disponible
  timeout: 10000,            // 10 segundos de timeout
  maximumAge: 0              // No usar ubicaciones en caché
}
```

## 📱 Compatibilidad

- ✅ Chrome/Edge (escritorio y móvil)
- ✅ Firefox (escritorio y móvil)
- ✅ Safari (escritorio y móvil)
- ✅ Opera
- ⚠️ Requiere HTTPS en producción

## 🛡️ Manejo de Errores

El módulo maneja los siguientes casos:
- ❌ Permiso de ubicación denegado
- ❌ Información de ubicación no disponible
- ❌ Timeout de solicitud
- ❌ Navegador sin soporte de geolocalización

## 🎨 Interfaz de Usuario

- **Diseño responsive**: Funciona en móviles y escritorio
- **Gradientes modernos**: Visualización atractiva de datos
- **Alertas visuales**: Indicadores claros de éxito/error
- **Instrucciones integradas**: Guía paso a paso en la interfaz

## 📊 Casos de Uso

1. **Control de asistencia**: Verificar que empleados estén en la ubicación correcta
2. **Geofencing**: Validar que usuarios estén dentro de un área específica
3. **Check-in de eventos**: Confirmar presencia física en eventos
4. **Delivery/Logística**: Verificar ubicación de entregas
5. **Seguridad**: Validación de ubicación para operaciones sensibles

## 🔄 Flujo de Trabajo

```
1. Usuario abre la aplicación
   ↓
2. Solicita permisos de ubicación
   ↓
3. Obtiene ubicación actual
   ↓
4. Guarda como referencia
   ↓
5. Usuario se mueve
   ↓
6. Obtiene nueva ubicación
   ↓
7. Compara con referencia
   ↓
8. Muestra resultado: distancia y validación
```

## 💡 Tips de Uso

- Para mejores resultados, usa el módulo en exteriores
- La precisión puede variar según el dispositivo (GPS vs WiFi)
- En interiores, la precisión puede ser de 10-50 metros
- Con GPS en exteriores, la precisión puede ser de 3-10 metros

## 🐛 Troubleshooting

**Problema**: No se obtiene la ubicación
- ✅ Verifica que los permisos de ubicación estén habilitados
- ✅ Asegúrate de usar HTTPS (requerido por los navegadores)
- ✅ Verifica que el GPS o WiFi estén activados

**Problema**: La precisión es muy baja
- ✅ Sal al exterior para mejor señal GPS
- ✅ Asegúrate que el GPS esté activado en el dispositivo
- ✅ Espera unos segundos para que el GPS se estabilice

## 📝 Notas Técnicas

- La fórmula de Haversine asume la Tierra como una esfera perfecta
- Para distancias cortas (< 1km), la precisión es excelente
- El error máximo es de ~0.5% para distancias cortas
- La API de Geolocalización funciona con GPS, WiFi, y torres celulares
