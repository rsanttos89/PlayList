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