import React, { useState, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { FontAwesome5, FontAwesome, AntDesign, SimpleLineIcons, Feather } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AudioFile {
  id: string;
  uri: string;
  filename: string;
}

const App: React.FC = () => {
  const animation = useRef(null);
  const insets = useSafeAreaInsets();
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRepeating, setIsRepeating] = useState<boolean>(false);

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

  const togglePlayPauseController = async () => {
    if (currentIndex === null && audioFiles.length > 0) {
      playSound(0);
    } else if (sound) {
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

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    const loadAudioFiles = async () => {
      setIsLoading(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const audioAssets = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.audio,
        });

        const mp3AudioFiles = audioAssets.assets.filter((asset: any) => {
          return asset.filename.endsWith('.mp3');
        });

        mp3AudioFiles.sort((a, b) => a.filename.localeCompare(b.filename));

        setAudioFiles(mp3AudioFiles as AudioFile[]);
      } else {
        alert('Permission to access media library is required!');
      }
      setIsLoading(false);
    };

    loadAudioFiles();

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

  useEffect(() => {
    if (position === duration) {
      playNext();
    }
  }, [position]);

  return (
    <LinearGradient
      colors={['#000', '#455086']}
      style={[styles.container, { paddingTop: insets.top }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {isPlaying ? (
        <View style={styles.boxIconMusic}>
          <LottieView
            autoPlay
            ref={animation}
            style={{
              width: 260,
              height: 100,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
            source={require('../assets/animation/music.json')}
          />
        </View>
      ) : (
        <View style={[styles.boxIconMusic, { borderWidth: 1, borderColor: '#fff', width: 150, height: 150 }]}>
          <SimpleLineIcons name="playlist" size={50} color="#fff" />
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : audioFiles.length === 0 ? (
        <Text style={styles.emptyListText}>Lista Vazia</Text>
      ) : (
        <FlatList
          data={audioFiles}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.item, { opacity: currentIndex === index && isPlaying ? 0.5 : 1 }]}
              onPress={() => {
                if (currentIndex === index) {
                  togglePlayPause();
                } else {
                  playSound(index);
                }
              }}
            >
              <View style={styles.boxMusic}>
                {currentIndex === index && isPlaying ? (
                  <FontAwesome5 name="pause" size={18} color="#fff" />
                ) : (
                  <FontAwesome5 name="play" size={18} color="#fff" />
                )}
              </View>
              <Text style={{ paddingHorizontal: 8, color: '#fff' }}>{item.filename}</Text>
            </TouchableOpacity>
          )}
          initialNumToRender={5}
          getItemLayout={(data, index) => ({ length: 50, offset: 50 * index, index })}
        />
      )}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.btns} onPress={playPrevious} disabled={currentIndex === null || currentIndex === 0}>
          <AntDesign name="stepbackward" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btns, { backgroundColor: '#ffffff50' }]} onPress={togglePlayPauseController} disabled={audioFiles.length === 0}>
          {isPlaying ? <FontAwesome5 name="pause" size={24} color="#fff" /> : <FontAwesome5 name="play" size={24} color="#fff" />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.btns} onPress={playNext} disabled={currentIndex === null || currentIndex === audioFiles.length - 1}>
          <AntDesign name="stepforward" size={24} color="#fff" />
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.btns} onPress={stopSound}>
          <FontAwesome name="stop" size={24} color="#fff" />
        </TouchableOpacity>  */}
      </View>

      <View style={styles.progressContainer}>
        <Text style={{ color: '#ffffff' }}>{currentIndex !== null && isPlaying ? audioFiles[currentIndex].filename : "..."}</Text>

        <Slider
          value={position}
          minimumValue={0}
          maximumValue={duration}
          onSlidingComplete={onSliderValueChange}
          minimumTrackTintColor="#00ffbf"
          maximumTrackTintColor="#ffffff"
          style={styles.slider}
        />

        <View style={{
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text style={{ color: '#ffffff' }}>{formatTime(position)} / {formatTime(duration)}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxIconMusic: {
    height: 150,
    maxHeight: 100,
    borderRadius: 8,
    marginVertical: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
  },
  emptyListText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 0.3,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#ffffff50',
    width: '100%',
  },
  boxMusic: {
    minHeight: 40,
    maxHeight: 40,
    minWidth: 40,
    maxWidth: 40,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 25
  },
  slider: {
    width: '100%',
  },
  controls: {
    minHeight: 75,
    maxHeight: 75,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  btns: {
    minHeight: 60,
    maxHeight: 60,
    maxWidth: 60,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60 / 2
  }
});

export default App;