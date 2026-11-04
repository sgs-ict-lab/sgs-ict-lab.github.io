import {auth,db,configured,onAuthStateChanged,doc,getDoc,setDoc,serverTimestamp} from './firebase-client.js';
let user=null,saving=false,pending=false;
const allowed=['q1','q2','q3','q4','q5','q6','q7','machine','robot','project'];
function localPoints(){try{return JSON.parse(localStorage.getItem('sgsCourseProgress')||'[]').filter(k=>allowed.includes(k))}catch{return []}}
async function save(){if(!user||saving)return void(pending=true);saving=true;try{const ref=doc(db,'progress',user.uid),s=await getDoc(ref);let all=[...new Set([...(s.exists()?s.data().checkpoints||[]:[]),...localPoints()])].filter(x=>allowed.includes(x));await setDoc(ref,{studentId:user.uid,checkpoints:all,quizResults:s.exists()?s.data().quizResults||{}:{},updatedAt:serverTimestamp()},{merge:true});let previous=localPoints();if(all.length>previous.length){localStorage.setItem('sgsCourseProgress',JSON.stringify(all));location.reload()}}catch(e){console.warn('Progress sync is unavailable:',e)}finally{saving=false;if(pending){pending=false;save()}}}
if(configured)onAuthStateChanged(auth,u=>{user=u?.emailVerified?u:null;if(user)save()});
window.addEventListener('sgs-course-progress',()=>{if(user)save()});
