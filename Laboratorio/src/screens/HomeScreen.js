import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import PlacesList from './PlacesList';

/**
 * HomeScreen - Pantalla principal de la aplicación
 * Muestra el listado de lugares turísticos
 */
const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lugares Turísticos</Text>
        <Text style={styles.headerSubtitle}>Barcelona</Text>
      </View>
      
      {/* Lista de lugares */}
      <PlacesList navigation={navigation} location="Barcelona" category="attraction" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});

export default HomeScreen;