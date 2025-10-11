import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function BingoScreen() {
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

  // Lade gespeicherte Haken
  useEffect(() => {
    AsyncStorage.getItem('bingoState').then(data => {
      if (data) setChecked(JSON.parse(data));
    });
  }, []);

  // Speichere Haken bei Änderung
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

  const getIcon = (name: string) => {
    switch (name) {
      case "Schokoladenmuseum": return "candycane";
      case "Dom": return "church";
      case "Pyramide": return "fan";
      case "Stadtgarten": return "tree";
      case "Ehrenfeld (z.B. Herbrands, Bumann)": return "factory";
      case "Rudolfplatz": return "bat";
      case "Neumarkt": return "pine-tree";
      case "Heumarkt": return "candle";
      case "Altermarkt": return "gift";
      case "Bonusmarkt der Wahl": return "star";
      default: return "star";
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Weihnachtsmarktbingo</Text>

        {/* Sterne-Fortschritt */}
        <Text style={styles.stars}>
          {"⭐".repeat(progress)}
          {"☆".repeat(10 - progress)}
        </Text>

        {/* Bingokarte */}
        <FlatList
          data={fields}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isChecked = checked.includes(item);

            return (
              <TouchableOpacity
                style={[styles.card, isChecked && styles.cardChecked]}
                onPress={() => toggleField(item)}
              >
                <Icon 
                  name={getIcon(item)} 
                  size={24} 
                  color={isChecked ? '#0B3D2E' : '#FFD700'} 
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={[
                    styles.cardText,
                    isChecked && styles.cardTextChecked
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(11, 61, 46, 0.7)',
    padding: 20 
  },
  title: { fontSize: 29, color: '#fcf0dbff', fontWeight: 'bold', textAlign: 'center', marginBottom: 15, marginTop: 20 },
  stars: { fontSize: 27, textAlign: 'center', marginBottom: 25, color: '#FFD700' },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#8B0000',
    padding: 15, 
    borderRadius: 10, 
    marginVertical: 5 
  },
  cardChecked: { backgroundColor: '#fcf0dbff' }, // Hintergrund Gold
  cardText: { color: '#fcf0dbff', fontWeight: 'bold', fontSize: 16 },
  cardTextChecked: { 
    color: '#0B3D2E', // Schriftfarbe Dunkelgrün
    textDecorationLine: 'line-through' // Text durchgestrichen
  }
});
