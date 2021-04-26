'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');
var stickerButton = document.querySelector('#stickers-btn');
var stickerClose = document.querySelector('#close-btn');

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787',
    '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af',
    '#FF9800', '#39bbb0'
];


function connect(event) {

    // получение введенного имени из формы
    username = document.querySelector('#name').value.trim();

    if(username) {

        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

    // создание экзмепляра для подключения к веб сокетам на сервере
        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}


function onConnected() {

    // подписка клиента на url /chat/messages
    // таким образом он будет слушать все, что придет по этому адресу без перезагрузки страницы
    stompClient.subscribe('/chat/messaging', onMessageReceived);

    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    connectingElement.classList.add('hidden');
}


function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}


function sendMessage(event) {

    var messageContent = messageInput.value.trim();

    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            timestamp: getMessageTime(),
            type: 'CHAT',
        };

        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    // отмена действия браузера по умолчанию
    event.preventDefault();
}


function sendFile(fileInput) {

    var reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);

    reader.onload = function () {
    console.log(reader.result);

        var chatMessage = {
            sender: username,
            content: reader.result,
            timestamp: getMessageTime(),
            type: 'FILE',
        };

        console.log(chatMessage);
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    };
     // отмена действия браузера по умолчанию
     event.preventDefault();
 }


function onMessageReceived(payload) {

    var message = JSON.parse(payload.body);

    switch (message.type) {
      case 'JOIN':
        outputJoinMessage(message);
        break;
      case 'LEAVE':
        outputLeaveMessage(message);
        break;
      case 'CHAT':
        outputChatMessage(message);
        break;
      case 'FILE':
         outputFileMessage(message);
         break;
    }
}


function outputJoinMessage(message) {
     var messageElement = document.createElement('li');

     messageElement.classList.add('event-message');
     message.content = message.sender + ' joined!';

     var textElement = document.createElement('p');
     var messageText = document.createTextNode(message.content);
     textElement.appendChild(messageText);

     messageElement.appendChild(textElement);

     messageArea.appendChild(messageElement);
     messageArea.scrollTop = messageArea.scrollHeight;
}

function outputLeaveMessage(message) {
     var messageElement = document.createElement('li');

     messageElement.classList.add('event-message');
     message.content = message.sender + ' left!';

     var textElement = document.createElement('p');
     var messageText = document.createTextNode(message.content);
     textElement.appendChild(messageText);

     messageElement.appendChild(textElement);

     messageArea.appendChild(messageElement);
     messageArea.scrollTop = messageArea.scrollHeight;
}

function outputChatMessage(message) {
     var messageElement = document.createElement('li');
     messageElement.classList.add('chat-message');

     // вывод аватарки пользователя
     var avatarElement = document.createElement('i');
     var avatarText = document.createTextNode(message.sender[0]);
     avatarElement.appendChild(avatarText);
     avatarElement.style['background-color'] = getAvatarColor(message.sender);

     messageElement.appendChild(avatarElement);

     // вывод имени пользователя
     var usernameElement = document.createElement('span');
     var usernameText = document.createTextNode(message.sender);

     usernameElement.appendChild(usernameText);
     messageElement.appendChild(usernameElement);

     // вывод текста сообщения
     var textElement = document.createElement('p');
     var messageText = document.createTextNode(message.content);
     textElement.appendChild(messageText);

     console.log(message);
     messageElement.appendChild(textElement);

     // вывод времени сообщения
     var messageTimestamp = document.createElement('p');
     messageTimestamp.classList.add('time');
     var dateText  = document.createTextNode(message.timestamp);
     messageTimestamp.appendChild(dateText);

     messageElement.appendChild(messageTimestamp);

     messageArea.appendChild(messageElement);
     messageArea.scrollTop = messageArea.scrollHeight;
}

function outputFileMessage(message) {
     var messageElement = document.createElement('li');
     messageElement.classList.add('chat-message');

     // вывод аватарки пользователя
     var avatarElement = document.createElement('i');
     var avatarText = document.createTextNode(message.sender[0]);
     avatarElement.appendChild(avatarText);
     avatarElement.style['background-color'] = getAvatarColor(message.sender);

     messageElement.appendChild(avatarElement);

     // вывод имени пользователя
     var usernameElement = document.createElement('span');
     var usernameText = document.createTextNode(message.sender);

     usernameElement.appendChild(usernameText);
     messageElement.appendChild(usernameElement);

     // вывод файла
     var image = document.createElement('img');
     image.classList.add('send-img');
     image.src = message.content;
     var imageWrapper = document.createElement('div');
     wrapper.appendChild(image);
     messageElement.appendChild(imageWrapper);

     // вывод времени сообщения
     var messageTimestamp = document.createElement('p');
     messageTimestamp.classList.add('time');
     var dateText  = document.createTextNode(message.timestamp);
     messageTimestamp.appendChild(dateText);

     messageElement.appendChild(messageTimestamp);

     messageArea.appendChild(messageElement);
     messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }

    var index = Math.abs(hash % colors.length);
    return colors[index];
}


function getMessageTime() {
    var now = new Date();
    return  now.toLocaleString("ru");
}

usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);




















