import axios from "axios";

const API_KEY = "AIzaSyC32GN759QiVJZlEQLa5R2fML53h0q9zEQ";

const data = {
  contents: [
    {
      parts: [
        {
          text: "Explain how AI works,answer in russian language",
        },
      ],
    },
  ],
};

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

async function generateContent() {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      data,
      config
    );
    console.log("Response:", response.data);
    response.data.candidates.forEach((element) => {
      console.log(element.content);
    });
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

// Вызов функции
generateContent();
