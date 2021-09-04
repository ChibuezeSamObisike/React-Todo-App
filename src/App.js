import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

// gets item from the local storage
const getLocalStorage = () => {
  const list = localStorage.getItem("list");
  if (list) {
    //Convert string recieved to object
    return JSON.parse(localStorage.getItem("list"));
  } else if (!list) {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(
    localStorage.getItem("list") ? localStorage.getItem("list") : []
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });

  //When the component mounts sets the value of the state to what is in the
  //Local Storage
  useEffect(() => {
    setList(getLocalStorage());
  }, []);

  //This useEffect does the storing in local storage
  useEffect(() => {
    console.log(list);
    //we use stringify when passing info to a server
    //list is an array
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show: show, type: type, msg: msg });
  };

  const clearClist = () => {
    showAlert(true, "danger", "You cleared the list");
    setList([]);
  };

  const removeItem = (id) => {
    showAlert(true, "success", "item deleted");
    setList(list.filter((item) => item.id !== id));
  };

  //Handles the finding item
  //And the state setting.
  const editItem = (id) => {
    const item = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(item.title);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "danger", "please enter value");
      //display alert
    } else if (name && isEditing) {
      //deal with edit
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          //console.log(item);
          return item;
        })
      );
      setName("");
      setEditID(null);
      setIsEditing(false);
      showAlert(true, "success", "value changed");
    } else {
      showAlert(true, "success", "item added to the list");
      //show alert
      //create new item
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList((prevItem) => {
        let newList = [...prevItem, newItem];
        return newList;
      });
      setName("");
    }
  };

  return (
    <section className="section-center">
      <div className="grocery-container">
        <form className="grocery-form" onSubmit={handleSubmit}>
          {alert.show && (
            <Alert {...alert} list={list} removeAlert={showAlert} />
          )}
          <h3>grocery bud</h3>
          <div className="form-control">
            <input
              type="text"
              className="grocery"
              placeholder="e.g eggs"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className="submit-btn">
              {isEditing ? "edit" : "submit"}
            </button>
          </div>
        </form>
        {list.length > 0 && (
          <div className="grocery-container">
            <List items={list} editItem={editItem} removeItem={removeItem} />
            <button onClick={() => clearClist()} className="clear-btn">
              Clear Items
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default App;
