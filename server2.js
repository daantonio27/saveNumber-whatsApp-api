const request = require("request");

function sendMessage(to) {
  const options = {
    url: "https://graph.facebook.com/v15.0/106663595689364/messages",
    method: "POST",
    headers: {
      Authorization:
        "Bearer EAAOphJFFJygBAFkCOS4aIBPCJQBVDfFZCaxZBCTWWTE1BM26SszkUSjkkONFleiS1VvGjZCPMAO6LwE5tFgMLn0PJZAiUCUfN5wNnr1b2FV1DTt2YRGnHrrZBBvtkLyu1miqCx7ddXL6SEQv2Y4zz8f2235NTsDGo58sHV70OGZA2v6Jk5AZBVM29wLr3URgDZASffQ0HXhLPvwpFAuZA5PhJ",
      "Content-Type": "application/json",
    },
    json: {
      messaging_product: "whatsapp",
      to: to,
      type: "template",
      template: {
        name: "hello_world",
        language: {
          code: "en_US",
        },
      },
    },
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error(error);
    } else {
      console.log(body);
    }
  });
}

// appeler votre fonction sendMessage avec la valeur saisie stockée dans une variable to 
const to = "221776795513";
sendMessage(to);
