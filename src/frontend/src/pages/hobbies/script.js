// This file is a workaround to get vanilla JS working in a React application.
export const initializeVanillaJS = () => {
  // this call to setTimeout will execute the following JavaScript after a 100 millisecond delay, to give React time to render the HTML.
  // this is only necessary because we are building a site that can leverage both vanilla JS and React for building pages.
  // this file will not be used in the Reactify portion of the class but is essential for understanding how websites work under the hood
  // Your code will go inside the body of setTimeout, where the below comments are written to guide your code placement.
  setTimeout(() => {
    console.log('initializeVanillaJS')

    // Select HTML Elements
    const addButton = document.getElementById('addButton');
    const skillsList = document.getElementById('skills-list');
    const formElement = document.querySelector('.skill-form');
    const skillName = document.getElementById('skillTitle');
    const skillLevel = document.getElementById('skillLevel');
    const skillDescription = document.getElementById('skillDescription');

    // Check if event listener is already attached to prevent duplicates
    if (addButton && !addButton.hasAttribute('data-listener-attached')) {
      // Primary Function
      const handleAddSkill = (event) => {
        // Prevent form submission
        event.preventDefault();
        console.log(event.target);

        // Validate form inputs
        if (!skillName.value.trim() || !skillLevel.value || !skillDescription.value.trim()) {
          alert('Please fill in all fields');
          return;
        }

        // Get Form Values (Inside Primary Function)
        // Values are retrieved via .value property when building HTML

        // Create new skill element (Inside Primary Function)
        const skill = document.createElement('li');
        const skillCard = document.createElement('div');
        const skillHeading = document.createElement('h3');
        const skillLevelDiv = document.createElement('div');
        const skillLevelStrong = document.createElement('strong');
        const skillDescriptionDiv = document.createElement('div');
        const skillDescriptionStrong = document.createElement('strong');

        // Create action buttons container
        const actionsDiv = document.createElement('div');
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        // Add CSS classes (Inside Primary Function)
        skill.classList.add('skill-item');
        skillCard.classList.add('skill-card');
        skillHeading.classList.add('skill-title');
        skillLevelDiv.classList.add('skill-level');
        skillDescriptionDiv.classList.add('skill-description');
        actionsDiv.classList.add('skill-actions');
        editButton.classList.add('edit-btn');
        deleteButton.classList.add('delete-btn');

        // Set button content
        editButton.textContent = 'Edit';
        deleteButton.textContent = 'Delete';

        // Store original values as data attributes for editing
        skill.setAttribute('data-title', skillName.value);
        skill.setAttribute('data-level', skillLevel.value);
        skill.setAttribute('data-description', skillDescription.value);

        // Assign form values (Inside Primary Function)
        skillHeading.textContent = skillName.value;
        skillLevelStrong.textContent = 'Skill Level: ';
        skillLevelDiv.appendChild(skillLevelStrong);
        skillLevelDiv.appendChild(document.createTextNode(skillLevel.value));

        skillDescriptionStrong.textContent = 'Description: ';
        skillDescriptionDiv.appendChild(skillDescriptionStrong);
        skillDescriptionDiv.appendChild(document.createTextNode(skillDescription.value));

        // Build HTML (Inside Primary Function)
        // Append innermost children to their parents first
        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);

        skillCard.appendChild(skillHeading);
        skillCard.appendChild(skillLevelDiv);
        skillCard.appendChild(skillDescriptionDiv);
        skillCard.appendChild(actionsDiv);

        // Append the complete skill card to the list item
        skill.appendChild(skillCard);

        // Add event listeners for edit and delete buttons
        editButton.addEventListener('click', () => handleEditSkill(skill));
        deleteButton.addEventListener('click', () => handleDeleteSkill(skill));

        // Add the skill to the list
        skillsList.appendChild(skill);

        // Clear form (Inside Primary Function)
        formElement.reset();
      };

      // Delete skill function
      const handleDeleteSkill = (skillElement) => {
        if (confirm('Are you sure you want to delete this skill?')) {
          skillElement.remove();
        }
      };

      // Edit skill function
      const handleEditSkill = (skillElement) => {
        // Get stored values
        const currentTitle = skillElement.getAttribute('data-title');
        const currentLevel = skillElement.getAttribute('data-level');
        const currentDescription = skillElement.getAttribute('data-description');

        // Fill form with current values
        skillName.value = currentTitle;
        skillLevel.value = currentLevel;
        skillDescription.value = currentDescription;

        // Remove the skill being edited
        skillElement.remove();

        // Scroll to form
        formElement.scrollIntoView({ behavior: 'smooth' });
      };

      // Wire up event listeners (only once)
      addButton.addEventListener('click', handleAddSkill);
      addButton.setAttribute('data-listener-attached', 'true');
    }
  }, 100);
};
