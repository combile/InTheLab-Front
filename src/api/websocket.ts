import { storage } from "../utils/storage";

// WebSocket 설정
const WS_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/^http/, "ws") || "";

export interface RankingUser {
  user_id: string; // 문자열 타입
  username: string;
  lab_name: string;
  total_time: number; // 시간 단위 float
  is_checked_in: boolean;
}

export interface WebSocketMessage {
  type: "ranking_update" | "user_check_in" | "user_check_out";
  timestamp: string;
  users?: RankingUser[];
  user?: RankingUser;
}

type MessageHandler = (message: WebSocketMessage) => void;
type ConnectionHandler = () => void;
type ErrorHandler = (error: Event) => void;

class AttendanceWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageHandlers: MessageHandler[] = [];
  private connectHandlers: ConnectionHandler[] = [];
  private disconnectHandlers: ConnectionHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];

  async connect(): Promise<void> {
    const token = await storage.getToken();
    if (!token) {
      console.error("[WebSocket] 토큰이 없습니다. 연결 실패.");
      return;
    }

    const wsUrl = `${WS_BASE_URL}/ws/attendance/live?token=${token}`;
    console.log("[WebSocket] 연결 시도:", wsUrl.replace(token, "***"));

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log("[WebSocket] 연결됨");
      this.reconnectAttempts = 0;
      this.connectHandlers.forEach((handler) => handler());
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        console.log("[WebSocket] 메시지 수신:", message.type);
        this.messageHandlers.forEach((handler) => handler(message));
      } catch (error) {
        console.error("[WebSocket] 메시지 파싱 오류:", error);
      }
    };

    this.ws.onclose = (event) => {
      console.log("[WebSocket] 연결 종료:", event.code, event.reason);
      this.disconnectHandlers.forEach((handler) => handler());
      
      // 자동 재연결
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`[WebSocket] ${this.reconnectDelay}ms 후 재연결 시도 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        setTimeout(() => this.connect(), this.reconnectDelay);
      }
    };

    this.ws.onerror = (error) => {
      console.error("[WebSocket] 오류:", error);
      this.errorHandlers.forEach((handler) => handler(error));
    };
  }

  disconnect(): void {
    if (this.ws) {
      console.log("[WebSocket] 연결 해제");
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // 재연결 방지
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  onConnect(handler: ConnectionHandler): () => void {
    this.connectHandlers.push(handler);
    return () => {
      this.connectHandlers = this.connectHandlers.filter((h) => h !== handler);
    };
  }

  onDisconnect(handler: ConnectionHandler): () => void {
    this.disconnectHandlers.push(handler);
    return () => {
      this.disconnectHandlers = this.disconnectHandlers.filter((h) => h !== handler);
    };
  }

  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.push(handler);
    return () => {
      this.errorHandlers = this.errorHandlers.filter((h) => h !== handler);
    };
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// 싱글톤 
export const attendanceWebSocket = new AttendanceWebSocket();
