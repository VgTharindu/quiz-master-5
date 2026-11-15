// Single source of truth for the localStorage key shared by App and StudentApp.
const KEY = "me";

export const loadStudent = () => JSON.parse(localStorage.getItem(KEY) || "null");
export const saveStudent = (me) => localStorage.setItem(KEY, JSON.stringify(me));
export const clearStudent = () => localStorage.removeItem(KEY);
