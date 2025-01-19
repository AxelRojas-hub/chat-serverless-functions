import { CollectionReference, DocumentSnapshot, QuerySnapshot } from "firebase-admin/firestore";
import { firestore } from "./db.js";
const usersCollection= firestore.collection("users");

export default async function signup(req: any, res:any) {
    if(req.method !== "POST"){
        res.status(405).json({message: "Method not allowed"});
        return;
    }
    const username = req.body.username;
    const name = req.body.name;
    // Parametros del where -> campo, operador, valor
    usersCollection
        .where("username","==", username)
        .get()
        .then((searchResponse: QuerySnapshot )=>{
            //Si no hay ningun usuario con ese username, se da de alta en la bd y devuelve un id
            if(searchResponse.empty){
                const newUser = {
                    username: username,
                    name: name,
                }
                usersCollection
                    .add(newUser)
                    .then((newUserRef: DocumentSnapshot)=>{
                        res.json({
                            id: newUserRef.id,
                            new:true
                        });
                    })
            }else{
                usersCollection.doc(searchResponse.docs[0].id).get().then((userDoc: DocumentSnapshot)=>{
                    //Si el nombre es distinto, actualiza el nombre
                    if(userDoc.data()!.name!= name){
                        userDoc.ref.update({
                            name: name
                        }).then(()=>{
                            res.status(200).json({
                                id: searchResponse.docs[0].id,
                                message: "User updated"
                            })
                        })
                    }else{
                        //searchResponse es un array
                        res.status(200).json({
                            id: searchResponse.docs[0].id,
                            message: "Username already exists"
                        });
                    }
                })
                
            }
        });
}