import React, { useState } from 'react';
import { Skill, SkillLevel } from '../../../types/skill';

interface SkillCardProps {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
}

/**
 * @param skill
 * @param onEdit
 * @param onDelete
 */

const SkillCard: React.FC<SkillCardProps> = ({ skill, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: skill.name,
    skillLevel: skill.skillLevel,
    description: skill.description
  });
  // Convert enum value to readable string
  const getSkillLevelText = (level: SkillLevel): string => {
    switch (level) {
      case SkillLevel.Basic:
      case SkillLevel.Novice:
        return 'Beginner';
      case SkillLevel.Intermediate:
        return 'Intermediate';
      case SkillLevel.Advanced:
        return 'Advanced';
      case SkillLevel.Expert:
        return 'Expert';
      default:
        return 'Beginner';
    }
  };

  // Convert string skill level to enum
  const convertSkillLevel = (level: string): SkillLevel => {
    switch (level) {
      case 'Beginner':
        return SkillLevel.Basic;
      case 'Intermediate':
        return SkillLevel.Intermediate;
      case 'Advanced':
        return SkillLevel.Advanced;
      case 'Expert':
        return SkillLevel.Expert;
      default:
        return SkillLevel.Basic;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedSkill: Skill = {
      ...skill,
      name: editData.name,
      skillLevel: editData.skillLevel,
      description: editData.description
    };
    onEdit(updatedSkill);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: skill.name,
      skillLevel: skill.skillLevel,
      description: skill.description
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${skill.name}"?`)) {
      onDelete(skill.id);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'skillLevel') {
      setEditData(prev => ({
        ...prev,
        skillLevel: convertSkillLevel(value)
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="skill-card">
      {isEditing ? (
        // Edit mode
        <div className="skill-edit-mode">
          <div className="edit-group">
            <label>Skill Title:</label>
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleInputChange}
              className="edit-input"
            />
          </div>

          <div className="edit-group">
            <label>Skill Level:</label>
            <select
              name="skillLevel"
              value={getSkillLevelText(editData.skillLevel)}
              onChange={handleInputChange}
              className="edit-select"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
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
        // Display mode
        <div className="skill-display-mode">
          <div className="skill-content">
            <div className="skill-header">
              <h3 className="skill-title">{skill.name}</h3>
            </div>
            <div className="skill-level">
              <strong>Skill Level:</strong> {getSkillLevelText(skill.skillLevel)}
            </div>
            <div className="skill-description">
              <strong>Description:</strong> {skill.description}
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

export default SkillCard;
