import { Message } from "@/model/User";


export interface ApiResponse{
    sucess:boolean;
    message:string;
    isAccesptiongMessages?:boolean;
    messages?:Array<Message>;
}