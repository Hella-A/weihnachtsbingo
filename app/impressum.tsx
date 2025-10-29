import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ImpressumScreen() {
  const router = useRouter();

  const points = [
    "Idee für das Weihnachtsmarktbingo: Alessa",
    "Idee für die Weihnachtsbingo-App: Konni",
    "Coding: Alessa (mit etwas Support von ChatGPT)",
    "Idee für die Kamera und Cheerleading: Juliane",
    "Weihnachtsmarktbingo 2024 zu einer legendären Aktivität gemacht: Amandine, Christi, Ele, Flo, Heiner, Janik, Juliane, Kim, Lea, Lena, Lisa Britta, Romana, Sina, Stephan, Torsten",
    "Vielen Dank, dass ihr bei der Premiere so mega mitgezogen habt - 2025 wird noch fantastischer!",
    "PS: Wenn ihr Ideen zur Monetarisierung habt, sagt Bescheid. Zum Dank gibt es entweder eine Einmalzahlung oder Tantieme... je nachdem wie sehr ihr an das Projekt glaubt."
  ];

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Impressum</Text>

          <View style={styles.pointsContainer}>
            {points.map((point, index) => (
              <View key={index} style={styles.pointItem}>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.pointText}>{point}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Zurück</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  backgroundImage: { resizeMode: 'cover' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 61, 46, 0.7)',
    padding: 20,
  },
  scrollContent: { paddingBottom: 30 },
  title: { fontSize: 24, color: '#fcf0dbff', fontWeight: 'bold', textAlign: 'center', marginBottom: 30, marginTop: 20 },
  pointsContainer: { marginBottom: 20 },
  pointItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  star: { fontSize: 18, color: '#FFD700', marginRight: 8 },
  pointText: { flex: 1, fontSize: 16, color: '#fcf0dbff', lineHeight: 24 }, // 16 * 1.5 = 24
  button: {
    backgroundColor: '#8B0000',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 15
  },
  buttonText: {
    color: '#ffffffff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  }
});
