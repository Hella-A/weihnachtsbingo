// app/photos.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PhotosScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [photos, setPhotos] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);

  // 🔹 Lade gespeicherte Fotos aus AsyncStorage
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('photos');
      if (stored) setPhotos(JSON.parse(stored));

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');

      const { status } = await requestPermission();
      if (status !== 'granted') await requestPermission();
    })();
  }, [requestPermission]);

  // 🔹 Foto aufnehmen
  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.8, base64: false });

      if (result?.uri) {
        await MediaLibrary.saveToLibraryAsync(result.uri); // Speichern im Gerät
        const newPhotos = [result.uri, ...photos];
        setPhotos(newPhotos);
        await AsyncStorage.setItem('photos', JSON.stringify(newPhotos));
        setIsCameraActive(false);
        setTimeout(() => setIsCameraActive(true), 1000); // Kamera neu starten
      }
    } catch (err) {
      console.error('Kamera-Fehler:', err);
    }
  };

  // 🔹 Bild aus Galerie wählen
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      const newPhotos = [result.assets[0].uri, ...photos];
      setPhotos(newPhotos);
      await AsyncStorage.setItem('photos', JSON.stringify(newPhotos));
    }
  };

  // 🔹 Einzelnes Foto löschen
  const deletePhoto = async (uri: string) => {
    Alert.alert('Foto löschen?', 'Willst du dieses Foto wirklich löschen?', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: async () => {
          const updated = photos.filter((p) => p !== uri);
          setPhotos(updated);
          await AsyncStorage.setItem('photos', JSON.stringify(updated));
        },
      },
    ]);
  };

  // 🔹 Berechtigungen prüfen
  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Kamera wird initialisiert...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Keine Berechtigung für Kamera</Text>
        <Button title="Berechtigung erteilen" onPress={requestPermission} />
      </View>
    );
  }

  if (hasGalleryPermission === false) {
    return (
      <View style={styles.center}>
        <Text>Keine Berechtigung für Galerie</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isCameraActive ? (
        <CameraView ref={cameraRef} style={styles.camera} facing="back">
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.mainButton} onPress={takePhoto}>
              <Text style={styles.buttonText}>📸 Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mainButton} onPress={pickImage}>
              <Text style={styles.buttonText}>🖼️ Galerie</Text>
            </TouchableOpacity>
          </View>

          {/* Zurück-Button */}
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setIsCameraActive(false);
                router.push('/');
              }}
            >
              <Text style={styles.backButtonText}>Zurück zur Startseite</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.galleryContainer}>
          <FlatList
            data={photos}
            numColumns={3}
            keyExtractor={(uri) => uri}
            renderItem={({ item }) => (
              <View style={styles.photoItem}>
                <TouchableOpacity onLongPress={() => deletePhoto(item)}>
                  <Image source={{ uri: item }} style={styles.thumbnail} />
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Zurück-Button auch hier */}
          <View style={styles.backButtonContainerGallery}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setIsCameraActive(false);
                setTimeout(() => router.back(), 200); // 200ms für clean unmount
              }}
            >
              <Text style={styles.backButtonText}>Zurück zur Startseite</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1, justifyContent: 'flex-end' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 80,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
  },
  mainButton: {
    backgroundColor: '#8B0000',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  buttonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButtonContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonContainerGallery: {
    alignItems: 'center',
    marginVertical: 20,
  },
  backButton: {
    backgroundColor: '#8B0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  galleryContainer: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 10,
  },
  photoItem: { flex: 1 / 3, margin: 2 },
  thumbnail: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
