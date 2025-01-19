import { DocumentSnapshot } from "firebase-admin/firestore";
import {firestore,rtdb} from "./db.js";
import {randomUUID} from "crypto";
const roomsCollection= firestore.collection("rooms");
const usersCollection= firestore.collection("users");

export default async function rooms(req: any, res: any) {
    if(req.method !== "POST"){
        res.status(405).json({
            message: "Method not allowed"
        })
    }
    const {userId} = req.body;
    usersCollection.doc(userId).get().then((userDoc: DocumentSnapshot)=>{
        if(userDoc.exists){
            //Si existe el id del usuario crea un room en la rtdb
            const newRoom={
                id: randomUUID(),
                owner: userId,
                messages: [],
            }
            const roomRef=rtdb.ref(`/rooms/${newRoom.id}`); 
            roomRef.set(newRoom).then(()=>{
                const roomFullID = roomRef.key;
                const roomID = roomFullID!.split('-')[0].slice(0,5);
                roomsCollection.doc(roomID).set({
                    owner: userId,
                    roomID: roomFullID,
                    messages: []
                }).then(()=>{
                    res.json({
                        roomID: roomID
                    })
                });
            })
        }else{
            res.status(401).json({
                message: "User not authorized"
            })
        }
    })
}