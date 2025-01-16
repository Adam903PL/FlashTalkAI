fetch("http://localhost:4444/getKnownWordsByUnitId", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ from:1, to:100 }),
})
  .then((resp) => resp.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Error fetching known words:", error);
  }); 


  
