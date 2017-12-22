import React from 'react';
import { StyleSheet, Text, Dimensions, Platform } from 'react-native';
import { View } from 'react-native-animatable';
import PropTypes from 'prop-types';
import { GiftedChat } from 'react-native-gifted-chat';
import NavigationBar from './NavigationBar/NavigationBar';

const { height, width } = Dimensions.get('window');
const totalSize = num => (Math.sqrt((height * height) + (width * width)) * num) / 100;

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      onlineStatus: false,
      isChatOn: false,
      chatId: null,
      typingText: null,
    };
  }

  setListeners = () => {
    GLOBAL.customerSDK.on('new_event', this.handleNewMessage.bind(this));
    GLOBAL.customerSDK.on('user_is_typing', this.agentIsTyping.bind(this));
    GLOBAL.customerSDK.on('user_stopped_typing', this.agentStopsTyping.bind(this));
  };

  startChat = () => {
    if (!this.state.isChatOn) {
      GLOBAL.customerSDK.startChat()
        .then((chat) => {
          if (chat.users.length >= 2) {
            this.setListeners();
            this.props.returnChatId(chat.id);
            this.setState({ onlineStatus: true, isChatOn: true, chatId: chat.id });
          } else {
            this.setState({ onlineStatus: false, isChatOn: false, chatId: null });
          }
        })
        .catch((error) => {
          this.setState({ onlineStatus: false, isChatOn: false, chatId: null });
          console.warn(error);
        });
    }
  };

  handleNewMessage = (newMessage) => {
    if (newMessage.event.type === 'message') this.addMessage(newMessage.event);
  };

  addMessage = (message) => {
    if (message.id) {
      this.setState({
        typingText: null,
        messages: [{
          text: message.text,
          _id: message.id,
          createdAt: message.timestamp,
          user: { id: message.author },
        }, ...this.state.messages],
      });
    } else {
      this.setState({
        messages: [{
          text: message.text,
          _id: message._id,
          createdAt: message.createdAt,
          user: message.user,
        }, ...this.state.messages],
      });
    }
  };

  handleInputTextChange = (text) => {
    if (this.state.chatId) GLOBAL.customerSDK.setSneakPeek(this.state.chatId, text);
  };

  handleSend = (messages) => {
    GLOBAL.customerSDK.sendMessage(this.state.chatId, messages[0]);
    this.addMessage(messages[0]);
  };

  agentIsTyping = () => {
    if (!this.state.typingText) this.setState({ typingText: 'Agent is typing...' });
  };

  agentStopsTyping = () => {
    if (this.state.typingText) this.setState({ typingText: null });
  };

  closeChat = () => {
    this.chat.lightSpeedOut(500).then(() => {
      this.props.closeChat();
    });
  };

  renderFooter = () => {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  };

  render() {
    if (this.props.isChatOn) {
      return (
        <View
          animation="lightSpeedIn"
          style={styles.container}
          ref={(ref) => { this.chat = ref; }}
        >
          <NavigationBar chatTitle={this.props.chatTitle} closeChat={this.closeChat} />
          <Text style={styles.status}>
            { this.state.onlineStatus ? this.props.greeting : this.props.noAgents }
          </Text>
          <GiftedChat
            messages={this.state.messages}
            renderFooter={this.renderFooter}
            onSend={this.handleSend}
            renderAvatar={null}
            onInputTextChanged={this.handleInputTextChange}
            user={{
              _id: 1,
            }}
            {...this.props}
          />
        </View>
      );
    }
    return null;
  }
}

Chat.propTypes = {
  chatTitle: PropTypes.string.isRequired,
  closeChat: PropTypes.func.isRequired,
  isChatOn: PropTypes.bool.isRequired,
  greeting: PropTypes.string.isRequired,
  noAgents: PropTypes.string.isRequired,
  returnChatId: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  hide: {
    width: 0,
    height: 0,
    position: 'absolute',
  },
  container: {
    width,
    height: Platform.OS === 'ios' ? height : height - (height / 25),
    position: 'absolute',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  navigation: {
    flex: 1,
  },
  systemMessage: {
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
  status: {
    textAlign: 'center',
    fontSize: totalSize(2.1),
    fontWeight: '500',
    color: '#444',
    padding: 5,
  },
});
