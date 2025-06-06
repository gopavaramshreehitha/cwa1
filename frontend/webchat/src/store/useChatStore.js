import {create} from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios";
import { Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) => ({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,


    getUsers: async () => {
        set({isUsersLoading:true});
        try {
            const res= await axiosInstance.get("/messages/users");
            set({users: res.data});
            console.log(users);

        } catch (error) {
            const message=error?.response?.data?.message||error.message||"something went wrong";
            toast.error(message);
        }finally{
            set({isUsersLoading:false});
        }
    },


    getMessages : async (userId) => {
        if(!userId) return;
        set({isMessagesLoading:true});
        try {
            
            const res=await axiosInstance.get(`/messages/${userId}`);
            set({messages:res.data});
            
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading:false});
        }
    },

    sendMessage: async (messageData) =>{
        const {selectedUser,messages} =get()
        try {
            const res=await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            console.log(res.data);
            set({messages:[...messages,res.data]})
        } catch (error) {
            const message=error?.response?.data?.message||"error";
            toast.error(message)
        }
    },

    subscribeToMessages : () =>{
        const {selectedUser}=get();
        if(!selectedUser) return;

        const socket=useAuthStore.getState().socket;

        // optimse later


        socket.on("newMessage", (newMessage) => {

            const isMessageSentFromSelectedUser =newMessage.senderId === selectedUser._id;

            if(!isMessageSentFromSelectedUser) return;


            set({
                messages:[...get().messages,newMessage],
            })
        });
    },


    unsubscribeFromMessages: () => {

        const socket =useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => {
       
        set({selectedUser});
    },
}))