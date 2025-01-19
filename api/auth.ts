import { QuerySnapshot } from 'firebase-admin/firestore';
import {firestore} from './db.js';
const usersCollection= firestore.collection("users");

export default async function auth(req:any,res:any){
    if(req.method !== "POST"){
        res.status(405).json({
            message: "Method not allowed"
        })
    }
    const {username} = req.body;
    usersCollection
        .where("username","==", username)
        .get()
        .then((searchResponse: QuerySnapshot)=>{
            if(searchResponse.empty){
                res.status(404).json({
                    message: "User not found"
                });
            }else{
                res.json({
                    id: searchResponse.docs[0].id,
                    name: searchResponse.docs[0].data().name
                })
            }
        })
}