/**
 * Fetches data from the specified URL using the GET method and retrieves the response as JSON.
 * @param {string} url - The URL to fetch the data from.
 * @returns {Promise<any>} A promise that resolves to the JSON response.
 */
const data = await fetch("http://localhost:3000/", {
  method: "GET",
});
const response = await data.json();
console.log(response.answer);
