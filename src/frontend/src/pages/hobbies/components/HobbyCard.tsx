import React, { useState } from 'react';
import { Hobby } from '../../../types/hobby';

interface HobbyCardProps {
  hobby: Hobby;
  onEdit: (hobby: Hobby) => void;
  onDelete: (id: string) => void;
}

const HobbyCard: React.FC<HobbyCardProps> = ({ hobby, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: hobby.name,
    description: hobby.description
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedHobby: Hobby = {
      ...hobby,
      name: editData.name,
      description: editData.description
    };
    onEdit(updatedHobby);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: hobby.name,
      description: hobby.description
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${hobby.name}"?`)) {
      onDelete(hobby.id);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="skill-card">
      {isEditing ? (
        <div className="skill-edit-mode">
          <div className="edit-group">
            <label>Hobby Title:</label>
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleInputChange}
              className="edit-input"
            />
          </div>
          <div className="edit-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={editData.description}
              onChange={handleInputChange}
              rows={3}
              className="edit-textarea"
            />
          </div>
          <div className="edit-buttons">
            <button onClick={handleSave} className="save-btn">💾</button>
            <button onClick={handleCancel} className="cancel-btn">❌</button>
          </div>
        </div>
      ) : (
        <div className="skill-display-mode">
          <div className="skill-content">
            <div className="skill-header">
              <h3 className="skill-title">{hobby.name}</h3>
            </div>
            <div className="skill-description">
              <strong>Description:</strong> {hobby.description}
            </div>
          </div>
          <div className="skill-actions">
            <button onClick={handleEdit} className="edit-btn" title="Edit">✏️</button>
            <button onClick={handleDelete} className="delete-btn" title="Delete">🗑️</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HobbyCard;
