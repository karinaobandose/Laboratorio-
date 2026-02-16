import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import axios from 'axios';

/**
 * Componente PlacesList
 * Muestra una lista de lugares turísticos con sus detalles básicos
 * @param {function} onSelectPlace - Callback cuando se selecciona un lugar
 */
const PlacesList = ({ navigation, location = 'Barcelona', category = 'attraction' }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Función para cargar los lugares desde el API
   */
  useEffect(() => {
    fetchPlaces();
  }, [location, category]);

  /**
   * Consume el API REST para obtener lugares turísticos
   */
  const fetchPlaces = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `http://wafi.iit.cnr.it/openervm/api/getPlaces?location=${location}&category=${category}`;
      console.log('Fetching places from:', url);
      
      const response = await axios.get(url);
      
      if (response.data && response.data.places) {
        setPlaces(response.data.places);
      } else {
        setPlaces([]);
      }
    } catch (err) {
      console.error('Error fetching places:', err);
      setError('Error al cargar los lugares. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renderiza cada item de la lista
   */
  const renderPlaceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.placeCard}
      onPress={() => navigation.navigate('PlaceDetails', { place: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* Imagen del lugar (si existe) */}
        {item.image_url && (
          <Image
            source={{ uri: item.image_url }}
            style={styles.placeImage}
            resizeMode="cover"
          />
        )}
        
        {/* Información del lugar */}
        <View style={styles.placeInfo}>
          {/* Nombre del lugar */}
          <Text style={styles.placeName} numberOfLines={2}>
            {item.name || 'Sin nombre'}
          </Text>
          
          {/* Descripción */}
          {item.description && (
            <Text style={styles.placeDescription} numberOfLines={3}>
              {item.description}
            </Text>
          )}
          
          {/* Dirección */}
          {item.address && (
            <View style={styles.addressContainer}>
              <Text style={styles.addressIcon}>📍</Text>
              <Text style={styles.placeAddress} numberOfLines={2}>
                {item.address}
              </Text>
            </View>
          )}
          
          {/* Rating (si existe) */}
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingIcon}>⭐</Text>
              <Text style={styles.ratingText}>
                {item.rating} / 5.0
              </Text>
            </View>
          )}
        </View>
        
        {/* Indicador de ver más */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  /**
   * Componente para lista vacía
   */
  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🏛️</Text>
      <Text style={styles.emptyText}>
        No se encontraron lugares turísticos
      </Text>
      <Text style={styles.emptySubtext}>
        Intenta con otra búsqueda
      </Text>
    </View>
  );

  /**
   * Renderizado condicional según el estado
   */
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando lugares...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPlaces}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={places}
        renderItem={renderPlaceItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={EmptyListComponent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  placeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  placeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  placeInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  placeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  placeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  addressIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  placeAddress: {
    fontSize: 13,
    color: '#8E8E93',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 13,
    color: '#FF9500',
    fontWeight: '600',
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
  arrow: {
    fontSize: 32,
    color: '#C7C7CC',
    fontWeight: '300',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
  },
});

export default PlacesList;