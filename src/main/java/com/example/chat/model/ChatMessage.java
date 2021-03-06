package com.example.chat.model;

public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;
    private String timestamp;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE,
        FILE
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getTimestamp() {
        return timestamp;
    }
}
