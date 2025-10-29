import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BingoScreen() {
  const router = useRouter();
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

  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('bingoState').then(data => {
      if (data) setChecked(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('bingoState', JSON.stringify(checked));
  }, [checked]);

  const toggleField = (item: string) => {
    if (checked.includes(item)) {
      setChecked(checked.filter(x => x !== item));
    } else {
      setChecked([...checked, item]);
    }
  };

  const progress = Math.floor((checked.length / fields.length) * 10);

  const getImage = (name: string) => {
    switch (name) {
      case "Schokoladenmuseum": return require('../assets/images/schokoladenmuseum.jpg');
      case "Dom": return require('../assets/images/dom.jpg');
      case "Pyramide": return require('../assets/images/pyramide.jpg');
      case "Stadtgarten": return require('../assets/images/stadtgarten.jpg');
      case "Ehrenfeld (z.B. Herbrands, Bumann)": return require('../assets/images/ehrenfeld.jpg');
      case "Rudolfplatz": return require('../assets/images/rudolfplatz.jpg');
      case "Neumarkt": return require('../assets/images/neumarkt.jpg');
      case "Heumarkt": return require('../assets/images/heumarkt.jpg');
      case "Altermarkt": return require('../assets/images/altermarkt.jpg');
      case "Bonusmarkt der Wahl": return require('../assets/images/bonusmarkt.jpg');
      default: return require('../assets/images/placeholder.jpg');
    }
  };

  // Dynamische Kartenbreite und -höhe
  const screenWidth = Dimensions.get('window').width;
  const cardSpacing = 8; // Abstand zwischen den Karten
  const numColumns = 2;
  const cardWidth = (screenWidth - 40 - cardSpacing * (numColumns - 1)) / numColumns; 
  const cardHeight = cardWidth * 3 / 4; // 4:3 Verhältnis

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Weihnachtsmarktbingo</Text>

        <Text style={styles.stars}>
          {"⭐".repeat(progress)}
          {"☆".repeat(10 - progress)}
        </Text>

        <FlatList
          data={fields}
          keyExtractor={(item) => item}
          numColumns={numColumns}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
          contentContainerStyle={{ paddingBottom: 20 }} // Platz für Button unten
          renderItem={({ item }) => {
            const isChecked = checked.includes(item);
            return (
              <TouchableOpacity
                style={[styles.card, { width: cardWidth, height: cardHeight }, isChecked && styles.cardChecked]}
                onPress={() => toggleField(item)}
              >
                <ImageBackground
                  source={getImage(item)}
                  style={styles.cardImage}
                  imageStyle={{ borderRadius: 10 }}
                >
                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.cardText,
                        isChecked && styles.cardTextChecked
                      ]}
                    >
                      {item}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.back()}
            >
              <Text style={styles.buttonText}>Zurück</Text>
            </TouchableOpacity>
          }
        />
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
  title: {
    fontSize: 29,
    color: '#fcf0dbff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 20,
  },
  stars: {
    fontSize: 27,
    textAlign: 'center',
    marginBottom: 25,
    color: '#FFD700',
  },
  card: {
    backgroundColor: '#8B0000',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardChecked: {
    opacity: 0.4,
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  textContainer: {
    backgroundColor: 'rgba(11, 61, 46, 0.6)',
    paddingVertical: 8,
  },
  cardText: {
    color: '#fcf0dbff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  cardTextChecked: {
    color: '#FFD700',
    textDecorationLine: 'line-through',
  },
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
