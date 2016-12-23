# Bastion
Realtime notification using Socket I/O
#
## Code Examples

## When in web application/cordova apps
### Connection
For connection to bastion API, you first need to refer a socket-io.js file, like this:
``` javascript
    <script src="http://localhost:10008/socket.io/socket.io.js"></script>
```

Then in a javascript file, establish a connection to socket.io port, like this:

``` javascript
    //localhost:socket-io-port/bastion-namespace
    window.socket = io.connect('http://localhost:10008/bastion/notification');
```

After you connected at bastion, you'll recive a event called 'connect', it means you have connected successfully. [See more socket io events in this topic](http://stackoverflow.com/questions/24224287/list-of-socket-io-events) <br />
You can implement an event listener as it:

``` javascript

    socket.on('connect', function() {
        //your code
    });

```

### Joinning

For joinning a channel emit 'bastion-join' event.

``` javascript
    //Event upon a successfull Connection
    socket.on('connect', function() {
        // Connected, let's sign-up for to receive messages for this room
        socket.emit('bastion-join', {
                customId: id
        },'channel-name');
    });
```

After this you are in a channel, let's message!

#
### Messaging

The only thing you have to care about, is to tell bastion what and who will receive your information. <br />

Bastion message is an object, and have two attributes:<br/>

**meta**: This attribute tell bastion some procedures about the receiving channel, like in the example.<br/>
**notification**: Its what you want to send, bastion do not care about what you will send to him, he only transports that to other sockets.

``` javascript
    {
        meta:{
            to: 'socket-io-custom-id'// it says bastion who in the receiving channel will receive the notification attribute value
        },
        notification: {}// let this attribute value to your imagination
    }
```

When we need to send a information to other sockets, bastion provide us two ways to do it: <br />

**broadcasting & emiting**<br/>

**bastion-broadcast-notification**: It says bastion to send the message to all sockets in a channel but not to sender. <br/>
**bastion-emit-notification**: It says bastion to send the message to all sockets in a channel even to sender.

``` javascript
    //Broadcast
    socket.emit('bastion-broadcast-notification',message, 'receiving channel');

    //Emit
    socket.emit('bastion-emit-notification',message, 'receiving channel');

```
#
## Wtih HTTP-POST Request
Bastion also provide us a http post method, that send your message to any of his channels.<br/>
See this example above:<br/>

**URL**: http://localhost:10007/bastion/api/notification<br/>
**METHOD**: POST<br/>

**Notes**: <br/>
"http://localhost:10007/" this is not bastion socket io port, this is bastion API port(a node server, like a normal api). <br/>
"bastion/api/notification" this is the route for your messages. <br/>


The object that Bastion expected us to send to him at the request body is(**THE SAME STRUCTURE THAT SOCKET VERSION**):

``` javascript
    {
        "meta": {
            "channels": ["index","channel1"] //Array of channels that will receive your message.
        },
        "notification": {} // let this attribute value to your imagination too.
    }
```

### Bastion Responses

### Success: <br/>
**Status Code** : 200 - OK

**Request Body**:
``` javascript
    {}
```

### Errors:
Bastion have a default response when somthing gets wrong, as this example:

**Request Body**:
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
#