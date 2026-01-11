import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/reply", async (req, res) => {
  try {
    const userMessage = req.body.message || "Saludame oscuro";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Sos Calavera Kreisen, un espíritu oscuro costarricense. Hablas corto, misterioso, estilo tico."
          },
          { role: "user", content: userMessage }
        ],
        max_tokens: 60
      })
    });

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content || "El silencio habla...";

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Error del espíritu" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Calavera Kreisen despierto en el puerto", PORT);
});
