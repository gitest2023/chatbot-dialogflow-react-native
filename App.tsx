/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import { DialogFlowConfig } from './env';

function App(): JSX.Element {

  const [state, setState] = useState({
    messages: [],
    id: 1,
    name: '',
  });

  const BOT = {
    _id: 1,
    name: 'Bot',
    avatar: ''
  };

  useEffect(() => {
    Dialogflow_V2.setConfiguration(
      DialogFlowConfig.client_email,
      DialogFlowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      DialogFlowConfig.project_id
    );
  }, []);

  const sendBotResponse = (text: string) => {
    let message = {
      _id: state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT
    };
    setState({
      ...state,
      messages: GiftedChat.append(state.messages, [message]),
    })
  };

  const handleGoogleResponse = (result: object) => {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    sendBotResponse(text);
  };

  const onSend = (messages = []) => {
    setState({
      ...state,
      messages: GiftedChat.append(state.messages, messages)
    });
    let message = messages[0].text;
    Dialogflow_V2.requestQuery(
      message,
      (result: object) => handleGoogleResponse(result),
      error => console.log(error)
    );
  };

  const onQuickReply = (quickReply = []) => {
    setState({
      ...state,
      messages: GiftedChat.append(state.messages, quickReply)
    });
    let message = quickReply[0].value;
    Dialogflow_V2.requestQuery(
      message,
      result => handleGoogleResponse(result),
      error => console.log(error)
    );
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <GiftedChat
          messages={state.messages}
          onSend={messages => onSend(messages)}
          onQuickReply={quickReply => onQuickReply(quickReply)}
          user={{ _id: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
