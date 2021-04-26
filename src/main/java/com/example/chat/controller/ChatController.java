package com.example.chat.controller;

import com.example.chat.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

/*
    Контроллер который прослушивает входящие сообщения и посылает исходящие
 */

@Controller
public class ChatController {

    @MessageMapping("/chat.sendMessage")             // url по которому слушает
    @SendTo("/chat/messaging")                       // url на который отправляет
    public ChatMessage sendMessage(@Payload ChatMessage message) {
        return message;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/chat/messaging")
    public ChatMessage addUser(@Payload ChatMessage message,
        SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        return message;
    }



}