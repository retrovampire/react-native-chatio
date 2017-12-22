import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, Image, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { AuthWebView } from '@livechat/chat.io-customer-auth'
import { init } from '@livechat/chat.io-customer-sdk'
import ChatBubble from './ChatBubble/ChatBubble';
import Chat from './Chat/Chat';

const chatIcon = require('../assets/chat.png');

const { height, width } = Dimensions.get('window');

export default class ChatIO extends Component {
  constructor(props) {
    super(props);
    this.defineStyles();
    this.state = {
      isChatOn: false,
      isConnected: false,
      bubble: props.bubble ? props.bubble : (
        <View style={this.styles.bubbleStyle}>
          <Image source={chatIcon} style={this.styles.icon} />
        </View>
      ),
    };

    if (!GLOBAL.customerSDK) {
      GLOBAL.customerSDK = init({
        license: props.license,
        clientId: props.clientId,
        redirectUri: props.redirectUri,
      });
    }
    GLOBAL.customerSDK.on('connected', () => {
      this.setState({ isConnected: true });
      props.onLoaded(GLOBAL.customerSDK);
    });
  }

  defineStyles() {
    this.styles = StyleSheet.create({
      bubbleStyle: {
        width: width / 5,
        height: width / 5,
        backgroundColor: this.props.bubbleColor,
        borderRadius: width / 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      icon: {
        width: width / 7, height: width / 7,
      },
      container: {
        position: 'absolute',
      },
    });
  }

  openChat = () => {
    if (this.state.isConnected) {
      this.chat.startChat();
      this.setState({ isChatOn: true });
    } else {
      console.warn('Connection with Chat.io failed. Please check your implementation.');
    }
  };

  closeChat = () => {
    this.setState({ isChatOn: false });
  };

  getChatId = (id) => {
    this.props.onChatStarted(id);
  };

  render() {
    return (
      <View style={this.styles.container}>
        <AuthWebView />
        {this.state.isConnected ? <ChatBubble
          left={this.props.bubbleLeft}
          top={this.props.bubbleTop}
          openChat={this.openChat}
          bubble={this.state.bubble}
          disabled={this.props.movable}
        /> : null}
        <Chat
          {...this.props}
          isChatOn={this.state.isChatOn}
          closeChat={this.closeChat}
          returnChatId={this.getChatId}
          ref={(ref) => { this.chat = ref; }}
        />
      </View>
    );
  }
}

ChatIO.propTypes = {
  license: PropTypes.number.isRequired,
  clientId: PropTypes.string.isRequired,
  redirectUri: PropTypes.string.isRequired,
  movable: PropTypes.bool,
  bubble: PropTypes.element,
  bubbleColor: PropTypes.string,
  bubbleLeft: PropTypes.number,
  bubbleTop: PropTypes.number,
  chatTitle: PropTypes.string,
  greeting: PropTypes.string,
  noAgents: PropTypes.string,
  onLoaded: PropTypes.func,
  onChatStarted: PropTypes.func,
};

ChatIO.defaultProps = {
  bubbleColor: '#2196F3',
  onLoaded: () => {},
  onChatStarted: () => {},
  movable: true,
  bubbleLeft: width - (width / 5) - (width / 50),
  bubbleTop: Platform.OS === 'ios' ? height - (width / 5) - (width / 50) : height - (width / 5) - (width / 13),
  chatTitle: 'Chat with us!',
  greeting: 'Welcome to Chat.io!\nHow may We help you?',
  noAgents: 'Our agents are not available right now.',
};
