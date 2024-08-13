import { collection, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "./firebase-config";

export async function getUserDocID(): Promise<string | null> {
    try {
        const userUid = FIREBASE_AUTH.currentUser?.uid;
      
        //Query the users collection for a document with the matching UID
        const q = query(collection(FIRESTORE_DB, "users"), where("uid", "==", userUid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            //Assuming there is exactly one document per UID
            const docId: string = querySnapshot.docs[0].id.toString();
            return docId;
        } else {
            console.error("No matching user document found.");
            return null;
        }
    } catch (error) {
      console.error("Error retrieving user document: ", error);
      return null;
    }
}