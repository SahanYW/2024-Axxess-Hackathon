function handleSubmit(event) {
    event.preventDefault();

    // Get user input from the form
    const symptoms = document.getElementById('symptoms').value.trim();

    // Log the input to the console
    console.log('User Symptoms:', symptoms);

    // Create an object with userInput property
    const requestBody = {
        userInput: symptoms
    };

    // Convert the object to JSON
    const requestBodyJSON = JSON.stringify(requestBody);

    // Log the JSON payload to the console
    console.log('Request Body:', requestBodyJSON);

    // Send the JSON payload to the server
    const url = 'http://18.218.213.140:3000/diagnose';

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBodyJSON // Use the JSON payload here
    };

    fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(JSON.stringify(data, null, 2)); // Logging the JSON with indentation
            
            // Store the response in local storage
            localStorage.setItem('diagnoseResponse', JSON.stringify(data));
            // localStorage.getItem('diagnoseResponse')
            console.log('Response stored in local storage');
            window.location.href = "results.html";
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

// Attach form submission event listener
document.getElementById('symptoms-form').addEventListener('submit', handleSubmit);

