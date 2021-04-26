package com.example.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

/*
   Настройки WebSocket
 */

@Configuration                      // конфигурационный Spring класс
@EnableWebSocketMessageBroker       // включение обработки сообщений по WebSocket, возвращаемых брокером сообщений
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // подключение конечного адреса, по которому происходит прослушивание и передача сообщения
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").withSockJS();

    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/chat");
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.setMessageSizeLimit(200000);
        registration.setSendBufferSizeLimit(3 * 1024 * 1024);
        registration.setSendTimeLimit(20000);
    }
}
