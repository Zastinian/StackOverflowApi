const a = await fetch("http://localhost:3000/", {
  method: "GET",
});
const response = await a.json();
console.log(response.answer);
