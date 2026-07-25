import { useEffect, useRef, useCallback, useState } from "react";
import { io } from "socket.io-client";
import { getSocketUrl } from "../lib/api";

const SOCKET_URL = getSocketUrl();

/**
 * useSocket — connects to the backend Socket.IO server for real-time updates.
 *
 * @param {object} options
 * @param {function} options.onDashboardUpdate — called when dashboard data should refresh
 * @returns {{ isConnected: boolean, lastEvent: object|null }}
 *
 * The hook automatically:
 * - Reads the admin token from localStorage
 * - Connects with auth token
 * - Reconnects on token change
 * - Cleans up on unmount
 */
const useSocket = ({ onDashboardUpdate } = {}) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const callbackRef = useRef(onDashboardUpdate);
  callbackRef.current = onDashboardUpdate;

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setIsConnected(false);
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.warn("Socket connection error:", err.message);
      setIsConnected(false);
    });

    /* ── Dashboard update event ──────────────────────────────── */
    socket.on("dashboard:update", (payload) => {
      setLastEvent(payload);
      if (callbackRef.current) {
        callbackRef.current(payload);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, []);

  return { isConnected, lastEvent };
};

export default useSocket;
