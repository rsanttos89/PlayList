```markdown
# Playlist App

Um aplicativo simples de lista de áudios desenvolvido em React Native usando Expo.

## Funcionalidades

- Carrega e exibe uma lista de arquivos de áudio do dispositivo.
- Permite reproduzir, pausar, avançar e retroceder faixas de áudio.
- Exibe a duração e o progresso da faixa de áudio atual.
- Estilo da interface do usuário personalizado com gradientes e ícones animados.

## Instalação

1. Certifique-se de ter o Node.js instalado em seu computador.
2. Instale o Expo CLI globalmente executando o seguinte comando:

```bash
npm install -g expo-cli
```

3. Clone este repositório:

```bash
git clone https://github.com/rsanttos89/PlayList
```

4. Navegue até o diretório do projeto:

```bash
cd playlist-app
```

5. Instale as dependências do projeto:

```bash
npm install
```

## Uso

Para executar o aplicativo localmente, você pode usar o Expo CLI. Dentro do diretório do projeto, execute:

```bash
expo start
```

Isso iniciará o servidor de desenvolvimento do Expo e abrirá o Expo DevTools no seu navegador. Você pode usar o Expo Go no seu dispositivo móvel para digitalizar o código QR fornecido pelo Expo DevTools e visualizar o aplicativo em tempo real.

## Dependências Principais

- `react-native-safe-area-context`: Fornece informações sobre as áreas seguras na tela do dispositivo.
- `expo-media-library`: Biblioteca Expo para acessar e manipular arquivos de mídia no dispositivo.
- `expo-av`: Módulo Expo para reprodução de áudio e vídeo.
- `@react-native-community/slider`: Componente deslizante personalizável para React Native.
- `@expo/vector-icons`: Conjunto de ícones vetoriais personalizados para aplicativos Expo.
- `lottie-react-native`: Renderiza animações Lottie no React Native.
- `expo-linear-gradient`: Componente para criar gradientes lineares em aplicativos Expo.

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue para relatar bugs ou solicitar novas funcionalidades. Se deseja contribuir diretamente, faça um fork deste repositório, crie uma nova branch com suas alterações e abra um pull request.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

Claro! Vamos adicionar uma seção que explica cada função do código:

```markdown
## Funções

### playSound

```typescript
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
```

A função `playSound` é responsável por carregar e reproduzir o arquivo de áudio no índice especificado. Se houver um som atualmente em reprodução, ele é descarregado antes de carregar o novo som. Ele usa o `expo-av` para carregar o som e definir os status de reprodução.

### togglePlayPause

```typescript
const togglePlayPause = async () => {
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
```

A função `togglePlayPause` alterna entre reprodução e pausa do áudio. Se não houver áudio tocando atualmente e houver arquivos de áudio disponíveis, ela começa a reproduzir o primeiro áudio. Se houver áudio tocando, ele pausa ou retoma a reprodução com base no estado atual.

### stopSound

```typescript
const stopSound = async () => {
  if (sound) {
    await sound.stopAsync();
    setIsPlaying(false);
    setCurrentIndex(null);
    setPosition(0);
  }
};
```

A função `stopSound` para a reprodução do áudio atual e redefine o estado para o início.

### playNext

```typescript
const playNext = () => {
  if (currentIndex !== null && currentIndex < audioFiles.length - 1) {
    playSound(currentIndex + 1);
  }
};
```

A função `playNext` inicia a reprodução do próximo áudio na lista, se houver.

### playPrevious

```typescript
const playPrevious = () => {
  if (currentIndex !== null && currentIndex > 0) {
    playSound(currentIndex - 1);
  }
};
```

A função `playPrevious` inicia a reprodução do áudio anterior na lista, se houver.

### onSliderValueChange

```typescript
const onSliderValueChange = async (value: number) => {
  if (sound) {
    await sound.setPositionAsync(value);
  }
};
```

A função `onSliderValueChange` é chamada quando o usuário interage com o controle deslizante de progresso do áudio. Ela atualiza a posição de reprodução do áudio para o valor especificado.

### formatTime

```typescript
const formatTime = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
};
```

A função `formatTime` converte milissegundos em uma string no formato de tempo "minutos:segundos".

### useEffects

Os `useEffects` são ganchos de efeito do React que são usados para carregar os arquivos de áudio do dispositivo, configurar o modo de áudio e limpar o som quando o componente é desmontado.