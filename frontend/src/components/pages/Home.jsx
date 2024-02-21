
import React, { useEffect, useState } from 'react'
import '../styles/Home.css';

function Home() {

    const [library,setlibrary] = useState([]);
    const [filtertext,setfiltertext] = useState("")
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [category,setcategory] = useState(" ");
    const [subcategory,setsubcategory] = useState(" ");
    const [finalarray,setfinalarray] = useState([]);
    const [currentpage,setcurrentpage] = useState(1);
    const [heading,setheading] = useState("All");
    const categoryarray = ["Author","Genre"];
    
    
    //fetchbooks

    const fetchbook = async() => {
        let books = await fetch("http://localhost:8000/");
        let booksres = await books.json();
        setlibrary(booksres)
        setFilteredBooks(booksres);
    }

    useEffect(()=>{
        fetchbook()
    },[])


    //search the book
    const filterBooks = () => {
      const result = library.filter((lib) => {
        const values = Object.values(lib).join(' ').toLowerCase();
        return values.includes(filtertext.toLowerCase());
      });
      setFilteredBooks(result);
    };

    useEffect(() => {
      filterBooks();
    }, [filtertext]);

    //filterby author and genre
    const filterBycategory = () => {
      const result = library.filter((lib) => {
        const values = Object.values(lib).join(' ').toLowerCase();
        return values.includes(subcategory.toLowerCase());
      });
      setFilteredBooks(result);
    }

    const authourarray = [];
    const journerarray = [];

    library.map((lib)=>{
      authourarray.push(lib.author);
      journerarray.push(lib.subject);

    })

    function populatefilters(){
      if(category==="Author")
      {
        setfinalarray(authourarray);
      }
      else if(category === "Genre")
      {
        setfinalarray(journerarray);
        
      }
      
    }

    useEffect(() => {
      populatefilters()
    }, [category]);

    useEffect(() => {
      filterBycategory()
    }, [subcategory]);


    //clear the filter
    const clear = () => {
      setfinalarray([]);
      setcategory(" ");
      setsubcategory("");
      setfiltertext("");
      setheading("All");
    }

    //pagination

    const totalItems  = library.length;
    const itemsPerPage = 5;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    useEffect(() => {
      setcurrentpage(1);
    }, [filteredBooks, itemsPerPage]);

    // const displayedBooks = filteredBooks.slice(
    //   (currentpage - 1) * itemsPerPage,
    //   currentpage * itemsPerPage
    // );



  return (
    <div className="lib-container">
      <h4 style={{fontWeight:"600"}}>LIBRARY MANAGEMENT SYSTEM</h4>
    <div className="tablediv-container">
    <div className='search-container'>
      <input type='search' placeholder='search the book' value={filtertext} onChange={(e)=>setfiltertext(e.target.value)}></input>
      <select onChange={(e)=>setcategory(e.target.value)} className='select1' value={category}>
        <option value="">{heading}</option>
        {categoryarray.map((cat,index) => (
            <option value={cat} key={index}>{cat}</option>
            ))}
      </select>
      <select className='select2' onChange={(e)=>setsubcategory(e.target.value)}>
            <option value="">Select {category}</option>
            {finalarray.map((subcat,index) => (
            <option value={subcat} key={index}>{subcat}</option>
            ))}
      </select>
      <button type="button" className="btn btn-primary" style={{width:"100px",height:"40px",borderRadius:"9px"}} onClick={()=>clear()}>clear</button>
    </div>
    <div className='table-container'>
     <table className="lib-table" >
        <thead>
            <tr>
                <th>BOOK ID</th>
                <th>TITLE</th>
                <th>AUTHOR</th>
                <th>GENRE</th>
                <th>PUBLISH DATE</th>
            </tr>
        </thead>
        <tbody>
             {
              filteredBooks.slice((currentpage - 1) * itemsPerPage, currentpage * itemsPerPage).map(lib => (
                <tr key={lib.id}>
                    <td>{lib.id}</td>
                    <td>{lib.title}</td>
                    <td>{lib.author}</td>
                    <td>{lib.subject}</td>
                    <td>{new Date(lib.publishdate).toLocaleDateString()}</td>
                </tr>
             ))
             }
        </tbody>
    </table>
    </div>
      <div className='pagination-div'>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button key={page} onClick={() => setcurrentpage(page)}>
            {page}
          </button>
        ))}
      </div>
    </div>
    </div>
  )
}

export default Home
