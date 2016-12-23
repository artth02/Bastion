# Bastion
Realtime notification using Socket I/O
#
## Code Examples

## When in web application/cordova apps
### Connection
For connection to bastion API, you need firstly refer a socket-io.js file, like this:
``` javascript
    <script src="http://localhost:10008/socket.io/socket.io.js"></script>
```

Then in a javascript file, establish a connection to socket.io port, like this:

``` javascript
    //localhost:socket-io-port/bastion-namespace
    window.socket = io.connect('http://localhost:10008/bastion/notification');
```

After you connected at bastion, you'll recive a event called 'connect', it mean you have a successfull connection. [See more socket io events in this topic](http://stackoverflow.com/questions/24224287/list-of-socket-io-events) <br />
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

Only what you have to care about is, tell bastion what and who will recive your information. <br />

Bastion message is an object, and have two attributes:<br/>

**meta**: This attribute tell bastion some procedures about the reciving channel, like in example.<br/>
**notification**: Its what you want to send, bastion do not care about what you will send to him, he only transport that to other sockets.

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