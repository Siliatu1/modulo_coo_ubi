import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

const { BaseLayer } = LayersControl;

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para recentrar el mapa
function MapUpdater({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
}

// Iconos personalizados
const iconoActual = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconoGuardado = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapView({ ubicacionActual, ubicacionGuardada, resultado }) {
  const mapRef = useRef(null);
  
  // Centro por defecto (Colombia, Bogotá)
  const defaultCenter = [4.74493, -74.04478];
  
  // Determinar el centro del mapa
  const mapCenter = ubicacionActual 
    ? [ubicacionActual.latitude, ubicacionActual.longitude]
    : ubicacionGuardada
    ? [ubicacionGuardada.latitude, ubicacionGuardada.longitude]
    : defaultCenter;
  
  // Nivel de zoom (muy alto para ver los 5 metros con detalle satelital)
  const zoomLevel = (ubicacionActual || ubicacionGuardada) ? 20 : 15;

  return (
    <div className="map-container">
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        ref={mapRef}
        style={{ height: '500px', width: '100%' }}
        className="leaflet-map"
        maxZoom={20}
        minZoom={3}
      >
        <LayersControl position="topright">
          {/* Vista Satélite de Alta Resolución (Por Defecto) */}
          <BaseLayer checked name="🛰️ Satélite HD (2026)">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com">Esri</a> World Imagery'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={20}
            />
          </BaseLayer>
          
          {/* Vista Híbrida (Satélite + Etiquetas) */}
          <BaseLayer name="🌍 Híbrido (Satélite + Calles)">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com">Esri</a> World Imagery'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={20}
            />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              opacity={0.35}
              maxZoom={19}
            />
          </BaseLayer>
          
          {/* Google Satellite (Alternativa) */}
          <BaseLayer name="🌎 Google Satélite">
            <TileLayer
              attribution='&copy; Google Maps'
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              maxZoom={20}
            />
          </BaseLayer>
          
          {/* Google Hybrid */}
          <BaseLayer name="🗺️ Google Híbrido">
            <TileLayer
              attribution='&copy; Google Maps'
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              maxZoom={20}
            />
          </BaseLayer>
          
          {/* Mapa de Calles */}
          <BaseLayer name="📍 Mapa de Calles">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </BaseLayer>
        </LayersControl>
        
        <MapUpdater center={mapCenter} zoom={zoomLevel} />
        
        {/* Marcador de ubicación actual */}
        {ubicacionActual && (
          <Marker 
            position={[ubicacionActual.latitude, ubicacionActual.longitude]}
            icon={iconoActual}
          >
            <Popup>
              <strong>📍 Ubicación Actual</strong><br />
              Lat: {ubicacionActual.latitude.toFixed(6)}<br />
              Lon: {ubicacionActual.longitude.toFixed(6)}<br />
              Precisión: ±{ubicacionActual.accuracy.toFixed(2)}m
            </Popup>
          </Marker>
        )}
        
        {/* Marcador de ubicación guardada con círculo de 5 metros */}
        {ubicacionGuardada && (
          <>
            <Marker 
              position={[ubicacionGuardada.latitude, ubicacionGuardada.longitude]}
              icon={iconoGuardado}
            >
              <Popup>
                <strong>💾 Ubicación Guardada</strong><br />
                Lat: {ubicacionGuardada.latitude.toFixed(6)}<br />
                Lon: {ubicacionGuardada.longitude.toFixed(6)}
              </Popup>
            </Marker>
            
            {/* Círculo de 5 metros */}
            <Circle
              center={[ubicacionGuardada.latitude, ubicacionGuardada.longitude]}
              radius={5}
              pathOptions={{
                color: resultado?.dentroDelRango ? '#4CAF50' : '#f44336',
                fillColor: resultado?.dentroDelRango ? '#4CAF50' : '#f44336',
                fillOpacity: 0.2,
                weight: 2
              }}
            >
              <Popup>
                <strong>⭕ Área de Validación</strong><br />
                Radio: 5 metros<br />
                {resultado && (
                  <>
                    Distancia actual: {resultado.distancia}m<br />
                    Estado: {resultado.dentroDelRango ? '✅ Dentro' : '❌ Fuera'}
                  </>
                )}
              </Popup>
            </Circle>
          </>
        )}
      </MapContainer>
      
      <div className="map-legend">
        <div className="legend-info">
          <div className="legend-item">
            <span className="legend-marker blue"></span>
            <span>Ubicación Actual</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker red"></span>
            <span>Ubicación Guardada</span>
          </div>
          <div className="legend-item">
            <span className="legend-circle"></span>
            <span>Área de 5 metros</span>
          </div>
        </div>�️ <strong>Vista Satelital HD 2026:</strong> Imágenes de alta resolución actualizadas. Usa el selector de capas para cambiar entre diferentes vistas satelitales
        <div className="map-info">
          <p>💡 <strong>Tip:</strong> Usa el selector de capas (esquina superior derecha) para cambiar entre mapa de calles, satélite, híbrido o terreno</p>
        </div>
      </div>
    </div>
  );
}

export default MapView;
