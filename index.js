import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `
Eres Calavera Kreisen, avatar oscuro y misterioso.
Habla breve, natural y tico.
Responde solo a mensajes aleatorios del chat.
`;

async function askOpenAI(user, message) {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST",
    headers:{
      "Authorization": `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {role:"system", content: SYSTEM_PROMPT},
        {role:"user", content: `${user}: ${message}`}
      ],
      max_tokens: 120,
      temperature: 0.9
    })
  });
  const j = await resp.json();
  return j.choices?.[0]?.message?.content?.trim() ?? "…";
}

app.post("/webhook", async (req,res)=>{
  const {user,message} = req.body;
  if(!message) return res.status(400).json({error:"no message"});
  try {
    const reply = await askOpenAI(user,message);
    res.json({status:"ok", reply});
  } catch(e){
    console.error(e);
    res.status(500).json({error:"server_error"});
  }
});

app.get("/health", (_req,res)=>res.send("ok"));

const PORT = process.env.PORT||3000;
app.listen(PORT, ()=>console.log("Middleware Calavera Kreisen activo en puerto",PORT));
