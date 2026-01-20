import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  getLeadConversations,
  sendLeadMessage,
  markMessageAsRead,
  getSocket,
} from "@/app/api/leadAPI";
import { MessageSquare, Send, X, Loader2, Wifi, WifiOff } from "lucide-react";

// Helper function to detect duplicate messages
const isDuplicateMessage = (existingMsg, newMsg) => {
  // Same ID
  if (existingMsg.conversation_id === newMsg.conversation_id) return true;

  // Same content, same sender, within 5 seconds
  if (
    existingMsg.message_text === newMsg.message_text &&
    existingMsg.participant_id === newMsg.participant_id &&
    Math.abs(new Date(existingMsg.created_at) - new Date(newMsg.created_at)) <
      5000
  ) {
    return true;
  }

  return false;
};

export default function ChatDrawer({
  leadId,
  onClose,
  onMessagesUpdated,
  leadName,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [messageType, setMessageType] = useState("initial_inquiry");

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const mountedRef = useRef(false);
  const currentLeadIdRef = useRef(null);
  const pendingMessageIdsRef = useRef(new Set());

  // Message type options
  const MESSAGE_TYPES = [
    { value: "initial_inquiry", label: "Initial Inquiry" },
    { value: "follow_up", label: "Follow Up" },
    { value: "proposal", label: "Proposal" },
    { value: "negotiation", label: "Negotiation" },
  ];

  // Get user data safely with better error handling
  const getUserData = useCallback(() => {
    if (typeof window === "undefined") return null;
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        console.error("❌ No user data found in localStorage");
        return null;
      }

      const parsed = JSON.parse(userData);
      console.log("👤 User data retrieved:", parsed);

      if (!parsed.user_id) {
        console.error("❌ user_id not found in user data");
        return null;
      }

      return parsed;
    } catch (error) {
      console.error("❌ Error getting user data:", error);
      return null;
    }
  }, []);

  const user = getUserData();
  const currentUserId = user?.user_id;

  // Debug user info
  useEffect(() => {
    console.log("🔍 Current User ID:", currentUserId);
    console.log("🔍 Full User data:", user);

    if (!currentUserId) {
      console.error(
        "❌ No currentUserId available - check localStorage user data"
      );
    }
  }, [currentUserId, user]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && mountedRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Load messages
  const loadMessages = useCallback(async () => {
    if (!leadId || !mountedRef.current) return;
    let conversationId = null;

    try {
      setLoading(true);
      console.log("📥 Loading messages for lead:", leadId);

      const response = await getLeadConversations(leadId, 1, 200);
      console.log("📥 Messages API response:", response.data);

      const convo = response.data?.data?.messages;
      const conversationId = convo.map((con) => con.conversation_id);
      console.log(conversationId);

      const read = await markMessageAsRead(leadId, conversationId);
      console.log("read", read);

      if (response.data?.success && mountedRef.current) {
        const messagesData = response.data.data?.messages || [];
        console.log("📥 Loaded messages count:", messagesData.length);

        messagesData.forEach((msg, index) => {
          const isCurrentUser =
            String(msg.participant_id) === String(currentUserId);
          console.log(`📝 Message ${index}:`, {
            id: msg.conversation_id,
            text: msg.message_text,
            participant_id: msg.participant_id,
            isCurrentUser: isCurrentUser,
            shouldShowOn: isCurrentUser ? "RIGHT" : "LEFT",
          });
        });

        setMessages(messagesData);
        onMessagesUpdated?.(messagesData);
      } else {
        throw new Error("Failed to load messages");
      }
    } catch (error) {
      console.error("❌ Error loading messages:", error);
      if (mountedRef.current) {
        setConnectionError("Failed to load messages");
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [leadId, onMessagesUpdated, currentUserId]);

  // Initialize socket connection
  const initializeSocket = useCallback(async () => {
    if (!currentUserId || !leadId || !mountedRef.current || socketRef.current) {
      return;
    }

    try {
      console.log("🔌 Initializing socket connection...");
      setConnectionError(null);

      const socketInstance = await getSocket();

      if (!mountedRef.current || currentLeadIdRef.current !== leadId) {
        return;
      }

      socketRef.current = socketInstance;

      // Socket event handlers - FIXED VERSION
      const handleNewMessage = (message) => {
        if (!mountedRef.current) return;

        console.log("🔍 [SOCKET] Raw message received:", {
          conversation_id: message.conversation_id,
          message_text: message.message_text,
          participant_id: message.participant_id,
          participant_data: message.participant,
          currentUserId: currentUserId,
          pendingIds: Array.from(pendingMessageIdsRef.current),
        });

        // FIX: Handle missing participant_id by checking participant data
        let actualParticipantId = message.participant_id;
        if (!actualParticipantId && message.participant) {
          actualParticipantId = message.participant.user_id;
          console.log(
            "🔧 [SOCKET] Using participant.user_id:",
            actualParticipantId
          );
        }

        const isCurrentUserMsg =
          String(actualParticipantId) === String(currentUserId);

        // STRICT: Ignore any message from current user via socket
        if (isCurrentUserMsg) {
          console.log(
            "🔄 [SOCKET] Ignoring message from current user via socket"
          );
          return;
        }

        // Check if this is a message we just sent
        if (pendingMessageIdsRef.current.has(message.conversation_id)) {
          console.log(
            "🔄 [SOCKET] Ignoring - message in pending IDs:",
            message.conversation_id
          );
          return;
        }

        if (
          typeof message.conversation_id === "string" &&
          message.conversation_id.startsWith("temp-")
        ) {
          console.log(
            "🔄 [SOCKET] Ignoring - temporary ID:",
            message.conversation_id
          );
          return;
        }

        if (message.lead_id === parseInt(leadId)) {
          setMessages((prev) => {
            // Create message with fixed participant_id if needed
            const fixedMessage =
              actualParticipantId !== message.participant_id
                ? { ...message, participant_id: actualParticipantId }
                : message;

            const exists = prev.some((existingMsg) =>
              isDuplicateMessage(existingMsg, fixedMessage)
            );
            if (exists) {
              console.log(
                "🔄 [SOCKET] Ignoring - duplicate message:",
                message.conversation_id
              );
              return prev;
            }

            console.log("✅ [SOCKET] Adding new message to state:", {
              id: message.conversation_id,
              from: isCurrentUserMsg ? "CURRENT_USER" : "OTHER_USER",
              shouldAppearOn: isCurrentUserMsg ? "RIGHT" : "LEFT",
              fixedParticipantId: actualParticipantId,
            });
            return [...prev, fixedMessage];
          });

          // Auto-mark as read if it's not our message
          if (!isCurrentUserMsg) {
            markMessageAsRead(leadId, message.conversation_id).catch(
              console.error
            );
          }

          onMessagesUpdated?.();
        }
      };

      const handleMessageRead = (data) => {
        if (!mountedRef.current) return;

        console.log("📖 Message read event:", data);
        if (data.lead_id === parseInt(leadId)) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.conversation_id === data.conversation_id
                ? { ...msg, is_read: true, read_at: data.read_at }
                : msg
            )
          );
        }
      };

      const handleSocketConnect = () => {
        if (!mountedRef.current) return;

        console.log("✅ Socket connected in chat drawer");
        setSocketConnected(true);
        setConnectionError(null);

        if (socketRef.current) {
          socketRef.current.emit("join_lead", {
            leadId: parseInt(leadId),
            userId: currentUserId,
          });
          console.log(`✅ Joined lead room: lead_${leadId}`);
        }
      };

      const handleSocketDisconnect = (reason) => {
        if (!mountedRef.current) return;

        console.log("❌ Socket disconnected in chat drawer:", reason);
        setSocketConnected(false);
      };

      const handleSocketError = (error) => {
        if (!mountedRef.current) return;

        console.error("🔴 Socket error:", error);
        setConnectionError("Connection error");
      };

      // Register event listeners
      socketInstance.on("connect", handleSocketConnect);
      socketInstance.on("disconnect", handleSocketDisconnect);
      socketInstance.on("new_message", handleNewMessage);
      socketInstance.on("message_read", handleMessageRead);
      socketInstance.on("error", handleSocketError);

      if (socketInstance.connected) {
        handleSocketConnect();
      }
    } catch (error) {
      console.error("❌ Socket initialization failed:", error);
      if (mountedRef.current) {
        setConnectionError("Failed to connect");
        setSocketConnected(false);
      }
    }
  }, [leadId, currentUserId, onMessagesUpdated]);

  // Main useEffect
  useEffect(() => {
    mountedRef.current = true;
    currentLeadIdRef.current = leadId;

    console.log("🎯 ChatDrawer mounted for lead:", leadId);
    console.log("🎯 Current user ID:", currentUserId);

    const initializeChat = async () => {
      if (!mountedRef.current) return;
      await loadMessages();
      await initializeSocket();
    };

    initializeChat();

    return () => {
      console.log("🧹 ChatDrawer cleanup for lead:", leadId);
      mountedRef.current = false;
      pendingMessageIdsRef.current.clear();

      if (socketRef.current) {
        socketRef.current.emit("leave_lead", { leadId: parseInt(leadId) });
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("new_message");
        socketRef.current.off("message_read");
        socketRef.current.off("error");
        socketRef.current = null;
      }

      setSocketConnected(false);
      setConnectionError(null);
    };
  }, [leadId, loadMessages, initializeSocket, currentUserId]);

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0 && mountedRef.current) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Check if message is from current user
  const isCurrentUser = useCallback(
    (participantId) => {
      if (!participantId || !currentUserId) return false;

      const participantIdStr = String(participantId);
      const currentUserIdStr = String(currentUserId);

      const result = participantIdStr === currentUserIdStr;

      console.log("🔍 [RENDER] isCurrentUser check:", {
        participantId,
        currentUserId,
        participantIdStr,
        currentUserIdStr,
        result,
      });

      return result;
    },
    [currentUserId]
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending || !currentUserId || !socketConnected)
      return;

    const messageData = {
      message_text: newMessage.trim(),
      message_type: messageType,
      attachments: null,
    };

    const tempMessageId = `temp-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Optimistic UI update
    const tempMessage = {
      conversation_id: tempMessageId,
      message_text: messageData.message_text,
      message_type: messageData.message_type,
      attachments: null,
      participant_id: currentUserId,
      lead_id: parseInt(leadId),
      created_at: new Date().toISOString(),
      is_read: false,
      participant: {
        user_id: currentUserId,
        email: user?.email || "",
        fullname: user?.fullname || "You",
        role: user?.role,
        avatar_url: user?.avatar_url,
      },
    };

    console.log("📤 [SEND] Starting message send:", {
      tempMessageId,
      currentUserId,
      messageText: messageData.message_text,
      shouldAppearOn: "RIGHT",
    });

    // Add to pending messages to prevent socket duplicates
    pendingMessageIdsRef.current.add(tempMessageId);

    setMessages((prev) => {
      console.log("📤 [SEND] Adding temp message to state");
      return [...prev, tempMessage];
    });
    setNewMessage("");
    setSending(true);

    try {
      const response = await sendLeadMessage(leadId, messageData);
      console.log("📤 [SEND] API response:", response.data);

      if (response.data?.success && mountedRef.current) {
        const serverMessage = response.data.data;

        console.log("📤 [SEND] Server message received:", {
          serverId: serverMessage.conversation_id,
          participant_id: serverMessage.participant_id,
          isCurrentUser:
            String(serverMessage.participant_id) === String(currentUserId),
        });

        // Add the server message ID to pending to prevent socket duplicates
        pendingMessageIdsRef.current.add(serverMessage.conversation_id);

        // Replace temp message with actual message from server
        setMessages((prev) => {
          const updated = prev.map((msg) =>
            msg.conversation_id === tempMessageId ? serverMessage : msg
          );
          console.log("📤 [SEND] Replaced temp with server message");
          return updated;
        });

        // Remove temp ID from pending after successful replacement
        setTimeout(() => {
          pendingMessageIdsRef.current.delete(tempMessageId);
          console.log("📤 [SEND] Cleaned up temp ID:", tempMessageId);
        }, 2000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("❌ [SEND] Error sending message:", error);
      if (mountedRef.current) {
        pendingMessageIdsRef.current.delete(tempMessageId);
        setMessages((prev) =>
          prev.filter((msg) => msg.conversation_id !== tempMessageId)
        );
        console.log("❌ [SEND] Removed temp message due to error");
      }
    } finally {
      if (mountedRef.current) {
        setSending(false);
      }
    }
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format message time
  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get message type label
  const getMessageTypeLabel = (type) => {
    const typeObj = MESSAGE_TYPES.find((t) => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  // Retry connection
  const handleRetryConnection = async () => {
    setConnectionError(null);
    await initializeSocket();
  };

  // If no user data, show error
  if (!currentUserId) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
        <div className="w-full max-w-md bg-[var(--color-primary)] shadow-xl flex flex-col h-full border-l border-[var(--color-accent-200)]">
          <div className="p-4 text-center text-red-600">
            User not authenticated
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="w-full max-w-md bg-[var(--color-primary)] shadow-xl flex flex-col h-full border-l border-[var(--color-accent-200)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-accent-200)] bg-[var(--color-primary)]">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6 text-[var(--color-accent-700)]" />
            <div>
              <h3 className="font-semibold text-[var(--color-accent-900)]">
                Chat
              </h3>
              <p className="text-sm text-[var(--color-accent-600)]">
                Inquiries Name: {leadName}
              </p>
              <div className="flex items-center space-x-2 text-xs mt-1">
                <div className="flex items-center space-x-1">
                  {socketConnected ? (
                    <>
                      <Wifi className="w-3 h-3 text-green-500" />
                      <span className="text-green-600">Connected</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 text-red-500" />
                      <span className="text-red-600">Disconnected</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-accent-50)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--color-accent-700)]" />
          </button>
        </div>

        {/* Connection Error */}
        {connectionError && (
          <div className="bg-red-50 border-b border-red-200 p-3">
            <div className="flex items-center justify-between">
              <span className="text-red-700 text-sm">{connectionError}</span>
              <button
                onClick={handleRetryConnection}
                className="text-red-700 hover:text-red-800 text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--color-accent-50)]">
          {loading ? (
            <div className="flex justify-center items-center h-20 text-[var(--color-accent-700)]">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-20 text-[var(--color-accent-600)]">
              <MessageSquare className="w-8 h-8 mb-2 opacity-60" />
              <p>No messages yet</p>
              <p className="text-sm">Start a conversation</p>
            </div>
          ) : (
            messages.map((message) => {
              const isMyMessage = isCurrentUser(message.participant_id);

              console.log("🎨 [RENDER] Rendering message:", {
                id: message.conversation_id,
                text: message.message_text,
                participant_id: message.participant_id,
                isMyMessage: isMyMessage,
                position: isMyMessage ? "RIGHT" : "LEFT",
              });

              return (
                <div
                  key={message.conversation_id}
                  className={`flex ${
                    isMyMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                      isMyMessage
                        ? "bg-[var(--color-accent-700)] text-white rounded-br-none"
                        : "bg-white text-[var(--color-accent-900)] border border-[var(--color-accent-200)] rounded-bl-none"
                    }`}
                  >
                    {/* Message header - show for other users */}
                    {!isMyMessage && (
                      <p className="text-xs font-medium mb-1 text-[var(--color-accent-600)]">
                        {message.participant?.fullname || "Unknown User"}
                      </p>
                    )}

                    {/* Message type badge */}
                    <div className="mb-1">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          message.message_type === "initial_inquiry"
                            ? isMyMessage
                              ? "bg-[var(--color-accent-500)] text-white"
                              : "bg-[var(--color-accent-100)] text-[var(--color-accent-800)]"
                            : message.message_type === "follow_up"
                            ? isMyMessage
                              ? "bg-[var(--color-accent-500)] text-white"
                              : "bg-[var(--color-accent-200)] text-[var(--color-accent-800)]"
                            : message.message_type === "proposal"
                            ? isMyMessage
                              ? "bg-purple-400 text-white"
                              : "bg-purple-100 text-purple-800"
                            : isMyMessage
                            ? "bg-orange-400 text-white"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {getMessageTypeLabel(message.message_type)}
                      </span>
                    </div>

                    {/* Message text */}
                    <p
                      className={`text-sm whitespace-pre-wrap break-words ${
                        isMyMessage
                          ? "text-white"
                          : "text-[var(--color-accent-900)]"
                      }`}
                    >
                      {message.message_text}
                    </p>

                    {/* Message footer */}
                    <div
                      className={`flex items-center justify-between mt-2 text-xs ${
                        isMyMessage
                          ? "text-[var(--color-accent-100)]"
                          : "text-[var(--color-accent-500)]"
                      }`}
                    >
                      <span>{formatMessageTime(message.created_at)}</span>
                      {isMyMessage && (
                        <span className="ml-2">
                          {message.is_read ? "✓ Read" : "✓ Sent"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-[var(--color-accent-200)] bg-[var(--color-primary)] p-4 space-y-3">
          {/* Message Type Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-[var(--color-accent-800)] whitespace-nowrap">
              Message Type:
            </label>
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="flex-1 px-3 py-2 border border-[var(--color-accent-300)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] text-sm text-[var(--color-accent-900)]"
            >
              {MESSAGE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                socketConnected ? "Type your message..." : "Connecting..."
              }
              disabled={sending || !socketConnected}
              className="flex-1 px-4 py-3 border border-[var(--color-accent-300)] rounded-xl focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] disabled:opacity-50 text-[var(--color-accent-900)]"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending || !socketConnected}
              className="px-6 py-3 bg-[var(--color-accent-700)] text-white rounded-xl hover:bg-[var(--color-accent-800)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[60px]"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
