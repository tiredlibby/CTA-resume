import React, { useEffect, useState } from 'react';
import api from '../../api/service';
import { Skill, SkillLevel } from '../../types/skill';
import SkillCard from './components/SkillCard';
import './styles.css';

interface FormData {
  skillTitle: string;
  skillLevel: string;
  skillDescription: string;
}

interface FormErrors {
  skillTitle?: string;
  skillLevel?: string;
  skillDescription?: string;
}

/**
 * Skills page - displays a form to add/edit skills and a list of all skills
 */
const Skills: React.FC = () => {
  // State for skills array
  const [skills, setSkills] = useState<Skill[]>([]);

  // State for form data
  const [formData, setFormData] = useState<FormData>({
    skillTitle: '',
    skillLevel: '',
    skillDescription: ''
  });

  // State for form validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // State for loading and submission
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Load skills on component mount
  useEffect(() => {
    loadSkills();
  }, []);

  // Function to load skills from API
  const loadSkills = async () => {
    try {
      setIsLoading(true);
      const skillsData = await api.getSkills();
      setSkills(skillsData);
      console.log('✅ API connected! Loaded skills from API:', skillsData);
    } catch (error) {
      // Enhanced error logging for debugging
      const apiUrl = import.meta.env.VITE_API_URL;
      console.error('❌ Failed to load skills from API.');
      console.error('API URL:', apiUrl ? apiUrl : '(not set)');
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        if ((error as any).stack) {
          console.error('Stack trace:', (error as any).stack);
        }
      } else {
        console.error('Error object:', error);
      }
      // Fallback to sample data if API fails
      setSkills([
        {
          id: '1',
          name: 'C# Programming',
          skillLevel: SkillLevel.Advanced,
          description: 'used c# to build a video game.'
        },
        {
          id: '2',
          name: 'JavaScript',
          skillLevel: SkillLevel.Basic,
          description: 'Ive learned to use Javascript to make websites.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('Form input changed:', name, value); // Debug log
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Function to validate form
  const validateForm = (): boolean => {
    console.log('Validating form with data:', formData); // Debug log
    const newErrors: FormErrors = {};

    if (!formData.skillTitle.trim()) {
      newErrors.skillTitle = 'Skill title is required';
    }

    if (!formData.skillLevel) {
      newErrors.skillLevel = 'Skill level is required';
    }

    if (!formData.skillDescription.trim()) {
      newErrors.skillDescription = 'Description is required';
    }

    setErrors(newErrors);
    console.log('Validation errors:', newErrors); // Debug log
    return Object.keys(newErrors).length === 0;
  };

  // Function to convert string skill level to enum
  const convertSkillLevel = (level: string): SkillLevel => {
    switch (level) {
      case 'Beginner':
        return SkillLevel.Basic; // Map Beginner to Basic enum value
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

  // Function to handle skill editing
  const handleEditSkill = async (updatedSkill: Skill) => {
    try {
      console.log('Editing skill:', updatedSkill);

      try {
        // Try to update skill via API
        const editedSkill = await api.editSkill(updatedSkill);
        // Update the skill in the list with API response
        setSkills(prev => prev.map(skill =>
          skill.id === updatedSkill.id ? editedSkill : skill
        ));
        console.log('Skill updated via API:', editedSkill);
      } catch (apiError) {
        console.warn('API call failed, updating skill locally:', apiError);
        // If API fails, update skill locally
        setSkills(prev => prev.map(skill =>
          skill.id === updatedSkill.id ? updatedSkill : skill
        ));
      }

      alert('Skill updated successfully!');
    } catch (error) {
      console.error('Failed to update skill:', error);
      alert('Failed to update skill. Please try again.');
    }
  };

  // Function to handle skill deletion
  const handleDeleteSkill = async (skillId: string) => {
    try {
      console.log('Deleting skill with ID:', skillId);

      try {
        // Try to delete skill via API
        await api.deleteSkill(skillId);
        console.log('Skill deleted via API');
      } catch (apiError) {
        console.warn('API call failed, deleting skill locally:', apiError);
        // Continue with local deletion even if API fails
      }

      // Remove the skill from the list
      setSkills(prev => prev.filter(skill => skill.id !== skillId));
    } catch (error) {
      console.error('Failed to delete skill:', error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData); // Debug log

    if (!validateForm()) {
      console.log('Form validation failed'); // Debug log
      return;
    }

    console.log('Form validation passed, creating skill'); // Debug log

    try {
      setIsSubmitting(true);

      const newSkill: Skill = {
        id: Date.now().toString(), // Generate a temporary ID
        name: formData.skillTitle.trim(),
        skillLevel: convertSkillLevel(formData.skillLevel),
        description: formData.skillDescription.trim()
      };

      try {
        // Try to create skill via API
        const createdSkill = await api.createSkill(newSkill);
        // Add the API-created skill to the list
        setSkills(prev => [...prev, createdSkill]);
        console.log('Skill created via API:', createdSkill);
      } catch (apiError) {
        console.warn('API call failed, adding skill locally:', apiError);
        // If API fails, add skill locally with generated ID
        setSkills(prev => [...prev, newSkill]);
      }

      // Reset form
      setFormData({
        skillTitle: '',
        skillLevel: '',
        skillDescription: ''
      });

      // Clear any errors
      setErrors({});

    } catch (error) {
      console.error('Failed to create skill:', error);
      alert('Failed to add skill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`skills-container${darkMode ? ' dark-mode' : ''}`}>
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        style={{
          position: 'absolute',
          top: 20,
          right: 50,
          zIndex: 140,
          background: darkMode ? '#232336' : '#f7e9ef',
          color: darkMode ? '#fff' : '#4f0b45',
          border: '1px solid #7c3aed',
          borderRadius: '6px',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.3s',
        }}
        aria-label="Toggle dark mode"
      >
        {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>

      {/* Skills Display Section - Using React SkillCard components */}
      <div className="skills-display">
        <h2>My Skills</h2>
        {isLoading ? (
          <p>Loading skills...</p>
        ) : (
          <div className="skills-grid">
            {skills.map((skill: Skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onEdit={handleEditSkill}
                onDelete={handleDeleteSkill}
              />
            ))}
          </div>
        )}
      </div>

      {/* Skills Form Section */}
      <div className="skills-form-section">
        <h2>Add New Skill</h2>
        <form className="skill-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="skillTitle">Skill Title:</label>
            <input
              type="text"
              id="skillTitle"
              name="skillTitle"
              value={formData.skillTitle}
              onChange={handleInputChange}
              placeholder="Enter skill title"
              className={errors.skillTitle ? 'error' : ''}
            />
            {errors.skillTitle && <span className="error-message">{errors.skillTitle}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="skillLevel">Skill Level:</label>
            <select
              id="skillLevel"
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleInputChange}
              className={errors.skillLevel ? 'error' : ''}
            >
              <option value="">Select a skill level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            {errors.skillLevel && <span className="error-message">{errors.skillLevel}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="skillDescription">Description:</label>
            <textarea
              id="skillDescription"
              name="skillDescription"
              value={formData.skillDescription}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe your skill and experience"
              className={errors.skillDescription ? 'error' : ''}
            />
            {errors.skillDescription && <span className="error-message">{errors.skillDescription}</span>}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Adding Skill...' : 'Add Skill'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Skills;
