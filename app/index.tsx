import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [checkedCount, setCheckedCount] = useState(0);

  const fields = [
    "Schokoladenmuseum",
    "Dom",
    "Pyramide",
    "Stadtgarten",
    "Ehrenfeld (z.B. Herbrands, Bumann)",
    "Rudolfplatz",
    "Neumarkt",
    "Heumarkt",
    "Altermarkt",
    "Bonusmarkt der Wahl"
  ];

  // Lade gespeicherte Haken
  useEffect(() => {
    AsyncStorage.getItem('bingoState').then(data => {
      if (data) {
        const checked = JSON.parse(data);
        setCheckedCount(checked.length);
      }
    });
  }, []);

  const progress = Math.floor((checkedCount / fields.length) * 10);

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Willkommen zum Weihnachtsmarktbingo 2025!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/regeln')}
        >
          <Text style={styles.buttonText}>Sinnvolle und wohlüberlegte Regeln</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/bingo')}
        >
          <Text style={styles.buttonText}>Jetzt geht's looos: Zum Bingo</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Viel Spaß und eine fantastische Adventszeit!</Text>

        {/* Sterne-Fortschritt unten */}
        <Text style={styles.stars}>
          {"⭐".repeat(progress)}
          {"☆".repeat(10 - progress)}
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(11, 61, 46, 0.7)',
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  stars: { fontSize: 30, textAlign: 'center', marginTop: 30, color: '#FFD700' },
  title: { fontSize: 30, color: '#FFD700', fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  subtitle: { fontSize: 25, color: '#FFD700', textAlign: 'center', marginBottom: 30, marginTop: 20 },
  button: {
    backgroundColor: '#8B0000', 
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 10
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center'
  }
});
