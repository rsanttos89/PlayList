import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';

interface AudioFile {
  id: string;
  uri: string;
  filename: string;
}

const App: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const audioAssets = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.audio,
        });
        setAudioFiles(audioAssets.assets as AudioFile[]);
      } else {
        alert('Permission to access media library is required!');
      }
    })();

    // Configurações para áudio em segundo plano
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      // interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      // interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      allowsRecordingIOS: false,
    });

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playSound = async (index: number) => {
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioFiles[index].uri },
      { shouldPlay: true }
    );
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        setIsPlaying(status.isPlaying);
      }
    });
    setSound(newSound);
    setCurrentIndex(index);
  };

  const togglePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setCurrentIndex(null);
    }
  };

  const playNext = () => {
    if (currentIndex !== null && currentIndex < audioFiles.length - 1) {
      playSound(currentIndex + 1);
    }
  };

  const playPrevious = () => {
    if (currentIndex !== null && currentIndex > 0) {
      playSound(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Áudios</Text>
      <FlatList
        data={audioFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => playSound(index)}
          >
            <Text>{item.filename}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.controls}>
        <Button title="Anterior" onPress={playPrevious} disabled={currentIndex === null || currentIndex === 0} />
        <Button title={isPlaying ? "Pausar" : "Play"} onPress={togglePlayPause} disabled={currentIndex === null} />
        <Button title="Próximo" onPress={playNext} disabled={currentIndex === null || currentIndex === audioFiles.length - 1} />
        <Button title="Parar" onPress={stopSound} disabled={currentIndex === null} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default App;