const request = require("request");
const http = require("http");
const fetch = require("node-fetch");


const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Send Message</title>
          <style>
            /* CSS styles for the header, main, and footer */
            @import url('https://fonts.googleapis.com/css2?family=Barlow&family=PT+Sans&display=swap');

            :root{
                --dark: #2b2d42;
                --light: #adb5bd;
                --border: #dee2e6;
                --border-btn: #edf2f4;
            }

            * {
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }

            a {
                text-decoration: none;
                font-family: 'PT Sans', sans-serif;
            }

            .container{
                max-width: 1024px;
                margin: auto;
            }

            .nav-brand{
                font-size: 1.5em;
                font-weight: bold;
            }

            .d-flex{
                display: flex;
                flex-wrap: wrap;
            }

            .justify-between{
                justify-content: space-between;
            }

            .text-center{
                text-align: center;
            }

            .border-shadow{
                border: 1px solid var(--border-btn);
                box-shadow: 1px 3px 10px #e9ecef;
            }

            .text-dark{
                color: var(--dark);
            }

            .inline{
                display: inline-block;
            }

            .text-light{
                color: var(--light);
            }

            .text-gradient{
                background: linear-gradient(to right, #8e2de2, #4a00e0);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            #header nav{
                background-color: #06d6a0;
                padding: 1em 0;
                width: 100%;
            }
            main {
              margin: 2rem auto;
              max-width: 600px;
              text-align: center;
            }
            footer {
              background-color: #333;
              color: white;
              text-align: center;
              padding: 1rem;
              position: absolute;
              bottom: 0;
              width: 100%;
            }
            form {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            label, input {
              margin: 1rem 0;
            }
            input[type="text"] {
              padding: 0.5rem;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            button {
              padding: 0.5rem;
              background-color: #4CAF50;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              transition: all 0.3s ease-in-out;
            }
            button:hover {
              background-color: #3e8e41;
            }
            .success {
              background-color: #4CAF50;
              color: white;
              padding: 1rem;
              margin: 1rem 0;
            }
            .error {
              background-color: #f44336;
              color: white;
              padding: 1rem;
              margin: 1rem 0;
            }
          </style>
        </head>
        <body>
          <!-- Header -->
            <header id="header">
                <nav>
                    <div class="container">
                        <div class="text-center">
                            <a href="/" class="nav-brand text-dark">Système de gestion (Axone_chat)</a>
                        </div>
                    </div>
                </nav>
            </header>
          <!-- /Header-->
          <main>
            <form method="POST" action="/send-message">
              <label for="phone-number">Numéro de téléphone :</label>
              <input type="text" name="phone-number" id="phone-number">
              <button type="submit">Envoyer un message</button>
            </form>
            <div id="message"></div>
          </main>
          <footer>
            <p>&copy; 2023 Axone SA</p>
          </footer>
        </body>
      </html>
    `);
    res.end();
  } else if (req.url === "/send-message" && req.method === "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk.toString();
    });
    req.on("end", () => {
      const phoneNumber = new URLSearchParams(data).get("phone-number");
      const options = {
        url: "https://graph.facebook.com/v15.0/106663595689364/messages",
        headers: {
          Authorization:
            "Bearer EAAOphJFFJygBAFkCOS4aIBPCJQBVDfFZCaxZBCTWWTE1BM26SszkUSjkkONFleiS1VvGjZCPMAO6LwE5tFgMLn0PJZAiUCUfN5wNnr1b2FV1DTt2YRGnHrrZBBvtkLyu1miqCx7ddXL6SEQv2Y4zz8f2235NTsDGo58sHV70OGZA2v6Jk5AZBVM29wLr3URgDZASffQ0HXhLPvwpFAuZA5PhJ",
          "Content-Type": "application/json",
        },
        json: {
          messaging_product: "whatsapp",
          to: phoneNumber,
          type: "template",
          template: {
            name: "hello_world",
            language: { code: "en_US" },
          },
        },
      };
      sendMessage(options, phoneNumber, res);
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.write("404 Not Found");
    res.end();
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

function sendMessage(options, to, res) {
  fetch(options.url, {
    method: "POST",
    headers: options.headers,
    body: JSON.stringify(options.json),
  })
    .then((response) => {
      if (response.ok) {
        const message = `Message envoye a ${to}.`;
        console.log(message);
        showMessage(message, "success", res);
      } else {
        throw new Error("Impossible d'envoyer le message.");
      }
    })
    .catch((error) => {
      const message = error.message;
      console.error(message);
      showMessage(message, "error", res);
    });
}

function showMessage(message, type, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(`
    <div class="${type}">
      ${message}
    </div>
  `);
  res.end();
}
