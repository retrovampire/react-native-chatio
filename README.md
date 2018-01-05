# Chat.io for React Native

This is a React Native component to easily add [chat.io widget](https://www.chat.io/) to your application.

![Chat.io for React Native demo](https://raw.githubusercontent.com/venits/react-native-router-flux/master/chatio_demo.gif)

## Getting Started

### Prerequisites

To use chat.io in your React Native application, you will need the following:

#### Chat.io license ID

If you already have a chat.io account, get your **license_id** [here](https://app.chat.io/settings/channel-website).

![Chat.io license ID](https://raw.githubusercontent.com/livechat/react-chatio/master/chatio_license.png)

If you don't have an account, you can create one [here](https://www.chat.io/).

#### Client ID and Redirect URI

1. Log in to [chat.io Developers Console](https://console.chat.io).
2. Go to "Apps" and add a new application (select the "Web app (frontend, eg. JavaScript)" type).
3. When the app is created, go to Apps -> Authorization for your Client ID and Redirect URI.

![Chat.io Client ID and Redirect URI](https://github.com/livechat/react-native-chatio/blob/master/developer_console.png)

### Installation

To import chat.io for React Native, run the following command:

```javascript
npm install react-native-chatio --save
```

## User guide

### Start

Having imported chat.io for React Native, put it in your render method:

```javascript
import ChatIO from "react-native-chatio"

...

 <ChatIO
   clientId="client_id"
   redirectUri="redirect_uri"
   license={license_id}
 />
```

### Customization

#### Chat bubble

Chat bubble is the round icon (chat trigger) in the bottom right corner of the screen.

##### Position

You can control the position of the bubble with `bubbleLeft` and `bubbleTop` props:

```javascript
<ChatIO bubbleLeft={0} bubbleTop={0} license={your_license_id} />
```

##### Draggability

By default, the bubble component is draggable and movable. You can disable this option by sending `movable` prop with `false` value:

```javascript
<ChatIO movable={false} license={your_license_id} />
```

##### Color

You can change the color of the bubble by passing `bubbleColor` prop:

```javascript
<ChatIO bubbleColor='red' license={your_license_id} />
```

##### Custom bubble

If you don't like the default bubble, you can send `bubble` prop with your own component:

```javascript
<ChatIO license={your_license_id}
  bubble={
  <View style={{ width: 60, height: 60, backgroundColor: 'green' }} />
  }
/>
```

#### Chat window

This module uses [react-native-gifted-chat](https://github.com/FaridSafi/react-native-gifted-chat) for chat UI.

You can customise your chat widget by sending props to ChatIO component (like you would normally do with GiftedChat component).

For example, if you want `onPressAvatar` to show agent's details, you can do it like this:

```javascript
<ChatIO license={your_license_id}
  onPressAvatar={ info => console.warn(info) } />
```

You can find all props in the official [react-native-gifted-chat documentation](https://github.com/FaridSafi/react-native-gifted-chat).


### Methods

This module uses [Chat.io Customer SDK](https://www.chat.io/docs/customer-sdk). All methods are described [here](https://www.chat.io/docs/customer-sdk#methods).

To begin with, get your chat reference using `onLoaded` callback:


```javascript
<ChatIO 
  onLoaded={ref => this.chat = ref}
  onChatStarted={ chat_id => this.chatId = chat_id}
/>
```

With this reference you can, for example, get full chat history:

```javascript
const history = this.chat.getChatHistory(this.chatId);
```

Learn more about handling chat history [here](https://www.chat.io/docs/customer-sdk#getchathistory).

**Note:** Some methods require the current `chat_id` to work. You can get it with `onChatStarted` callback.

#### Available methods

|Name|Note|
|---|---|
| destroy | This method clears any held resources, removes all listeners and disconnects from the network. After using this method you won’t be able to use the destroyed SDK’s instance. |
| disconnect | Disconnecting user from current chat. |
| getChatHistory | This method facilitates loading more history events. |
| sendMessage | Sending message to current chat. More info [here](https://www.chat.io/docs/customer-sdk#sendmessage). |
| setSneakPeek | Sets the internal sneak peek value. It will be sent to the server only if the target chat is active and only once per 2 seconds (it’s throttled). |
| startChat | Starting chat.|
| updateCustomer | Updates info about customer. More info [here](https://www.chat.io/docs/customer-sdk#updatecustomer).|


### Events

You can listen for emitted events by subscribing to them (using `on` method) with your custom JavaScript function. 

All events are described [here](https://www.chat.io/docs/customer-sdk#events).

#### Available events

|Name|Note|
|---|---|
|connected | Executes when user connect to Chat.io. |
|connection_lost | Executes when user lost connection. |
|connection_restored | Executes when user's connection is restored. |
|disconnected | Executes when user disconnects from Chat.io. |
|user_joined_chat | Executes when joining chat. |
|user_left_chat | Executes when user left chat. |
|user_is_typing | Executes when user is typing. |
|user_stopped_typing | Executes when user stopped typing.  |


## Support
If you need any help, you can chat with us [here](https://www.chat.io/live-chat-guide/).

I hope you will find this module useful. Happy coding!
