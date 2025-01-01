import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-toastify";

const socketUrl = process.env.REACT_APP_SOCKET_URL;

let stompClient = null;
export const connectWebSocketEmoji = (onMessage, postId) => {
  const socket = new SockJS(socketUrl);
  stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    console.log("WebSocket Connected via SockJS");

    // 이모지 업데이트 이벤트 구독
    stompClient.subscribe(`/topic/emoji/${postId}`, (message) => {
      const data = JSON.parse(message.body);
      console.log(`Emoji Update for postId ${postId}:`, data);
      if (onMessage) onMessage(data);
    });
  })
}

let reconnectAttempts = 0;
const maxReconnectAttempts = 10;
const reconnectDelay = 10000;

export const connectWebSocketPush = (onMessage, userId) => {
  const socket = new SockJS(socketUrl);
  stompClient = Stomp.over(socket);

  stompClient.connect(
    {},
    () => {
      console.log("WebSocket Connected via SockJS");
      reconnectAttempts = 0; // 연결 성공 시 재연결 시도 횟수 초기화

      stompClient.subscribe(`/topic/notification/${userId}`, (message) => {
        const data = JSON.parse(message.body);
        console.log(`Received messages userId, ${userId}:`, data);

        // 전달받은 메시지를 처리
        if (onMessage) onMessage(data);
      });
    },
    (error) => {
      console.error("WebSocket Connection Error:", error);
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        console.log(`Reconnecting... Attempt ${reconnectAttempts}/${maxReconnectAttempts}`);
        setTimeout(() => connectWebSocketPush(onMessage, userId), reconnectDelay);
      } else {
        console.error("Max reconnect attempts reached. Giving up.");
      }
    }
  );
};

export const connectWebSocket = (onMessage, roomId) => {
  const socket = new SockJS(socketUrl); // SockJS를 사용하여 WebSocket 생성
  stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {

    stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
      const data = JSON.parse(message.body);
      console.log("Message for room:", roomId, data);
      const localMemberId = localStorage.getItem("memberId");
      if (data.senderId == localMemberId) {
        console.log("Skipping message from self:", data);
        return;
      }
      if (onMessage) onMessage(data);
    });
  }, (error) => {
    console.error("WebSocket Connection Error:", error);
  });
};

export const addEmoji = (postId, emoji) => {
  if (stompClient && stompClient.connected) {
    const memberId = localStorage.getItem("memberId");
    console.log(postId, emoji, memberId);
    stompClient.send(
      "/app/addEmoji", // 서버의 MessageMapping 경로
      {},
      JSON.stringify({ postId, emoji, memberId })
    );
  } else {
    console.error("WebSocket is not connected");
  }
};

export const sendMessage = (roomId, senderId, targetNickname, message) => {
  if (stompClient && stompClient.connected) {
    stompClient.send(
      "/app/chat/send", // 서버의 MessageMapping 경로
      {},
      JSON.stringify({ roomId, senderId, targetNickname, message })
    );
    console.log("Message sent:", { roomId, senderId, targetNickname, message });
  } else {
    console.error("WebSocket is not connected");
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.disconnect(() => {
      console.log("WebSocket Disconnected");
    });
  }
};
