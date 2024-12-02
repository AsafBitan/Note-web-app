import { useEffect, useState } from "react";
import axios from "axios";
import Note from "./note";
import {NOTES_PER_PAGE, NOTES_URL } from '../constants'
import { jwtDecode } from "jwt-decode";


interface DecodedToken {
  name: string;
  email: string;
}

const useServerCallesAndNote = () => {
    const [notes, setNotes] = useState<Note[]>([]);  // Setting the notes that are going to show.
    const [activePage, setActivePage] = useState<number>(1);  // Setting the active page we are going to be on.
    const [totalPages, setTotalPages] = useState<number>(1);  // Setting the total pages we will have
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<DecodedToken | null>(null);

    const HTTPGet = async () => {
      try{
        const response = await axios.get(`${NOTES_URL}/notes`)
        if (!response.data){
          throw new Error("No data found");
        }else{
          setNotes(response.data);
        }
      }catch(error) {
        console.log(error);
      }
    };
  
    const getTotalPages = async () => {
      try{
        console.log("Requesting total notes...");
        const response = await axios.get(`${NOTES_URL}/notes/total_notes`)
        if (!response.data){
          throw new Error("No data found");
        }else{
          setTotalPages(Math.ceil(response.data / NOTES_PER_PAGE));
        }
      }catch(error) {
        console.error("Error getting total pages:", error);
      }
    };
  
    const getPage = async (page: number, notes_per_page: number) => {
      try{
        const response = await axios.get(`${NOTES_URL}/notes/page`, {
          params: {
            _page: page,
            _per_page: notes_per_page,
          },
        })
        if (!response.data) {
          throw new Error("No data found");
        }else{
          setNotes(response.data)
          console.log(response.data);
        }
      }catch(error) {
        console.log(error)
      }
    };
  
    const get = async (id: number) => {
      try{
        const response = await axios.get(`${NOTES_URL}/notes/${id}`)
        if (!response.data){
          throw new Error("No data found");
        }else{
          setNotes(response.data);
        }
      }catch(error) {
        console.log(error);
      }
    };
  
    const postNote = async (content: string) => {
      try{
        if (!user) {
          alert("You must be logged in to add a note!");
          return;
        }
        console.log({ user, content });
        const response = await axios.post(`${NOTES_URL}/notes`, {
          name: user.name,
          email: user.email,
          content
        })
        console.log(response);
        if (!response.data){
          throw new Error("No data found");
        } else if (activePage === totalPages && notes.length < NOTES_PER_PAGE){
          setNotes([...notes, response.data])
          console.log(response.data);

        } else if (activePage === totalPages && notes.length === NOTES_PER_PAGE){
          const newTotalPages = totalPages +1;
          setTotalPages(newTotalPages);
          console.log(response.data);
        } else {
          console.log(response.data);
          getTotalPages();
        }
      }catch(error) {
        console.log(error);
      }
    };

  
    const putNote = async (id: number, content: string) => {
      try{
        const response = await axios.put(`${NOTES_URL}/notes/${id}`, {
          content
        })
        if (!response.data){
          throw new Error("No data found");
        }else{
          setNotes((prevNotes) => {
            const updatedNotes = prevNotes.map((note) => (note.id === id ? response.data : note));
            console.log("Updated notes after put:", updatedNotes);
            return updatedNotes;
          });
        }
      }catch(error) {
        console.log(error);
      }
    };
  
    const deleteNote = async (id: number) => {
      try{
        const response = await axios.delete(`${NOTES_URL}/notes/${id}`)
        if (response.status === 204){
          console.log("Delete response:", response);
          const updatedNotes = notes.filter((note) => note.id !== id);
          setNotes(updatedNotes);
          if (updatedNotes.length === 0 && activePage > 1) {
            const prevPage = activePage - 1;
            setActivePage(prevPage);
            getTotalPages();
            getPage(activePage, NOTES_PER_PAGE);
          }else{
            getTotalPages();
            getPage(activePage, NOTES_PER_PAGE);
          }
        } else {
          throw new Error("No data found");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const addNewUser = async (name: string, email: string, username: string, password: string) => {
      try {
        const response = await axios.post(`${NOTES_URL}/users/`, {
          name,
          email,
          username,
          password
        })

        if (!response){
          throw new Error("No User data found");
        }

        console.log("User created successfully:", response.data);

      }catch (error){
        console.log(error);
      }
    }
    
    const login = async (username: string, password: string) => {
      try {
        const response = await axios.post(`${NOTES_URL}/login`, {
          username,
          password
        })

        const { token } = response.data;
  
        setToken(token);

        localStorage.setItem('token', token);

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const decodedUser = jwtDecode<DecodedToken>(token);
        setUser(decodedUser); 
      console.log('Logged in successfully');
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  }

    return { notes, setNotes, activePage, setActivePage, totalPages, setTotalPages,
       HTTPGet, get, getPage, getTotalPages, postNote, putNote, deleteNote, addNewUser,
        login, logout, token, setToken, user, setUser};
  };
  export default useServerCallesAndNote;