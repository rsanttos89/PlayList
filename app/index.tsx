import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

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
  const [position, setPosition] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const loadAudioFiles = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
  
      if (status === 'granted') {
        const audioAssets = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.audio,
        });
  
        // Filtrar apenas arquivos .mp3
        const mp3AudioFiles = audioAssets.assets.filter((asset: any) => {
          return asset.filename.endsWith('.mp3');
        });
  
        // Ordenar os arquivos de áudio em ordem alfabética pelo nome do arquivo
        mp3AudioFiles.sort((a, b) => a.filename.localeCompare(b.filename));
  
        setAudioFiles(mp3AudioFiles as AudioFile[]);
      } else {
        alert('Permission to access media library is required!');
      }
    };
  
    loadAudioFiles();
  
    // Configurações para áudio em segundo plano
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
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
        setDuration(status.durationMillis || 0);
        setPosition(status.positionMillis || 0);
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
      setPosition(0);
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

  const onSliderValueChange = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  useEffect(() => {
    if (position === duration) {
      playNext();
    }
  }, [position]);

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
        initialNumToRender={5} // Renderiza apenas os 5 primeiros itens inicialmente
        getItemLayout={(data, index) => (
          { length: 50, offset: 50 * index, index } // Tamanho estimado de cada item
        )}
      />
      {currentIndex !== null && (
        <View style={styles.progressContainer}>
          <Slider
            value={position}
            minimumValue={0}
            maximumValue={duration}
            onSlidingComplete={onSliderValueChange}
            style={styles.slider}
          />
          <Text>{`${Math.floor(position / 1000)} / ${Math.floor(duration / 1000)} sec`}</Text>
        </View>
      )}
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
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  slider: {
    width: '90%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default App;