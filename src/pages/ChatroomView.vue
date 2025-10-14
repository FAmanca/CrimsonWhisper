<template>
    <main class="bg-dark-900 min-h-screen">
      <div class="flex flex-col h-screen">
        <!-- Header -->
        <div class="bg-dark-800 border-b border-maroon-600 p-4 flex items-center justify-between">
          <h2 class="text-xl font-bold text-maroon-500">
            Room: <span class="text-white">{{ roomName }}</span>
          </h2>
          <router-link to="/" class="text-gray-400 hover:text-white">
            <i data-feather="log-out"></i>
          </router-link>
        </div>
  
        <!-- Chat Messages -->
        <div ref="chatMessages" class="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          <div v-for="msg in messages" :key="msg.timestamp + '-' + msg._key"
               :class="msg.senderId === myUserId ? 'flex justify-end' : 'flex justify-start'">
            <div :class="msg.senderId === myUserId ? 'bg-maroon-500' : 'bg-dark-700'"
                 class="text-white p-3 rounded-lg max-w-xs md:max-w-md break-words">
              <div class="text-xs opacity-70 mb-1">{{ msg.senderName }}</div>
              <div>{{ msg.text }}</div>
            </div>
          </div>
        </div>
  
        <!-- Message Input -->
        <div class="bg-dark-800 border-t border-dark-700 p-4">
          <div class="flex space-x-2">
            <input v-model="newMessage" @keyup.enter="sendMessage" type="text"
                   placeholder="Type your secret message..."
                   class="flex-1 bg-dark-700 border border-dark-600 rounded px-4 py-2 text-white focus:border-maroon-500 focus:outline-none" />
            <button @click="sendMessage" class="bg-maroon-500 hover:bg-maroon-600 text-white px-4 py-2 rounded">
              <i data-feather="send"></i>
            </button>
          </div>
        </div>
      </div>
    </main>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from "vue";
  import { useRoute } from "vue-router";
  import feather from "feather-icons";
  import { db } from "@/firebase";
  import { ref as dbRef, push, onValue, get, child } from "firebase/database";
  
  const route = useRoute();
  const roomId = route.params.roomId;
  
  const roomName = ref("Loading...");
  const messages = ref([]);
  const newMessage = ref("");
  const chatMessages = ref(null);
  const myUserId = ref("");
  
  // Generate atau ambil user ID unik
  const getUserId = () => {
    let userId = localStorage.getItem('anonChatUserId');
    if (!userId) {
      // Buat ID unik: timestamp + random string
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('anonChatUserId', userId);
    }
    return userId;
  };
  
  // Generate nama anonim random
  const getAnonName = () => {
    let anonName = sessionStorage.getItem(`anonName_${roomId}`);
    if (!anonName) {
      const adjectives = ['Silent', 'Shadow', 'Dark', 'Mystic', 'Ghost', 'Phantom', 'Secret', 'Hidden'];
      const nouns = ['Whisper', 'Echo', 'Voice', 'Spirit', 'Soul', 'Entity', 'Being', 'Presence'];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      anonName = `${adj} ${noun}`;
      sessionStorage.setItem(`anonName_${roomId}`, anonName);
    }
    return anonName;
  };
  
  onMounted(async () => {
    feather.replace();
    
    // Set user ID
    myUserId.value = getUserId();
  
    // Ambil nama room
    const roomSnap = await get(child(dbRef(db), `rooms/${roomId}`));
    roomName.value = roomSnap.exists() ? roomSnap.val().name : "Unknown Room";
  
    // Listen pesan realtime
    const roomRef = dbRef(db, `rooms/${roomId}/messages`);
    onValue(roomRef, snapshot => {
      const data = snapshot.val() || {};
      messages.value = Object.keys(data).map(key => ({ ...data[key], _key: key }));
      nextTick(() => {
        if (chatMessages.value) chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
      });
    });
  });
  
  const sendMessage = () => {
    if (!newMessage.value.trim()) return;
    const roomRef = dbRef(db, `rooms/${roomId}/messages`);
    push(roomRef, { 
      senderId: myUserId.value,
      senderName: getAnonName(),
      text: newMessage.value.trim(), 
      timestamp: Date.now() 
    });
    newMessage.value = "";
  };
  </script>
  
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap');
  
  body {
    font-family: 'Ubuntu Mono', monospace;
    background-color: #0a0a0a;
    color: #e2e8f0;
  }
  
  .break-words {
    word-break: break-word;
  }
  
  .bg-maroon-500 {
    background-color: #800000;
  }
  
  .bg-dark-700 {
    background-color: #1a1a1a;
  }
  
  .rounded-lg {
    border-radius: 0.5rem;
  }
  
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  </style>