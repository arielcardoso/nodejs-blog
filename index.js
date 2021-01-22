const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req);

  if (req.url === "/") {
    res.setHeader('Content-type', 'text-html');
    res.write('<h1>Hello!</h1>');
    res.end();
  }

});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));