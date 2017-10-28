# Bastion
A Realtime notification using Socket I/O

## Requirements

* Node.js (Tested)

## Running Bastion Api Service

Run the following commands:

    npm install
    npm start

### Available environment variables:

* **NODE_ENV**: development, production.
* **PORT**: HTTP Response port(**default: 10007**).
* **IOPORT**: Socket-IO response port(**default: 10008**).
* **CLUSTER**: Amount of clusters.

* **NODE_ENV** (`development`) - the running project environment
* **PORT** (`10007`) - the port that Bastion API runs
* **IOPORT** (`10008`) - the port that socket-IO runs
* **CLUSTER** - the amount of serving processes - If set, enables multi-core server manager.

## Code Examples

## When in web applications or cordova apps

### Retrieving a connection
In order to connect to Bastion API, refers to the `socket-io.js` file, like the example below:

``` javascript
<script src="http://bastionHost:10008/socket.io/socket.io.js"></script>
```
**NOTE:** *It will always be the path above, unless you change bastion code.*

Then, in a javascript file, establish a connection to bastion socket.io port, like the example below:

``` javascript
// localhost:socket-io-port/bastion-namespace
window.socket = io.connect('http://bastionHost:10008/bastion/notification')
```

After connecting to Bastion, you'll receive an event called 'connect', it means you have connected successfully. [Click here to see more socket.io events](http://stackoverflow.com/questions/24224287/list-of-socket-io-events).

Now, you can create a listener:

``` javascript
socket.on('connect', () => {
  // add your code here
})
```

### Joining

Joining a channel emit 'bastion-join' event. See the example below:

``` javascript
// Event upon a successful connection
socket.on('connect', () => {
  // connected, now signing up to receive messages for this room
  socket.emit('bastion-join', {
    customId: id
  },'channel-name')
})
```

After this you are in a channel, let's message!

### Messaging

The only thing you have to care about, is to tell bastion what and who will receive your information.

Bastion message is an object, and have two attributes:

**meta**: This attribute tell bastion some procedures about the receiving channel, like you'll see below.
**notification**: It's what you want to send, bastion do not care about what you will send to him, he only transports that to other sockets.
This attribute can be an array, object, string, int, float... Whatever you want, he really does not care.

``` javascript
{
    meta: {
        to: 'socket-io-custom-id' // it says bastion who in the receiving channel that will take the notification attribute value
    },
    notification: {} // let this attribute value to your imagination
}
```

When we need to send a information to other sockets, bastion provide us two ways to do it:

**broadcasting and emitting**

**bastion-broadcast-notification**: It says bastion to send the message to all sockets in a channel but not to the sender.

**bastion-emit-notification**: It says bastion to send the message to all sockets in a channel, even to the sender.

``` javascript
// broadcast
socket.emit('bastion-broadcast-notification', message, 'receiving channel')

// emit
socket.emit('bastion-emit-notification', message, 'receiving channel')
```

### Receiving messages from Bastion
Since you emit ``` bastion-broadcast-notification ``` or ``` bastion-emit-notification ```, bastion will reply you with broadcasting or emitting ```bastion-notification``` event.

You can handle bastion responses by implementing this code:

 ``` javascript
socket.on('bastion-notification', (notification) => {
  // add your code here
})
 ```

Bastion will put out your data passed in the ``` notification``` param, he won't matter if you pass your data through socket-io event or in the body of a HTTP POST.
Both of them will fire the ```bastion-notification``` event.

## HTTP POST Request
Bastion also provide us a HTTP POST method, that send your message to any of its channels.

See the example below:

**URL**: http://localhost:10007/bastion/api/notification

**METHOD**: POST

**NOTE**: "http://localhost:10007/" IS NOT the Bastion socket.io port, it's Bastion API port and `bastion/api/notification` is the path for sending your messages.

The object that Bastion expects us to send in the request body is (**THE SAME STRUCTURE THAT "MESSAGING" SECTION**):

``` javascript
{
  "meta": {
    "channels": ["index","channel1"] // array of channels that will receive your message.
  },
  "notification": {} // let this attribute value to your imagination.
}
```

### Bastion responses

### Success
**Status Code:** 200 - OK

**Request Body:**

``` javascript
{}
```

### Errors
Bastion have a default response when something goes wrong, like the example below:

**Request Body:**

``` javascript
{
  "developerMessage": "A operação solicitada não foi encontrada",
  "userMessageTranslated": "Não foi possivel concluir a operação solicitada",
  "errorCode": 404,
  "moreInfo": {
    "developerMessage": "Recurso não encontrado",
    "message": "A operação solicitada não foi encontrada",
    "status": 404
  }
}
```
