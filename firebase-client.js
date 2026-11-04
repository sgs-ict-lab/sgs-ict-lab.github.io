import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile, reload, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, collection, query, where, onSnapshot, getDocs, serverTimestamp, orderBy, limit, runTransaction, deleteField } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import {getStorage,ref as storageRef,uploadBytes,getDownloadURL} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js';
import { firebaseConfig, configured } from './firebase-config.js';
let app=null,auth=null,db=null,storage=null;
if(configured){app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);if(firebaseConfig.storageBucket && !firebaseConfig.storageBucket.startsWith('PASTE_'))storage=getStorage(app);}
export {auth,db,storage,configured,GoogleAuthProvider,signInWithPopup,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendEmailVerification,sendPasswordResetEmail,updateProfile,reload,signOut,onAuthStateChanged,doc,getDoc,setDoc,updateDoc,addDoc,collection,query,where,onSnapshot,getDocs,serverTimestamp,orderBy,limit,runTransaction,deleteField,storageRef,uploadBytes,getDownloadURL};
export function friendlyError(e){const c=e?.code||'';const map={
 'auth/email-already-in-use':'This email is already registered. Try logging in.',
 'auth/invalid-email':'Enter a valid email address.',
 'auth/invalid-credential':'The email or password is incorrect.',
 'auth/weak-password':'Choose a longer password, preferably 12 characters or more.',
 'auth/popup-closed-by-user':'Google sign-in was cancelled.',
 'auth/popup-blocked':'Your browser blocked Google sign-in. Allow popups and retry.',
 'auth/unauthorized-domain':'Add sgs-ict-lab.github.io in Firebase Authentication → Authorized domains.',
 'auth/operation-not-allowed':'This sign-in method is not enabled in Firebase Authentication.',
 'permission-denied':'Access denied by database rules. Check email verification and staff permissions.',
 'storage/unauthorized':'Your account is not allowed to upload this picture.',
 'storage/unknown':'Photo upload could not finish. Check Firebase Storage setup.',
 'failed-precondition':'A Firestore index may be needed. Follow the Firebase Console error link.'};return map[c]||e?.message||'Something went wrong. Please try again.';}
export async function ensureProfile(user,extras={}){
 if(!db||!user?.emailVerified)throw new Error('Verify your email before using the classroom.');
 const ref=doc(db,'users',user.uid),s=await getDoc(ref);
 if(s.exists())return s.data();
 const fullName=(extras.name||user.displayName||user.email?.split('@')[0]||'Student').trim().slice(0,80);
 const profile={name:fullName,displayName:(extras.displayName||fullName).trim().slice(0,36),username:'',email:user.email,role:'student',avatarId:(['boy','girl','astronaut','coder','robot','fox'].includes(extras.avatarId)?extras.avatarId:'astronaut'),avatarPath:'',className:(extras.className||'').trim().slice(0,50),roll:(extras.roll||'').trim().slice(0,25),createdAt:serverTimestamp(),updatedAt:serverTimestamp()};
 await setDoc(ref,profile);return profile;
}
export const $=(sel,root=document)=>root.querySelector(sel);
export const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
export function el(tag,cls,text){const o=document.createElement(tag);if(cls)o.className=cls;if(text!==undefined)o.textContent=String(text);return o;}
export function niceTime(t){let d=t?.toDate?.()||null;return d?new Intl.DateTimeFormat('en',{dateStyle:'medium',timeStyle:'short'}).format(d):'Just now';}
export const avatarIds=['boy','girl','astronaut','coder','robot','fox'];
export const avatarLabels=['Boy','Girl','Astronaut','Coder','Robot','Pixel Fox'];
export function avatarSrc(data){return data?.avatarPath && storage?null:`avatars/${avatarIds.includes(data?.avatarId)?data.avatarId:'astronaut'}.svg`;}
export function drawAvatarPicker(host,current,change){host.replaceChildren();avatarIds.forEach((id,i)=>{const btn=el('button','avatar-option');btn.type='button';btn.setAttribute('aria-pressed',String(id===current));const img=el('img');img.src=`avatars/${id}.svg`;img.alt='';btn.append(img,el('span','',avatarLabels[i]));btn.onclick=()=>{host.querySelectorAll('.avatar-option').forEach(n=>n.setAttribute('aria-pressed','false'));btn.setAttribute('aria-pressed','true');change(id);};host.append(btn);});}
export async function findAvatarURL(profile){if(profile?.avatarPath&&storage){try{return await getDownloadURL(storageRef(storage,profile.avatarPath))}catch{}}return avatarSrc(profile);}
