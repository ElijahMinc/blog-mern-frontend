
export interface RoomJoinInterface{
  userName: string
  roomId: string
  userAvatar: string | null
} 


export interface MessageInterface{
  userName: string
  text: string
  
  userAvatar: string
  userId: string
  roomId: string
} 


export interface UserInterface{
  userName: string
  userAvatar: string | null

}

export interface ServerToClientEvents {
   ['ROOM:JOINED']:  (allMessagesByRoomId: MessageInterface[]) => void;
   ['USERS:SET']: (users: UserInterface[]) => void;
   ['NEW:MESSAGE']: (messageData: MessageInterface[]) => void
   ['ROOM:LEAVE']: (leaveName: UserInterface) => void
   ['MESSAGE:WRITING']: (data: { userName: UserInterface['userName']}) => void

 }
 
 export interface ClientToServerEvents {
  ['ROOM:JOIN']: (connectData: RoomJoinInterface) => void
  ['NEW:MESSAGE']: (messageData: MessageInterface) => void
  ['MESSAGE:WRITING']: (data: { userName: UserInterface['userName'], roomId: RoomJoinInterface['roomId']}) => void
 }
 
 export interface InterServerEvents {}
 
 export interface SocketData {}