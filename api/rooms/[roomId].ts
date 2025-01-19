import { DocumentSnapshot } from "firebase-admin/firestore";
import {firestore} from "../db.js";
const roomsCollection= firestore.collection("rooms");
const usersCollection= firestore.collection("users");

export default async function rooms (req:any,res:any){
    //En vercel, los parametros como roomId de la url se obtienen de esta manera
    const {userId,roomId} = req.query;
    // const {roomId} = req.params;
    //Checkea si el usuario existe, y si existe el room solicitado
    usersCollection.doc(userId!.toString()).get().then((userDoc: DocumentSnapshot)=>{
        if(userDoc.exists){
            roomsCollection.doc(roomId).get().then((roomDoc: DocumentSnapshot)=>{
                    if(roomDoc.exists){
                        //Devuelve el id completo de la realtime database
                        res.json({
                            roomIdRTDB: roomDoc.data()!.roomID,
                        })
                    }else{
                    res.status(404).json({
                        message: "Room not found"
                    })
                }
            })
        }else{
            res.status(401).json({
                message: "User not authorized"
            })
        }
    })  
}