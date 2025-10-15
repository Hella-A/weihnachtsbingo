// app/photos.tsx
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function PhotosScreen() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  // Kamera-Berechtigungen
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Galerie-Berechtigungen
  const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      // Kamera
      const { status } = await requestPermission();
      setHasPermission(status === 'granted');

      // Galerie
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, [requestPermission]);

  // Foto aufnehmen
  const takePhoto = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync();
      setPhotoUri(result.uri);
    }
  };

  // Bild aus Galerie wählen
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // Berechtigungen prüfen
  if (hasPermission === null || hasGalleryPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Warte auf Berechtigungen...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>Keine Berechtigung für Kamera</Text>
      </View>
    );
  }

  if (!hasGalleryPermission) {
    return (
      <View style={styles.center}>
        <Text>Keine Berechtigung für Galerie</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Kamera */}
      <CameraView
        style={styles.camera}
        ref={cameraRef}
      />

      {/* Buttons absolut positioniert */}
      <View style={[styles.buttonContainer, { bottom: 150 }]}>
        <Button title="Foto aufnehmen" onPress={takePhoto} />
      </View>
      <View style={[styles.buttonContainer, { bottom: 90 }]}>
        <Button title="Galerie öffnen" onPress={pickImage} />
      </View>

      {/* Vorschaubild */}
      {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // verhindert weißen Balken
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: '60%',
  },
  preview: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
