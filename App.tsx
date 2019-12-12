import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Caption, Card, DefaultTheme, IconButton, Provider as PaperProvider, Searchbar, Subheading, Title} from 'react-native-paper';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import mockdata from './mockdata.json';
// import YouTube from 'react-native-youtube';
import YoutubePlayer from 'react-native-yt-player';
// import YoutubePlayer from 'youtubeplayer-react-native';

const API_KEY = '';
const MOCK_DATA = true;

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'tomato',
        accent: 'yellow',
    },
};

const parseSearchResults = result => {
    if (result && result.items && result.items.length) {
        const item = result.items[0];
        return {
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            channelTitle: item.snippet.channelTitle,
        };
    }

    return null;
};

const App = () => {
    const [searchTerm, setSearchTerm] = useState<string>(null);
    const [searchResult, setSearchResult] = useState(null);
    const [typingStopped, setTypingStopped] = useState<boolean>(true);
    const timer = useRef(null);

    const performSearch = async (term: string) => {
        let json;

        if (MOCK_DATA) {
            json = mockdata;
        } else {
            const result = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${term}&key=${API_KEY}`, {
                headers: {
                    Accept: 'application/json',
                },
            });
            json = await result.json();
        }

        setSearchResult(parseSearchResults(json));
    };

    useEffect(() => {
        if (searchTerm !== null && typingStopped === true) {
            performSearch(searchTerm);
        }
    }, [searchTerm, typingStopped]);

    return (
        <View style={styles.container}>
            <PaperProvider theme={theme}>
                <Card>
                    <Card.Title title="Squeaky Squirrel" />
                    <Card.Content>
                        <Searchbar
                            placeholder="Search"
                            value={searchTerm}
                            onKeyPress={() => {
                                clearTimeout(timer.current);
                                setTypingStopped(false);
                                timer.current = setTimeout(() => {
                                    setTypingStopped(true);
                                }, 1000);
                            }}
                            onChangeText={value => {
                                setSearchTerm(() => value);
                            }}
                        />
                    </Card.Content>
                    <Card.Actions>
                        <IconButton icon="play" size={20} color={Colors.red500} onPress={() => console.log('play pressed')} />
                        <IconButton icon="pause" size={20} color={Colors.red500} onPress={() => console.log('pause pressed')} />
                    </Card.Actions>
                </Card>
                {searchResult && (
                    <Card>
                        <Card.Content>
                            <YoutubePlayer
                                videoId="KVZ-P-ZI6W4" // The YouTube video ID
                                // play // control playback of video with true/false
                                // fullscreen // control whether the video should play in fullscreen or inline
                                loop // control whether the video should loop when ended
                                // onReady={e => this.setState({isReady: true})}
                                // onChangeState={e => this.setState({status: e.state})}
                                // onChangeQuality={e => this.setState({quality: e.quality})}
                                // onError={e => this.setState({error: e.error})}
                                style={{alignSelf: 'stretch', height: 300}}
                            />
                        </Card.Content>
                    </Card>
                )}
                {searchResult && (
                    <Card>
                        <Card.Content>
                            <>
                                <Title>{searchResult.title}</Title>
                                <Caption>{searchResult.description}</Caption>
                                <Subheading>{searchResult.channelTitle}</Subheading>
                            </>
                        </Card.Content>
                    </Card>
                )}
            </PaperProvider>
        </View>
    );
};

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#000',
        justifyContent: 'flex-start',
        padding: 15,
        width: '100%',
        height: '100%',
    },
});

export default App;
