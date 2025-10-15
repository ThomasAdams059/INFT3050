import { useState } from "react";

const ItemManagement = () => {
  // Add Item state
  const [itemName, setItemName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [subgenre, setSubgenre] = useState("");
  const [type, setType] = useState("Book");

  // Edit/Delete Item state
  const [searchItem, setSearchItem] = useState("");
  const [showItemInfo, setShowItemInfo] = useState(true); // Changed to true

  // Handle Add Item
  const handleAddItem = (event) => {
    event.preventDefault();
    // Clear form after submission
    setItemName("");
    setAuthor("");
    setDescription("");
    setGenre("");
    setSubgenre("");
    setType("Book");
  };

  // Handle Search Item
  const handleSearchItem = (event) => {
    event.preventDefault();
    setShowItemInfo(true);
  };

  // Handle Edit Item
  const handleEditItem = () => {
    // Edit functionality will be added later
  };

  // Handle Delete Item
  const handleDeleteItem = () => {
    setShowItemInfo(false);
    setSearchItem("");
  };

  return (
    <div className="management-container">
      <h1>Item Management</h1>
      
      <div className="management-grid">
        {/* Add Item Section */}
        <div className="management-section">
          <h2>Add Item</h2>
          <form onSubmit={handleAddItem}>
            <div className="form-group">
              <label>
                Name<span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Name of Item"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                placeholder="First and Last"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Genre</label>
              <input
                type="text"
                placeholder="Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Subgenre"
                  value={subgenre}
                  onChange={(e) => setSubgenre(e.target.value)}
                />
              </div>
              <div className="form-group">
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Book">Book</option>
                  <option value="Movie">Movie</option>
                  <option value="Game">Game</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-add">
              Add Item
            </button>
          </form>
        </div>

        {/* Edit/Delete Item Section */}
        <div className="management-section">
          <h2>Edit/Delete Item</h2>
          <form onSubmit={handleSearchItem} className="search-box">
            <label>
              Name<span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="Search for Item"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              required
            />
          </form>

          {showItemInfo && (
            <>
              <div className="item-info">
                <h3>User Info</h3>
                <p><strong>Name:</strong> Book Name</p>
                <p><strong>Author:</strong> John Smith</p>
                <p><strong>Description:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                <p><strong>Genre:</strong> Lorem ipsum</p>
                <p><strong>Subgenre:</strong> Lorem ipsum</p>
                <p><strong>Type:</strong> Book</p>
              </div>

              <div className="button-row">
                <button className="btn-edit" onClick={handleEditItem}>
                  Edit Item
                </button>
                <button className="btn-delete" onClick={handleDeleteItem}>
                  Delete Item
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemManagement;
