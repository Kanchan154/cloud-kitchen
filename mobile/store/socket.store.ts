import { BASE_API_REALTIME_URL } from '@/constants';
import { io, Socket } from 'socket.io-client'
import { create } from 'zustand'
import { useAuthStore } from './auth.store';

interface SocketStore {
    socket: Socket | null,
    isConnected: boolean
    initSocket: () => void
    disconnectSocket: () => void
}

export const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,
    isConnected: false,
    initSocket: () => {
        const token = useAuthStore.getState().token;
        const socket = io(BASE_API_REALTIME_URL, {
            auth: {
                token: token
            },
            transports: ['websocket'],
            autoConnect: false,
        });
        socket.on('connect', () => {
            console.log("Socket connected Successfully " + socket.id);
            set({ isConnected: true })});
        socket.on('disconnect', () => set({ isConnected: false }));

        socket.connect();
        set({ socket });
    },
    disconnectSocket: () => {
        const { socket } = get();
        socket?.disconnect();
        set({ socket: null, isConnected: false });
    },
}))