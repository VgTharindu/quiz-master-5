// ළමයාගේ නම සහ පන්තිය browser එකේ (localStorage) "me" key එකේ සුරැකෙනවා.
// App.jsx සහ StudentApp.jsx දෙකම මේ functions භාවිත කරනවා, ඒ නිසා key එක එක තැනක විතරයි
const KEY = "me";

export const loadStudent = () => JSON.parse(localStorage.getItem(KEY) || "null");
export const saveStudent = (me) => localStorage.setItem(KEY, JSON.stringify(me));
export const clearStudent = () => localStorage.removeItem(KEY);
