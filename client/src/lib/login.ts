import { GoogleAuthProvider, indexedDBLocalPersistence, setPersistence, signInWithPopup, signOut, User } from "firebase/auth";
import { auth, getSessionHeaders, sessionReadySubject, userSubject } from "../core/session";
import { AppUser } from "../entities/app-user";

export async function authWithGoogle(): Promise<AppUser | undefined> {
    await setPersistence(auth, indexedDBLocalPersistence); // Remove for sensitive Data applications
    let oauth, credential = null;
    try {
        credential = await signInWithPopup(auth, new GoogleAuthProvider());
        oauth = GoogleAuthProvider.credentialFromResult(credential);
        userSubject.next(await getAppUser(credential.user));
    } catch (error: any) {
        console.warn(error);
        oauth = GoogleAuthProvider.credentialFromError(error);
    }
    return userSubject.getValue();
}

export async function restoreSession() {
    await setPersistence(auth, indexedDBLocalPersistence); // Remove for sensitive Data applications
    if(auth.currentUser){
        userSubject.next(await getAppUser(auth.currentUser));
    }
    sessionReadySubject.next(true);
    return userSubject.getValue();
}

export async function logOut() {
    await signOut(auth);
    userSubject.next(undefined);
    return userSubject.getValue();
}

async function getAppUser(user: User): Promise<AppUser> {
    const response = await fetch(`/api/user`, {
        method: 'POST',
        body: JSON.stringify({ uid: user.uid, name: user.displayName, email: user.email }),
        headers: { "Content-Type": "application/json", ...await getSessionHeaders()}
    });
    return response.status === 200 ? response.json() : null;
}