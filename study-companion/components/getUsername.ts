import { FIRESTORE_DB } from '../firebase/firebase-config';
import { getDoc, doc, query, collection, where, getDocs } from 'firebase/firestore';

export const getUsernameByUID = async (uid: string): Promise<string | null> => {
    try {
        const usersCollection = collection(FIRESTORE_DB, 'users');
        const q = query(usersCollection, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          return userData?.username || null;
        } else {
          console.log('No matching documents!');
          return null;
        }
      } catch (error) {
        console.error('Error getting document:', error);
        return null;
      }
};