import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RegelnScreen() {
  const router = useRouter();

  const rules = [
    "Ein Weihnachtsmarkt kann abgestempelt werden, wenn dort Umsatz gemacht wird, sprich Getränk, Essen oder Nippes gekauft wird.",
    "Der Besuch muss gemeinsam mit min. einer Person aus dieser Gruppe erfolgen. Man kann max. drei Märkte mit derselben Person besuchen.",
    "Der Besuch muss durch ein Foto oder eine Quittung belegt und in der WhatsApp Gruppe dokumentiert werden.",
    "Das Abhaken in dieser fantastischen, liebevoll in All-Nightern erstellten App ist optional, wird aber von der Coderin gerne gesehen.",
    "Der Spielzeitraum läuft vom 1. bis 23. Dezember.",
    "Wer als erstes alle Märkte abgehakt hat, hat gewonnen. Zu gewinnen gibt es Ehre, was aus Filz und der nächste Drink geht auf Alessa (muss aktiv eingefordert werden - klare Holschuld).",
    "Die jeweils führende Person darf das Whatsapp-Gruppenbild bestimmen.",
    "Und last but not least: es können max. 2 Weihnachtsmärkte pro Tag abgehakt werden. Wir wollen ja lange was vom Bingo haben (looking at you, Kim! ;-))."
  ];

  return (
    <ImageBackground
      source={require('../assets/background.png')} // Gleicher Hintergrund wie Index
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Regeln für das Weihnachtsmarktbingo</Text>

          <Text style={styles.intro}>
            Wie immer wird der Spielspaß durch sinnvolle, wohlüberlegte Regeln erst möglich gemacht. 
            Nach den Erfahrungen und Eskalationen des letzten Jahres, war ich so frei und habe die Regeln überarbeitet. 
            Dieses Mal geht es noch mehr um gemeinsame Weihnachtsmarktbesuche - vielleicht sogar in neuen Konstellationen (sorry an alle introvertierten Teilnehmer).
          </Text>

          <View style={styles.rulesContainer}>
            {rules.map((rule, index) => (
              <View key={index} style={styles.ruleItem}>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.ruleText}>{rule}</Text>
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
  background: { flex: 1, resizeMode: 'cover' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 61, 46, 0.7)', // leicht transparentes Tannengrün
    padding: 20
  },
  scrollContent: {
    paddingBottom: 30
  },
  title: { fontSize: 24, color: '#fcf0dbff', fontWeight: 'bold', textAlign: 'center', marginBottom: 15, marginTop: 15 },
  intro: { fontSize: 16, color: '#fcf0dbff', marginBottom: 20 },
  rulesContainer: { marginBottom: 20 },
  ruleItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  star: { fontSize: 18, color: '#FFD700', marginRight: 8 },
  ruleText: { flex: 1, fontSize: 16, color: '#fcf0dbff' },
  button: {
    backgroundColor: '#8B0000', // Rot
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignSelf: 'center'
  },
  buttonText: { color: '#ffffffff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }
});
