"use client";
import styles from "../src/app/page.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../src/app/components/navigationBar";
import AddNewNoteInput from "../src/app/components/addNewNote";
import useServerCallesAndNote from "../src/app/components/serverCallesAndNote";
import Note from "../src/app/components/note";
import CreateUserForm from "../src/app/components/createUserForm";
import {NOTES_PER_PAGE, PAGES_TO_CACHE, NOTES_URL } from '../src/app/constants'
import LoginForm from "../src/app/components/loginForm"; 

type HomeProps = {
  initialNotes: Note[];
  initialTotalPages: number;
  propCache: Cache;
}

interface PageNotes {
  page: number;
  notes: Note[];
}

type Cache = PageNotes[];

export async function getStaticProps() {
  try {
    const cache: Cache = [];
    for (let page = 1; page <= PAGES_TO_CACHE; page++){
      const notesResponsePerPage = await axios.get(`${NOTES_URL}/notes/page`, {
        params: {
          _page: page,
          _per_page: NOTES_PER_PAGE, 
        },
      });
      cache.push({ page, notes: notesResponsePerPage.data })
    }

    const initialTotalPagesResponse = await axios.get(`${NOTES_URL}/notes/total_notes`);

    const initialNotes = cache.find(c => c.page === 1)?.notes || [];
    const initialTotalPages = Math.ceil(initialTotalPagesResponse.data / NOTES_PER_PAGE);

    return {
      props: {
        initialNotes,
        initialTotalPages,
        propCache: cache,
      },
      revalidate: 60, 
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        initialNotes: [],
        initialTotalPages: 0,
        propCache: []
      },
      revalidate: 60,
    };
  }
}

const Home: React.FC<HomeProps> = ({ initialNotes,initialTotalPages, propCache }) => {
  const { notes, setNotes, activePage, setActivePage, totalPages, setTotalPages, getPage, getTotalPages, postNote, putNote, deleteNote, addNewUser, login, logout, token, user } = useServerCallesAndNote()
  const [showAddNewNote, setShowAddNewNote] = useState(false);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState<Cache>(propCache);
  const [pagesInCache, setPagesInCache] = useState([1,2,3,4,5]);
  
  const changeTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme === 'light' ? styles.lightTheme : styles.darkTheme;
  }

  useEffect(() => {
    // Load initial data only once
    setTotalPages(initialTotalPages);
    setNotes(initialNotes);
    
  }, [initialTotalPages, initialNotes]);

  useEffect(() => {
    // Fetch data for other pages only when activePage changes
    const currentPages = currentFivePages(totalPages, activePage);
    const getData = async () => {
      setLoading(true);
      console.log("The cache:");
      console.log(cache);
      await getTotalPages();
      if (activePage === 1) {
        setNotes(initialNotes);
        if (!arraysEqual(currentPages, pagesInCache)){
          updateCache(activePage, currentPages);
        }
      } else {
        const cachedNotes = cache.find((c) => c.page === activePage);
        if (cachedNotes) {
          setNotes(cachedNotes.notes);
          if (!arraysEqual(currentPages, pagesInCache)){
            updateCache(activePage, currentPages);
          }
          console.log("The page is in cache");
        } else {
          console.log("The page isnt in cache");
          await getPage(activePage, NOTES_PER_PAGE);
          updateCache(activePage, currentPages);
        }
      }
      setLoading(false);
      console.log("The cache:");
      console.log(cache);
    }
    getData();
  }, [activePage, NOTES_PER_PAGE]);

  useEffect(() => {
    // Load again when theme changes
    document.body.className = theme === 'light' ? styles.lightTheme : styles.darkTheme;
  }, [theme])

  const updateCache = async (page: number, currentPages: number[]) => {  
    // Fetch notes for pages not already in the cache
    await Promise.all(
      currentPages.map(async (p) => {
        if (!cache.find((c) => c.page === p)) {
          try {
            const response = await axios.get(`${NOTES_URL}/notes/page`, {
              params: {
                _page: page,
                _per_page: NOTES_PER_PAGE, 
              },
            });
            setCache((prevCache) => {
              const updatedCache = prevCache.filter((c) =>
                currentPages.includes(c.page)
              );
              return [...updatedCache, { page: p, notes: response.data }];
            });
            setPagesInCache(currentPages);
          } catch (error) {
            console.error(`Error fetching page ${p}:`, error);
          }
        }
      })
    );
  };

  const arraysEqual = (a: number[], b: number[]) => {
    if (a.length !== b.length){
      return false;
    }
    return a.every((value, index) => value === b[index])
  }

  const handleAddNewNote = async (content: string) => {
    if (!user) {
      alert("You must be logged in to add a note!");
      return;
    }
    content == "" ? alert("Content is Empty!") :
    await postNote(content);
    await getPage(activePage, NOTES_PER_PAGE);
  };

  const handleAddNewNoteCancel = () => {
    setShowAddNewNote(false);
  };

  const handleSubmitNewUser = async (name: string, email: string, username: string, password: string) => {
    await addNewUser(name, email, username, password);
  };
  
  const handleLogin = async (username: string, password: string) => {
    try {
      await login(username, password); 
    } catch (error) {
      console.error('Login failed:', error);
    }  
  };
   
  const handleLogout = async() => {
    await logout();
  }
  
  const currentFivePages = (totalPages: number, activePage: number) => {
    // Deciding what buttons to other pages to show depending on the total pages and the active page
    if (activePage <= 2 || totalPages <= 5) {
      return Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);
    } else if (activePage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      return [
        activePage - 2,
        activePage - 1,
        activePage,
        activePage + 1,
        activePage + 2,
      ];
    }
  };

  const pages = currentFivePages(totalPages, activePage);

  return (
    <main className={`${styles.themeContainer} ${theme === 'light' ? styles.lightTheme : styles.darkTheme}`}>
      {!user && (
        <div className={styles.authContainer}>
          <CreateUserForm onSubmit={handleSubmitNewUser} />
          <LoginForm onSubmit={handleLogin} />
        </div>
      )}
      {user && (
        <>
          <div>
            <button name="logout" className="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          {!showAddNewNote && (
            <button name="add_new_note" className={styles.button} onClick={() => setShowAddNewNote(true)}>
              Add new note
            </button>
          )}
          {showAddNewNote && (
            <AddNewNoteInput onAddNote={handleAddNewNote} onCancel={handleAddNewNoteCancel}/>
          )}
        </>
      )}
      {loading ? ( 
        <div>Loading...</div>
      ) : (
        <div className={styles.description}>
          {notes?.map((note) => (
            <Note 
              note={note} 
              key={note.id}
              putNote={putNote}
              deleteNote={deleteNote} 
              user={user?.name  || ""}
            />
          ))}
        </div>
      )}
      {/* NavBar will handle all the navigation and its layout */}
      <NavBar
        pages={pages}
        activePage={activePage}
        totalPages={totalPages}
        setActivePage={setActivePage}
      />
      <button className={styles.themeButton} name="change_theme" onClick={changeTheme}>
        Change Theme
      </button>
    </main>
  );
};

export default Home;


