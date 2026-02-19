import { useState } from 'react';
import { obtenerUbicacionActual, verificarRangoUbicacion } from '../utils/location';
import MapView from './MapView';
import './LocationModule.css';

function LocationModule() {
  const [ubicacionActual, setUbicacionActual] = useState(null);
  const [ubicacionGuardada, setUbicacionGuardada] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);

  const obtenerUbicacion = async () => {
    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const ubicacion = await obtenerUbicacionActual();
      setUbicacionActual(ubicacion);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const guardarUbicacion = () => {
    if (ubicacionActual) {
      setUbicacionGuardada({ ...ubicacionActual });
      setResultado(null);
      alert('Ubicación guardada correctamente');
    }
  };

  const compararUbicaciones = async () => {
    if (!ubicacionGuardada) {
      alert('Primero debes guardar una ubicación de referencia');
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const nuevaUbicacion = await obtenerUbicacionActual();
      setUbicacionActual(nuevaUbicacion);

      const resultado = verificarRangoUbicacion(
        ubicacionGuardada.latitude,
        ubicacionGuardada.longitude,
        nuevaUbicacion.latitude,
        nuevaUbicacion.longitude,
        5 // Rango máximo de 5 metros
      );

      setResultado(resultado);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const limpiarDatos = () => {
    setUbicacionActual(null);
    setUbicacionGuardada(null);
    setResultado(null);
    setError(null);
  };

  return (
    <div className="location-module">
      <h2>Módulo de Ubicación</h2>
      <p className="description">
        Este módulo permite verificar si estás dentro de un rango de 5 metros de una ubicación guardada.
      </p>

      <div className="buttons-container">
        <button onClick={obtenerUbicacion} disabled={cargando} className="btn-primary">
          {cargando ? 'Obteniendo...' : 'Obtener Ubicación Actual'}
        </button>

        <button
          onClick={guardarUbicacion}
          disabled={!ubicacionActual || cargando}
          className="btn-secondary"
        >
          Guardar Ubicación de Referencia
        </button>

        <button
          onClick={compararUbicaciones}
          disabled={!ubicacionGuardada || cargando}
          className="btn-success"
        >
          Comparar con Ubicación Guardada
        </button>

        <button onClick={limpiarDatos} className="btn-danger">
          Limpiar Datos
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Mapa Interactivo */}
      <MapView 
        ubicacionActual={ubicacionActual}
        ubicacionGuardada={ubicacionGuardada}
        resultado={resultado}
      />

      {ubicacionActual && (
        <div className="info-card">
          <h3>📍 Ubicación Actual</h3>
          <p><strong>Latitud:</strong> {ubicacionActual.latitude.toFixed(6)}</p>
          <p><strong>Longitud:</strong> {ubicacionActual.longitude.toFixed(6)}</p>
          <p><strong>Precisión:</strong> ±{ubicacionActual.accuracy.toFixed(2)} metros</p>
        </div>
      )}

      {ubicacionGuardada && (
        <div className="info-card">
          <h3>💾 Ubicación Guardada (Referencia)</h3>
          <p><strong>Latitud:</strong> {ubicacionGuardada.latitude.toFixed(6)}</p>
          <p><strong>Longitud:</strong> {ubicacionGuardada.longitude.toFixed(6)}</p>
        </div>
      )}

      {resultado && (
        <div className={`alert ${resultado.dentroDelRango ? 'alert-success' : 'alert-warning'}`}>
          <h3>📊 Resultado de la Comparación</h3>
          <p className="distance">
            <strong>Distancia:</strong> {resultado.distancia} metros
          </p>
          <p className="status">
            {resultado.dentroDelRango ? (
              <>
                ✅ <strong>DENTRO DEL RANGO</strong> - Estás a menos de 5 metros de la ubicación guardada
              </>
            ) : (
              <>
                ❌ <strong>FUERA DEL RANGO</strong> - Estás a más de 5 metros de la ubicación guardada
              </>
            )}
          </p>
        </div>
      )}

      <div className="instructions">
        <h4>📋 Instrucciones de uso:</h4>
        <ol>
          <li>Haz clic en "Obtener Ubicación Actual" para capturar tu posición</li>
          <li>Haz clic en "Guardar Ubicación de Referencia" para establecer el punto de comparación</li>
          <li>Muévete a otra ubicación</li>
          <li>Haz clic en "Comparar con Ubicación Guardada" para verificar la distancia</li>
          <li>El sistema te dirá si estás dentro de los 5 metros de rango permitido</li>
        </ol>
      </div>
    </div>
  );
}

export default LocationModule;
