// This component is the third step of the app. It allows the user to generate the content of the book, and to edit it.
import React, { useState } from 'react';

const ContentGenerationView = ({ bookData }) => {
  const [items, setItems] = useState(bookData.items);
  const [content, setContent] = useState(bookData.content);
  const [itemName, setItemName] = useState('');
  const [itemContent, setItemContent] = useState('');

  const handleChange = (event) => {
    if (event.target.name === 'item') {
      setItemName(event.target.value);
    } else {
      setItemContent(event.target.value);
    }
  };

  const handleAddItem = () => {
    setItems([...items, itemName]);
    setItemName('');
  };

  const handleAddContent = () => {
    setContent([...content, itemContent]);
    setItemContent('');
  };

  const handleRemoveItem = (item) => {
    const newItems = items.filter((i) => i !== item);
    setItems(newItems);
  };

  const handleRemoveContent = (content) => {
    const newContent = content.filter((c) => c !== content);
    setContent(newContent);
  };

  return (
    <div>
      <div>
        <input type="text" name="item" value={itemName} onChange={handleChange} />
        <button type="button" onClick={handleAddItem}>Add Item</button>
      </div>
      <div>
        <input type="text" name="content" value={itemContent} onChange={handleChange} />
        <button type="button" onClick={handleAddContent}>Add Content</button>
      </div>
      <div>
        <h2>Items</h2>
        <ul>
          {items.map((item) => (
            <li key={item}>
              <span>{item}</span>
              <button type="button" onClick={() => handleRemoveItem(item)}>Remove Item</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Content</h2>
        <ul>
          {content.map((content) => (
            <li key={content}>
              <span>{content}</span>
              <button type="button" onClick={() => handleRemoveContent(content)}>Remove Content</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContentGenerationView;
