fetch("http://localhost:4444/getuserpoint")
.then((resp) => resp.json())
.then((data) => {
  console.log("Selected data from database:", data.data);
});


















