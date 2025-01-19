import { DocumentSnapshot } from 'firebase-admin/firestore';
import {firestore,rtdb} from '../../db.js';
const roomsCollection= firestore.collection("rooms");
export default async function messages(req:any,res:any){
    if(req.method !== "POST"){
        // error
        res.status(405).json({
            message: "Method not allowed"
        })
    }

    const {from, text} = req.body;
    const {roomId} = req.query;
    const newMessage = {
        from: from,
        text: text,
        timestamp: Date.now()
    }
    roomsCollection.doc(roomId).get().then((roomDoc: DocumentSnapshot)=>{
        if(roomDoc.exists){            
            const roomRTDB = rtdb.ref(`rooms/${roomDoc.data()!.roomID}`);
            roomRTDB.child("messages").push(newMessage).then(()=>{
                res.json({
                    message: "Message sent"
                })
            })
        }else{
            res.status(404).json({
                message: "Room not found"
            })
        }
    })
}