
import { useEffect, useState, useMemo } from 'react';
import './App.css';
import Auth from './components/auth';
import { db,auth, storage } from './config/firebase';
import { getDocs, collection, addDoc, deleteDoc, updateDoc,doc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

function App() {
  const [movieList, setMovieList] = useState([]);

  //new movie states
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  //update ttitle state
  const [updatedTitle, setUpdatedTitle] = useState("");

  //file upload state
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = useMemo(() => collection(db, "movies"), []);
  
  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };
  
  const deleteMovie = async (id)=>{
    try {
       const movieDoc = doc(db,"movies",id);
      await deleteDoc(movieDoc);
      getMovieList();
    } catch (error) {
      console.error(error);
    }
  }

  const updateMovieTitl =  async (id, ) =>{
    try {
      const movieDoc = doc(db,"movies",id);
     await updateDoc(movieDoc, {title: updatedTitle});
     getMovieList();
   } catch (error) {
     console.error(error);
   }
  }

  useEffect(() => {
   
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        getAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid, //? su tu za slucaj da korisnik nije prijavljen
      });

      getMovieList();
    } catch (err) {
      console.error(err);
    }
  }

  const uploadFile = async () =>{
    if(!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try{
      await uploadBytes(filesFolderRef, fileUpload);
    }catch(err){
      console.error(err);
    }
  }
  return (
    <div className="App">
      <Auth />
      <div>
        <input
          placeholder='movie title'
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder='release date'
          type='number'
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input type="checkbox"
          checked={isNewMovieOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}
        />
        <label>Received an oscar</label>
        <button onClick={onSubmitMovie}>Submit movie</button>
      </div>
      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{ color: movie.getAnOscar ? "green" : "red" }}>{movie.title}</h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={()=>deleteMovie(movie.id)}>Delete Movie</button>
         
            <input 
              placeholder='new title...' 
              onChange={(e)=>setUpdatedTitle(e.target.value)} />

            <button onClick={()=>updateMovieTitl(movie.id)}>Update title</button>
          </div>
        ))}
        <div>
          <input type="file" onChange={(e)=>setFileUpload(e.target.files[0])} />
          <button onClick={uploadFile}>Upload File</button>
        </div>
      </div>
    </div>
  );
}

export default App;
