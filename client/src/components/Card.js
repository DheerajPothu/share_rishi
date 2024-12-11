import React, { useState } from "react";
import { FiHeart, FiMoreVertical, FiEdit2 } from "react-icons/fi";
import { toast } from "react-toastify";

const Card = ({
  category,
  company,
  date,
  day,
  displayImgSrc,
  fileType,
  id,
  season,
  sessionId,
  src,
  tags: initialTags,
  title,
  favorite: initialFavorite, // Use favorite from props
  onUpdate,
  onToggleFavorite,
  allTags,
}) => {
  const [tags, setTags] = useState(Array.isArray(initialTags) ? initialTags : []);
  const [isEditing, setIsEditing] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [editNewTag, setEditNewTag] = useState("");
  const [favorite, setFavorite] = useState(initialFavorite);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditingFields, setIsEditingFields] = useState(false);
  const [editedData, setEditedData] = useState({
    title,
    category,
    company,
    date,
    day,
    season,
    playlist: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);

  const handleNewTagChange = (event) => {
    setNewTag(event.target.value);
  };

  const handleTagInputChange = (e) => {
    const input = e.target.value;
    setTagInput(input);
    setNewTag(e.target.value);
    setFilteredTags(
      allTags.filter(
        (tag) =>
          tag.toLowerCase().includes(input.toLowerCase()) &&
          !tags.includes(tag)
      )
    );
  };

  const handleAddTag = async () => {
    if (newTag.trim()) {
      const newTagValue = newTag.trim();
      const updatedTags = [...tags, newTagValue]; // Add the new tag to the existing tags

      // Create a Set to filter out duplicates and ensure unique tags
      const uniqueTags = Array.from(new Set(updatedTags.filter(Boolean))); // Filter out empty tags and create a unique list

      const object = { 
        ...itemData, 
        tags: uniqueTags,
        tagEdit: true // Use the unique tags list
      };

      // Wait for the onUpdate function to complete and check its response
      const updateSuccess = await onUpdate({ id, object });
      
      if (updateSuccess) {
        // Only update the tags state if the update was successful
        setTags(uniqueTags); // Update state with unique tags
        setNewTag(""); // Clear the input field
        setTagInput(""); // Clear the input field
      } else {
        // Optionally handle the case where the update failed
        console.error("Failed to add tag, update was not successful.");
      }
    }
  };
  const handleEditChange = (event) => {
    setEditNewTag(event.target.value);
  };
  
  const handleTagClick = (tag) => {
    const updatedTags = [...tags, tag];
    const uniqueTags = Array.from(new Set(updatedTags.filter(Boolean)));
    const object = { ...itemData, tags: uniqueTags, tagEdit: true };

    onUpdate({ id, object }).then((updateSuccess) => {
      if (updateSuccess) {
        setTags(uniqueTags);
        setTagInput("");
        setFilteredTags([]);
      }
    });
  };

  const handleEditTag = (index) => {
    if (editNewTag.trim()) {
      const updatedTags = [...tags];
      updatedTags[index] = editNewTag.trim();
      setTags(updatedTags);
      setEditNewTag("");
      const object = { 
        ...itemData, 
        tags: updatedTags.filter(Boolean) // Ensure no empty tags
      };
      onUpdate({ id, object });
      setIsEditing(null);
    }
  };

  const handleDeleteTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
    const object = { ...itemData, tags: updatedTags };
    onUpdate({ id, object });
  };

  const handleToggleFavorite = () => {
    setFavorite((prev) => !prev);
    onToggleFavorite();
    const object = { ...itemData, favorite: !favorite };
    onUpdate({ id, object });
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5004/delete/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Failed to delete item');
      }

    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const itemData = {
    category,
    company,
    date,
    day,
    displayImgSrc,
    fileType,
    id,
    season,
    sessionId,
    src,
    tags,
    title,
  };

  const renderMedia = () => {
    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png" || fileType === "gif" || fileType === "webp") {
      return     <>
      <a href={src} target="_blank" rel="noopener noreferrer" className = "block w-full text-center mt-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">View Image</button>
      </a>
    </>
    } else if (fileType === "mp3" || fileType === "m4a") {
      return (
        <audio controls className="w-full h-20">
          <source src={src} type={`audio/${fileType}`} />
          Your browser does not support the audio tag.
        </audio>
      );
    } else if (fileType === "mp4") {
      return (
        <video controls className="w-full h-40">
          <source src={src} type={`video/${fileType}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (fileType === "pdf") {
      return (
        <a href={src} target="_blank" rel="noopener noreferrer" className="block w-full text-center">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">View PDF</button>
        </a>
      );
    } else if (fileType === "ppt" || fileType === "pptx") {
      return (
        <a href={src} target="_blank" rel="noopener noreferrer" className="block w-full text-center">
          <button className="bg-green-500 text-white px-4 py-2 rounded">View PPT</button>
        </a>
      );
    } else if (fileType === "doc" || fileType === "docx") {
      return (
        <a href={src} target="_blank" rel="noopener noreferrer" className="block w-full text-center">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded">View Document</button>
        </a>
      );
    } else if (fileType === "txt" || fileType === "md" || fileType === "html") {
      return (
        <a href={src} target="_blank" rel="noopener noreferrer" className="block w-full text-center">
          <button className="bg-gray-500 text-white px-4 py-2 rounded">View File</button>
        </a>
      );
    } else if (fileType === "zip" || fileType === "rar" || fileType === "tar") {
      return (
        <a href={src} target="_blank" rel="noopener noreferrer" className="block w-full text-center">
          <button className="bg-purple-500 text-white px-4 py-2 rounded">Download Archive</button>
        </a>
      );
    } else if (fileType === "exe" || fileType === "apk" || fileType === "bin" || fileType === "jar") {
      return (
        <a href={src} target="_blank" rel="noopener noreferrer" className="block w-full text-center">
          <button className="bg-red-500 text-white px-4 py-2 rounded">Download Executable</button>
        </a>
      );
    } else if (fileType === "sql" || fileType === "mdb" || fileType === "sqlite" || fileType === "db" || fileType === "c" || fileType === "java" || fileType === "cs" || fileType === "js" || fileType === "py" || fileType === "php" || fileType === "html" || fileType === "ts" || fileType === "css" || fileType === "json" || fileType === "jsx" || fileType === "md") {
      return (
        <a href={src} target="_blank" rel="noopener noreferrer" className="block w-full text-center">
          <button className="bg-teal-500 text-white px-4 py-2 rounded">View Code</button>
        </a>
      );
    }
    return null;
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    const object = {
      ...itemData,
      ...editedData,
    };

    if (!object.title  || !object.company ) {
      toast.error("Please fill in all mandatory fields marked with *");
      return; // Prevent form submission
    }
    onUpdate({ id, object });
    setIsEditingFields(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-64 relative">
      <img
        src={displayImgSrc}
        alt={title}
        className="w-full h-40 object-cover rounded"
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={handleToggleFavorite}
          className="p-1 rounded-full bg-white shadow"
          aria-label="Toggle Favorite"
        >
          <FiHeart className={`w-6 h-6 ${favorite ? 'text-red-500' : 'text-gray-400'}`} />
        </button>
        <button
          onClick={() => setIsEditingFields(!isEditingFields)}
          className="p-1 rounded-full bg-white shadow"
          aria-label="Edit fields"
        >
          <FiEdit2 className="w-6 h-6 text-gray-400" />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-full bg-white shadow"
            aria-label="More options"
          >
            <FiMoreVertical className="w-6 h-6 text-gray-400" />
          </button>
          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="media-container mb-4">
        {renderMedia()} {/* Conditionally render image, audio, video, or link */}
      </div>
      <div className="card-content mt-4">
        {isEditingFields ? (
          // Edit mode
          <div className="space-y-2">
            <div>
              <label className="text-sm text-gray-600">Title:  <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="title"
                value={editedData.title}
                onChange={handleFieldChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Place:</label>
              <input
                type="text"
                name="category"
                value={editedData.category}
                onChange={handleFieldChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Type:  <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="company"
                value={editedData.company}
                onChange={handleFieldChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Date:</label>
              <input
                type="date"
                name="date"
                value={editedData.date}
                onChange={handleFieldChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Day:</label>
              <input
                type="text"
                name="day"
                value={editedData.day}
                onChange={handleFieldChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Season:</label>
              <input
                type="text"
                name="season"
                value={editedData.season}
                onChange={handleFieldChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setIsEditingFields(false)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          // View mode
          <>
            <h3 className="font-semibold text-lg">{editedData.title}</h3>
            {editedData.category && <p className="text-sm">Place: {editedData.category}</p>}
            {editedData.company && <p className="text-sm">Type: {editedData.company}</p>}
            {editedData.season && <p className="text-sm">Season: {editedData.season}</p>}
            {editedData.day && <p className="text-sm">Day: {editedData.day}</p>}
            {editedData.date && <p className="text-sm">Date: {editedData.date}</p>}
          </>
        )}

        {/* Tags Section */}
        <div className="tag-box border-gray-300 pl-0 p-2 pt-0 rounded-lg">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="tag-item flex items-center justify-between mb-2 bg-gray-100 p-1 rounded-lg hover:bg-gray-200 transition mx-1"
            >
              {isEditing === index ? (
                <input
                  value={editNewTag}
                  onChange={handleEditChange}
                  className="border border-gray-300 rounded p-1 flex-grow"
                />
              ) : (
                <span
                  onClick={() => {
                    setIsEditing(index);
                    setEditNewTag(tag);
                  }}
                  className="cursor-pointer hover:text-blue-500 text-sm px-1"
                >
                  {tag}
                </span>
              )}
              {isEditing === index ? (
                <button
                  onClick={() => handleEditTag(index)} // Update existing tag
                  className="text-red-500 ml-2 hover:bg-red-100 rounded-full p-1 transition"
                  aria-label="Tick"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600" // Adjust the color as needed
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12l5 5L20 7"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => handleDeleteTag(index)}
                  className="text-red-500 ml-2 hover:bg-red-100 rounded-full p-1 transition"
                  aria-label="Delete tag"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 4a1 1 0 00-1 1v1H4a1 1 0 000 2h1v8a2 2 0 002 2h6a2 2 0 002-2v-8h1a1 1 0 000-2h-3V5a1 1 0 00-1-1H8zm0 2h4v1H8V6z" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <div className="flex items-center">
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              placeholder="Add a new tag"
              className="border border-gray-300 rounded p-1 flex-grow mr-1"
            />
            <button
              onClick={handleAddTag} // Add new tag
              className="bg-blue-500 text-white rounded  p-1 hover:bg-blue-600"
              aria-label="Add Tag"
            >
              Add
            </button>
          </div>
          {tagInput && filteredTags.length > 0 && (
            <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-56 overflow-y-scroll">
              <>
                {filteredTags.map((tag, index) => (
                  <div
                    key={index}
                    className="text-red-500 p-2 cursor-pointer"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </div>
                ))}
              </>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
