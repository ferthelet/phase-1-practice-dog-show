/*
On page load, render a list of already registered dogs in the table. You can fetch these dogs from http://localhost:3000/dogs.
The dog should be put on the table as a table row. The HTML might look something like this:
Make a dog editable. Clicking on the edit button next to a dog should populate the top form with that dog's current information.
On submit of the form, a PATCH request should be made to http://localhost:3000/dogs/:id to update the dog information (including
name, breed and sex attributes).
Once the form is submitted, the table should reflect the updated dog information. There are many ways to do this. You could
search for the table fields you need to edit and update each of them in turn, but we suggest making a new get request for all
dogs and re-rendering all of them in the table. Make sure this GET happens after the PATCH so you can get the most up-to-date
dog information.

*/

// HTML table with the id dogsTable to display the list of dogs, and a form with
// the id dogForm at the top to edit dog information

// Fetch dogs from the server and render them in the table
function renderDogsTable() {
    const dogsTable = document.getElementById('dogForm');

    fetch('http://localhost:3000/dogs')
        .then(response => response.json())
        .then(dogs => {
            // Clear the table first
            dogsTable.innerHTML = '';

            // Render each dog as a table row
            dogs.forEach(dog => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = dog.name;
                row.appendChild(nameCell);

                const breedCell = document.createElement('td');
                breedCell.textContent = dog.breed;
                row.appendChild(breedCell);

                const sexCell = document.createElement('td');
                sexCell.textContent = dog.sex;
                row.appendChild(sexCell);

                const editCell = document.createElement('td');
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => populateFormWithDog(dog));
                editCell.appendChild(editButton);
                row.appendChild(editCell);

                dogsTable.appendChild(row);
            });
        });
}

// Populate the top form with dog information
function populateFormWithDog(dog) {
    const form = document.getElementById('dog-form');
    form.elements.name.value = dog.name;
    form.elements.breed.value = dog.breed;
    form.elements.sex.value = dog.sex;
    form.dataset.id = dog.id; // Store the dog's ID in a data attribute
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const id = form.dataset.id;
    const name = form.elements.name.value;
    const breed = form.elements.breed.value;
    const sex = form.elements.sex.value;

    // Send a PATCH request to update the dog's information
    fetch(`http://localhost:3000/dogs/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, breed, sex })
    })
        .then(response => response.json())
        .then(() => {
            // After the PATCH request, fetch and re-render all dogs in the table
            renderDogsTable();
        });

    form.reset();
}

// Attach event listeners and initial rendering
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dogForm');
    form.addEventListener('submit', handleFormSubmit);

    renderDogsTable();
});