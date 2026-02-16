import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebViewModal from '../components/WebViewModal';

/**
 * PlaceDetailsScreen - Pantalla de detalles de un lugar turístico
 * Muestra información completa: descripción, horarios, contacto, sitio web, etc.
 * 
 * @param {object} route - Parámetros de navegación
 * @param {object} navigation - Objeto de navegación
 */
const PlaceDetailsScreen = ({ route, navigation }) => {
  const { place } = route.params;
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');

  /**
   * Abre el sitio web dentro de la aplicación usando WebView
   */
  const handleOpenWebsite = (url) => {
    if (!url) {
      Alert.alert('Sin sitio web', 'Este lugar no tiene un sitio web disponible.');
      return;
    }

    // Asegurar que la URL tenga el protocolo
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }

    setWebViewUrl(formattedUrl);
    setWebViewVisible(true);
  };

  /**
   * Abre el sitio web en el navegador externo del dispositivo
   */
  const handleOpenInBrowser = async (url) => {
    if (!url) {
      Alert.alert('Sin sitio web', 'Este lugar no tiene un sitio web disponible.');
      return;
    }

    // Asegurar que la URL tenga el protocolo
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }

    try {
      const supported = await Linking.canOpenURL(formattedUrl);
      if (supported) {
        await Linking.openURL(formattedUrl);
      } else {
        Alert.alert('Error', 'No se puede abrir esta URL');
      }
    } catch (error) {
      console.error('Error al abrir URL:', error);
      Alert.alert('Error', 'No se pudo abrir el sitio web');
    }
  };

  /**
   * Realiza una llamada telefónica
   */
  const handleCallPhone = async (phone) => {
    if (!phone) {
      Alert.alert('Sin teléfono', 'Este lugar no tiene un teléfono disponible.');
      return;
    }

    const phoneUrl = `tel:${phone}`;
    try {
      const supported = await Linking.canOpenURL(phoneUrl);
      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Error', 'No se puede realizar llamadas en este dispositivo');
      }
    } catch (error) {
      console.error('Error al llamar:', error);
      Alert.alert('Error', 'No se pudo iniciar la llamada');
    }
  };

  /**
   * Abre el cliente de correo electrónico
   */
  const handleSendEmail = async (email) => {
    if (!email) {
      Alert.alert('Sin correo', 'Este lugar no tiene un correo electrónico disponible.');
      return;
    }

    const emailUrl = `mailto:${email}`;
    try {
      const supported = await Linking.canOpenURL(emailUrl);
      if (supported) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert('Error', 'No hay aplicación de correo configurada');
      }
    } catch (error) {
      console.error('Error al enviar email:', error);
      Alert.alert('Error', 'No se pudo abrir el cliente de correo');
    }
  };

  /**
   * Abre Google Maps con la ubicación del lugar
   */
  const handleOpenMap = async () => {
    if (!place.latitude || !place.longitude) {
      Alert.alert('Sin ubicación', 'Este lugar no tiene coordenadas disponibles.');
      return;
    }

    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${place.latitude},${place.longitude}`;
    const label = place.name || 'Lugar';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No se puede abrir el mapa');
      }
    } catch (error) {
      console.error('Error al abrir mapa:', error);
      Alert.alert('Error', 'No se pudo abrir el mapa');
    }
  };

  /**
   * Agregar a favoritos (se implementará en el paso 5)
   */
  const handleAddToFavorites = () => {
    Alert.alert('Próximamente', 'La función de favoritos se implementará en el Paso 5');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header personalizado */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles</Text>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleAddToFavorites}
        >
          <Text style={styles.favoriteIcon}>♡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagen del lugar */}
        {place.image_url ? (
          <Image 
            source={{ uri: place.image_url }} 
            style={styles.placeImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderIcon}>🏛️</Text>
          </View>
        )}

        {/* Contenido principal */}
        <View style={styles.content}>
          {/* Nombre del lugar */}
          <Text style={styles.placeName}>{place.name || 'Sin nombre'}</Text>

          {/* Rating y categoría */}
          <View style={styles.metaContainer}>
            {place.rating && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.ratingText}>{place.rating}</Text>
              </View>
            )}
            {place.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{place.category}</Text>
              </View>
            )}
          </View>

          {/* Sección: Descripción */}
          {place.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📝 Descripción</Text>
              <Text style={styles.descriptionText}>{place.description}</Text>
            </View>
          )}

          {/* Sección: Dirección */}
          {place.address && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📍 Dirección</Text>
              <Text style={styles.infoText}>{place.address}</Text>
              {(place.latitude && place.longitude) && (
                <TouchableOpacity 
                  style={styles.mapButton}
                  onPress={handleOpenMap}
                >
                  <Text style={styles.mapButtonText}>Ver en el mapa</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Sección: Horarios de apertura */}
          {place.opening_hours && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🕐 Horarios de apertura</Text>
              <Text style={styles.infoText}>{place.opening_hours}</Text>
            </View>
          )}

          {/* Sección: Contacto */}
          {(place.phone || place.email) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📞 Contacto</Text>
              
              {place.phone && (
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => handleCallPhone(place.phone)}
                >
                  <Text style={styles.contactIcon}>📱</Text>
                  <Text style={styles.contactText}>{place.phone}</Text>
                  <Text style={styles.contactAction}>Llamar ›</Text>
                </TouchableOpacity>
              )}

              {place.email && (
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => handleSendEmail(place.email)}
                >
                  <Text style={styles.contactIcon}>✉️</Text>
                  <Text style={styles.contactText}>{place.email}</Text>
                  <Text style={styles.contactAction}>Escribir ›</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Sección: Sitio web */}
          {place.website && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🌐 Sitio web</Text>
              <View style={styles.websiteContainer}>
                <TouchableOpacity 
                  style={styles.websiteButton}
                  onPress={() => handleOpenWebsite(place.website)}
                >
                  <Text style={styles.websiteButtonText}>Abrir en la app</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.websiteButton, styles.websiteButtonOutline]}
                  onPress={() => handleOpenInBrowser(place.website)}
                >
                  <Text style={styles.websiteButtonTextOutline}>Abrir en navegador</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.websiteUrl} numberOfLines={1}>
                {place.website}
              </Text>
            </View>
          )}

          {/* Sección: Precio (dato adicional 1) */}
          {place.price_level && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💰 Nivel de precios</Text>
              <Text style={styles.infoText}>
                {place.price_level === 1 && '$ (Económico)'}
                {place.price_level === 2 && '$$ (Moderado)'}
                {place.price_level === 3 && '$$$ (Costoso)'}
                {place.price_level === 4 && '$$$$ (Muy costoso)'}
              </Text>
            </View>
          )}

          {/* Sección: Tipo de lugar (dato adicional 2) */}
          {place.types && place.types.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏷️ Tipos</Text>
              <View style={styles.tagsContainer}>
                {place.types.slice(0, 5).map((type, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{type.replace(/_/g, ' ')}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Espacio al final */}
          <View style={{ height: 30 }} />
        </View>
      </ScrollView>

      {/* Modal WebView para mostrar sitio web dentro de la app */}
      <WebViewModal
        visible={webViewVisible}
        url={webViewUrl}
        onClose={() => setWebViewVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  favoriteButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  placeImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#E0E0E0',
  },
  placeholderImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 80,
  },
  content: {
    padding: 20,
  },
  placeName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  ratingIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  categoryBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: '#3A3A3C',
    lineHeight: 24,
  },
  infoText: {
    fontSize: 15,
    color: '#3A3A3C',
    lineHeight: 22,
  },
  mapButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  contactText: {
    flex: 1,
    fontSize: 15,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  contactAction: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  websiteContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  websiteButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  websiteButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  websiteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  websiteButtonTextOutline: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  websiteUrl: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 13,
    color: '#3A3A3C',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});

export default PlaceDetailsScreen;