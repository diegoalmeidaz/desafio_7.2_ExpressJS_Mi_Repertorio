const fs = require("fs");
const express = require("express");
const app = express();
const cors = require("cors");

PORT = 3000;

// Iniciador de puerto
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Habilitar CORS y Mod de json
app.use(express.json());
app.use(cors());

// Seccion Middleware: Si algun campo esta vacio, se mostrara error 400 en network
app.use((req, res, next) => {
  const cancion = req.body;
  // Si algún campo de la canción está vacío, se muestra un mensaje de error
  if (Object.values(cancion).some((value) => value === "")) {
    return res.status(400).json({ message: "Faltan campos por completar" });
  }
  next();
});

// Carga Archivo index
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Carga Archivo json
app.get("/canciones", (req, res) => {
  try {
    const canciones = JSON.parse(fs.readFileSync("repertorios.json", "utf8"));
    res.json(canciones);
  } catch (error) {
    res.json({ message: "No es posible encontrar el repertorio" });
  }
});

// Agregar cancion
app.post("/canciones", (req, res) => {
  const cancion = req.body;
  const canciones = JSON.parse(fs.readFileSync("repertorios.json", "utf8"));
  canciones.push(cancion);
  fs.writeFileSync("repertorios.json", JSON.stringify(canciones));
  res.send("Canción agregada con exito al repertorio");
});

// Actualizar cancion
app.put("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const cancion = req.body;
  const canciones = JSON.parse(fs.readFileSync("repertorios.json"));
  const index = canciones.findIndex((cancion) => cancion.id == id);
  canciones[index] = cancion;
  if (!id) {
    return res.status(404).json({
      message: "No hay ID definida",
    });
  }
  fs.writeFileSync("repertorios.json", JSON.stringify(canciones));
  res.send("Canción modificada en el repertorio");
});

// Eliminar cancion
app.delete("/canciones/:id", (req, res) => {
  const { id } = req.params;
  let canciones = JSON.parse(fs.readFileSync("repertorios.json", "utf8"));
  const index = canciones.findIndex((cancion) => cancion.id === parseInt(id));
  if (!id) {
    return res.status(404).json({
      message: "No hay ID definida",
    });
  }
  canciones.splice(index, 1);
  fs.writeFileSync("repertorios.json", JSON.stringify(canciones));
  res.status(202).json({
    message: "Cancion eliminada",
  });
});
