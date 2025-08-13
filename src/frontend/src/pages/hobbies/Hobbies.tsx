import React, { useEffect, useState } from 'react';
import api from '../../api/service';
import { Hobby } from '../../types/hobby';
import HobbyCard from './components/HobbyCard';
import './styles.css';

interface FormData {
  hobbyTitle: string;
  hobbyDescription: string;
}

interface FormErrors {
  hobbyTitle?: string;
  hobbyDescription?: string;
}

/**
 * Hobbies page - displays a form to add/edit hobbies and a list of all hobbies
 */
const Hobbies: React.FC = () => {
  // State for hobbies array
  const [hobbies, setHobbies] = useState<Hobby[]>([]);

  // State for form data
  const [formData, setFormData] = useState<FormData>({
    hobbyTitle: '',
    hobbyDescription: ''
  });

  // State for form validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // State for loading and submission
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Load hobbies on component mount
  useEffect(() => {
    loadHobbies();
  }, []);

  // Function to load hobbies from API
  const loadHobbies = async () => {
    try {
      setIsLoading(true);
      const hobbiesData = await api.getHobbies();
      setHobbies(hobbiesData);
      console.log('✅ API connected! Loaded hobbies from API:', hobbiesData);
    } catch (error) {
      // Enhanced error logging for debugging
      const apiUrl = import.meta.env.VITE_API_URL;
      console.error('❌ Failed to load hobbies from API.');
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
      setHobbies([
        {
          id: '1',
          name: 'Reading',
          description: 'I love reading fiction and non-fiction books.'
        },
        {
          id: '2',
          name: 'Hiking',
          description: 'Exploring nature trails and mountains.'
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
    const newErrors: FormErrors = {};

    if (!formData.hobbyTitle.trim()) {
      newErrors.hobbyTitle = 'Hobby title is required';
    }

    if (!formData.hobbyDescription.trim()) {
      newErrors.hobbyDescription = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle hobby editing
  const handleEditHobby = async (updatedHobby: Hobby) => {
    try {
      console.log('Editing hobby:', updatedHobby);

      try {
        // Try to update hobby via API
        const editedHobby = await api.editHobby(updatedHobby);
        // Update the hobby in the list with API response
        setHobbies(prev => prev.map(hobby =>
          hobby.id === updatedHobby.id ? editedHobby : hobby
        ));
        console.log('Hobby updated via API:', editedHobby);
      } catch (apiError) {
        console.warn('API call failed, updating hobby locally:', apiError);
        // If API fails, update hobby locally
        setHobbies(prev => prev.map(hobby =>
          hobby.id === updatedHobby.id ? updatedHobby : hobby
        ));
      }

      alert('Hobby updated successfully!');
    } catch (error) {
      console.error('Failed to update hobby:', error);
      alert('Failed to update hobby. Please try again.');
    }
  };

  // Function to handle hobby deletion
  const handleDeleteHobby = async (hobbyId: string) => {
    try {
      console.log('Deleting hobby with ID:', hobbyId);

      try {
        // Try to delete hobby via API
        await api.deleteHobby(hobbyId);
        console.log('Hobby deleted via API');
      } catch (apiError) {
        console.warn('API call failed, deleting hobby locally:', apiError);
        // Continue with local deletion even if API fails
      }

      // Remove the hobby from the list
      setHobbies(prev => prev.filter(hobby => hobby.id !== hobbyId));
    } catch (error) {
      console.error('Failed to delete hobby:', error);
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

      const newHobby: Hobby = {
        id: Date.now().toString(), // Generate a temporary ID
        name: formData.hobbyTitle.trim(),
        description: formData.hobbyDescription.trim()
      };

      try {
        // Try to create hobby via API
        const createdHobby = await api.createHobby(newHobby);
        // Add the API-created hobby to the list
        setHobbies(prev => [...prev, createdHobby]);
        console.log('Hobby created via API:', createdHobby);
      } catch (apiError) {
        console.warn('API call failed, adding hobby locally:', apiError);
        // If API fails, add hobby locally with generated ID
        setHobbies(prev => [...prev, newHobby]);
      }

      // Reset form
      setFormData({
        hobbyTitle: '',
        hobbyDescription: ''
      });

      // Clear any errors
      setErrors({});

    } catch (error) {
      console.error('Failed to create hobby:', error);
      alert('Failed to add hobby. Please try again.');
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

      {/* Hobbies Display Section - Using React HobbyCard components */}
      <div className="skills-display">
  <h2 style={{ borderBottom: '3px solid #4f0b45', paddingBottom: '0.5rem', marginBottom: '2rem' }}>My Hobbies</h2>
        {isLoading ? (
          <p>Loading hobbies...</p>
        ) : (
          <div className="skills-grid">
            {hobbies.map((hobby: Hobby) => (
              <HobbyCard
                key={hobby.id}
                hobby={hobby}
                onEdit={handleEditHobby}
                onDelete={handleDeleteHobby}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hobbies Form Section */}
      <div className="skills-form-section">
        <h2>Add New Hobby</h2>
        <form className="skill-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="hobbyTitle">Hobby Title:</label>
            <input
              type="text"
              id="hobbyTitle"
              name="hobbyTitle"
              value={formData.hobbyTitle}
              onChange={handleInputChange}
              placeholder="Enter hobby title"
              className={errors.hobbyTitle ? 'error' : ''}
            />
            {errors.hobbyTitle && <span className="error-message">{errors.hobbyTitle}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="hobbyDescription">Description:</label>
            <textarea
              id="hobbyDescription"
              name="hobbyDescription"
              value={formData.hobbyDescription}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe your hobby"
              className={errors.hobbyDescription ? 'error' : ''}
            />
            {errors.hobbyDescription && <span className="error-message">{errors.hobbyDescription}</span>}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Adding Hobby...' : 'Add Hobby'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hobbies;
