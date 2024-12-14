import { create } from 'zustand';
import { axiosInstance } from "../lib/axios.js";
import toast from 'react-hot-toast';
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,


    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    // if user refresh the page we will need to check if the user authenticated or not so will create this fucntion

    checkAuth: async () => {
        try {

            const res = await axiosInstance.get("/auth/check");

            set({ authUser: res.data });
            get().connectSocket();

        } catch (error) {
            console.log('Error in checkAuth:', error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // signup function

    signup: async (data) => {

        set({ isSigningUp: true });

        try {

            const res = await axiosInstance.post('/auth/signup', data);
            set({ authUser: res.data });
            toast.success("Account Created Successfully");
            get().connectSocket();

        } catch (error) {
            toast.error(error.reponse.data.message);


        } finally {
            set({ isSigningUp: false });
        }
    },

    // logout function

    logout: async () => {
        try {

            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success("Logged out sucessfully");
            get().disconnectSocket();

        } catch (error) {
            toast.error(error.reponse.data.message);
        }
    },


    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            // here we will connect to the SocketIO
            get().connectSocket();


        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },


    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        })
    },



    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));
