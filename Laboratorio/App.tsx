/**
 * Aplicación de Lugares Turísticos
 * Laboratorio - Desarrollo de Aplicaciones Móviles II
 * 
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importar las pantallas

import HomeScreen from './src/screens/HomeScreen';
import PlaceDetailsScreen from './src/screens/PlaceDetailsScreen';

const Stack = createStackNavigator();

/**
 * Componente principal de la aplicación
 * Configura el tema, navegación y pantallas
 */
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#007AFF"
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false, // Ocultamos el header por defecto
            cardStyle: { backgroundColor: '#F5F5F5' },
            animationEnabled: true,
          }}
        >
          {/* Pantalla principal - Listado de lugares turísticos */}
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              title: 'Lugares Turísticos',
            }}
          />
          
          {/* Pantalla de detalles del lugar - PASO 2 COMPLETADO ✅ */}
          <Stack.Screen 
            name="PlaceDetails" 
            component={PlaceDetailsScreen}
            options={{
              title: 'Detalles del Lugar',
              headerShown: false, // Usamos header personalizado
              animationEnabled: true,
              cardStyleInterpolator: ({ current, layouts }) => {
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.width, 0],
                        }),
                      },
                    ],
                  },
                };
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;