<template>
    <main class="bg-dark-900 min-h-screen flex flex-col items-center justify-center">
        <div class="text-center px-4">
            <h1 class="text-4xl md:text-5xl font-bold text-maroon-500 mb-4">Crimson Whisper</h1>
            <p class="text-gray-400 mb-8 max-w-md mx-auto">Secure anonymous chats</p>
        </div>

        <!-- Floating Action Button -->
        <div class="fixed bottom-8 right-8 z-10">
            <button @click="toggleMenu"
                class="floating-btn bg-maroon-500 hover:bg-maroon-600 text-white rounded-full p-4">
                <i data-feather="plus"></i>
            </button>

            <div v-if="menuOpen" class="absolute bottom-full right-0 mb-4 space-y-2">
                <button @click="openCreate"
                    class="action-btn bg-maroon-600 hover:bg-maroon-700 text-white px-4 py-2 rounded-lg flex items-center">
                    <i data-feather="plus-circle" class="mr-2"></i> Create Room
                </button>
                <button @click="openJoin"
                    class="action-btn bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg flex items-center">
                    <i data-feather="log-in" class="mr-2"></i> Join Room
                </button>
            </div>
        </div>

        <!-- Create Room Modal -->
        <div v-if="showCreate" class="modal fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
            <div class="bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4 border border-maroon-600">
                <h2 class="text-xl font-bold text-maroon-500 mb-4">Create Secret Room</h2>
                <div class="space-y-4">
                    <input v-model="roomName" type="text" placeholder="Room Name"
                        class="w-full bg-dark-700 border border-dark-600 rounded px-4 py-2 text-white focus:border-maroon-500 focus:outline-none" />
                    <input v-model="roomPass" type="password" placeholder="Password"
                        class="w-full bg-dark-700 border border-dark-600 rounded px-4 py-2 text-white focus:border-maroon-500 focus:outline-none" />
                    <div class="flex justify-end space-x-3 pt-2">
                        <button @click="closeModals"
                            class="px-4 py-2 rounded text-gray-300 hover:text-white">Cancel</button>
                        <button @click="createRoom"
                            class="bg-maroon-500 hover:bg-maroon-600 text-white px-4 py-2 rounded">Create</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Join Room Modal -->
        <div v-if="showJoin" class="modal fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
            <div class="bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4 border border-maroon-600">
                <h2 class="text-xl font-bold text-maroon-500 mb-4">Join Secret Room</h2>
                <div class="space-y-4">
                    <input v-model="joinName" type="text" placeholder="Room Name"
                        class="w-full bg-dark-700 border border-dark-600 rounded px-4 py-2 text-white focus:border-maroon-500 focus:outline-none" />
                    <input v-model="joinPass" type="password" placeholder="Password"
                        class="w-full bg-dark-700 border border-dark-600 rounded px-4 py-2 text-white focus:border-maroon-500 focus:outline-none" />
                    <div class="flex justify-end space-x-3 pt-2">
                        <button @click="closeModals"
                            class="px-4 py-2 rounded text-gray-300 hover:text-white">Cancel</button>
                        <button @click="joinRoom"
                            class="bg-maroon-500 hover:bg-maroon-600 text-white px-4 py-2 rounded">Join</button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import feather from "feather-icons";
import { useRouter } from "vue-router";
import { db } from "@/firebase";
import { ref as dbRef, push, set, get, child } from "firebase/database";

// UI state
const menuOpen = ref(false);
const showCreate = ref(false);
const showJoin = ref(false);

// Form input
const roomName = ref("");
const roomPass = ref("");
const joinName = ref("");
const joinPass = ref("");

const router = useRouter();

onMounted(() => {
    feather.replace();
});

const toggleMenu = () => (menuOpen.value = !menuOpen.value);
const openCreate = () => { menuOpen.value = false; showCreate.value = true; };
const openJoin = () => { menuOpen.value = false; showJoin.value = true; };
const closeModals = () => { showCreate.value = false; showJoin.value = false; };

// Create Room
const createRoom = async () => {
    if (!roomName.value || !roomPass.value) return alert("Isi semua kolom!");
    const roomsRef = dbRef(db, "rooms");
    const newRoom = push(roomsRef);
    await set(newRoom, {
        name: roomName.value,
        password: roomPass.value,
        createdAt: Date.now()
    });
    // alert(`Room "${roomName.value}" berhasil dibuat!`);
    closeModals();
    router.push({ name: "ChatRoom", params: { roomId: newRoom.key } });
};

// Join Room
const joinRoom = async () => {
    if (!joinName.value || !joinPass.value) return alert("Isi semua kolom!");
    const snapshot = await get(child(dbRef(db), "rooms"));
    if (snapshot.exists()) {
        const rooms = snapshot.val();
        const foundKey = Object.keys(rooms).find(
            key => rooms[key].name === joinName.value && rooms[key].password === joinPass.value
        );
        if (foundKey) {
            // alert(`Berhasil join ke room "${joinName.value}"`);
            closeModals();
            router.push({ name: "ChatRoom", params: { roomId: foundKey } });
        } else {
            alert("Nama room atau password salah!");
        }
    } else {
        alert("Belum ada room yang dibuat.");
    }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap");

body {
    font-family: "Ubuntu Mono", monospace;
    background-color: #0a0a0a;
    color: #e2e8f0;
}

.floating-btn {
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.floating-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.4);
}

.action-btn {
    transition: all 0.2s ease;
}

.action-btn:hover {
    transform: scale(1.05);
}

.modal {
    transition: opacity 0.3s ease, transform 0.3s ease;
}
</style>