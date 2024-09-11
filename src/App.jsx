import React, { useState, useEffect } from "react";
import axios from "axios";

// Installed libraries--->json server(mock db),axios(fetching data from mock db and perform crud operation)

const App = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

  // Get Data
  useEffect(() => {
    // getting data from mock db (db.json) using axios library and stored inside the setPosts function
    // axios returns promises --->promise returns 2 things one is resolved data & another one if something wrong its throws error using catch to getting those errors
    axios
      .get("http://localhost:3000/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log("Error occur in getting post", err));
  }, []);

  // Post the New Data

  const addPost = () => {
    axios
      .post("http://localhost:3000/posts", newPost)
      .then((res) => {
        setPosts(...posts, res.data);
        setNewPost({ title: "", content: "" });
      })
      .catch((err) => {
        console.log("Error occurs in Posting the data", err);
      });
  };

  //Updated the Data PUT-method

  const updatePost = () => {
    axios
      .put(`http://localhost:3000/posts/${currentPostId}`, newPost)
      .then((res) => {
        setPosts(
          posts.map((post) => (post.id === currentPostId ? res.data : post))
        );
        setNewPost({ title: "", content: "" });
        setIsUpdating(false);
        setCurrentPostId(null);
      })
      .catch((err) => console.log("something wrong in update data ", err));
  };

  // Delete Post
  // filter helps to show only items post id and delete id not equal if id is equal that item will removed

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3000/posts/${id}`)
      .then(() => {
        setPosts(posts.filter((post) => post.id !== id));
      })
      .catch((err) => console.log("Error occurs in delete process ", err));
  };

  // Function trigger when clicking Add Post
  const handleSubmit = () => {
    isUpdating ? updatePost() : addPost();
  };

  // Fill form with post data when clicking (update button)

  const handleEditClick = (post) => {
    setNewPost({ title: post.title, content: post.content });
    setIsUpdating(true);
    setCurrentPostId(post.id);
  };

  return (
    <>
      <div className="container  mx-auto">
        <nav className="text-2xl text-white bg-green-600 text-center p-3">
          <a href="#"> CRUD Post Manager</a>
        </nav>
        <form className="p-5 space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4 ">
            <input
              type="text"
              name="title"
              id="input-title"
              placeholder="Title"
              className="sm:w-full lg:w-1/3 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              value={newPost.title}
            />
            <input
              type="text"
              name="content"
              id="input-content"
              placeholder="Content"
              className="sm:w-full lg:w-1/3 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-600"
              onChange={(e) => {
                setNewPost({ ...newPost, content: e.target.value });
              }}
              value={newPost.content}
            />
            <button
              type="submit"
              className="px-4 py-2 outline-none border rounded-lg hover:bg-green-700 hover:text-white hover:border-white w-32"
            >
              {isUpdating ? "Update Post" : "Add Post"}
            </button>
          </div>

          <ul className="space-y-5">
            {/*when we write  jsx file  () instead of {} inside the map after arrow function*/}
            {posts.map((post) => (
              // every child has a unique id
              <li key={post.id} className="space-y-4 border p-5">
                <h1 className="text-3xl">{post.title}</h1>
                <p>{post.content}</p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="border rounded-md px-4 py-2 bg-orange-300 hover:text-white"
                    //  onClick={() => handleEditClick(post)} ---->because avoiding immediate execution thats why using annoymous function other reason is we passing aruguments.Its not render only we click the button
                    onClick={() => handleEditClick(post)}
                  >
                    Update
                  </button>
                  {/* id is must for delete the item so passing post id's like a paramater */}
                  <button
                    type="button"
                    className="border rounded-md px-4 py-2 bg-red-600 hover:text-white"
                    onClick={() => deletePost(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </form>
      </div>
    </>
  );
};

export default App;
