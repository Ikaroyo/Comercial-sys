const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const chokidar = require("chokidar");

const router = express.Router();

const dataFolder = path.join(__dirname, "..", "data");
const reclamosPath = path.join(dataFolder, "reclamos.json");
const solicitudesPath = path.join(dataFolder, "solicitudes.json");

// Asegurarse de que la carpeta de datos exista
fs.mkdir(dataFolder, { recursive: true }).catch(console.error);

// Función auxiliar para leer archivos JSON
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

// Función auxiliar para escribir archivos JSON
async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Configurar el watcher para los archivos
const watcher = chokidar.watch([reclamosPath, solicitudesPath], {
  persistent: true,
  ignoreInitial: true,
});

watcher.on("change", (path) => {
  console.log(`Archivo modificado: ${path}`);
});

// Obtener todos los reclamos
router.get("/reclamos", async (req, res) => {
  try {
    const reclamos = await readJsonFile(reclamosPath);
    res.json(reclamos);
  } catch (error) {
    res.status(500).json({ error: "Error al leer los reclamos" });
  }
});

// Agregar un nuevo reclamo
router.post("/reclamos", async (req, res) => {
  try {
    const reclamos = await readJsonFile(reclamosPath);
    const nuevoReclamo = {
      id: Date.now(),
      tipo: "Reclamo",
      fecha: new Date().toISOString(),
      ...req.body,
    };
    reclamos.push(nuevoReclamo);
    await writeJsonFile(reclamosPath, reclamos);
    res.status(201).json(nuevoReclamo);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el reclamo" });
  }
});

// Obtener todas las solicitudes
router.get("/solicitudes", async (req, res) => {
  try {
    const solicitudes = await readJsonFile(solicitudesPath);
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: "Error al leer las solicitudes" });
  }
});

// Agregar una nueva solicitud
router.post("/solicitudes", async (req, res) => {
  try {
    const solicitudes = await readJsonFile(solicitudesPath);
    const nuevaSolicitud = {
      id: Date.now(),
      tipo: "Solicitud",
      fecha: new Date().toISOString(),
      ...req.body,
    };
    solicitudes.push(nuevaSolicitud);
    await writeJsonFile(solicitudesPath, solicitudes);
    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar la solicitud" });
  }
});

// Obtener todos los registros (reclamos y solicitudes)
router.get("/registros", async (req, res) => {
  try {
    const reclamos = await readJsonFile(reclamosPath);
    const solicitudes = await readJsonFile(solicitudesPath);
    const registros = [...reclamos, ...solicitudes];
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: "Error al leer los registros" });
  }
});

// Actualizar un reclamo
router.put("/reclamos/:id", async (req, res) => {
  try {
    const reclamos = await readJsonFile(reclamosPath);
    const index = reclamos.findIndex((r) => r.id === parseInt(req.params.id));
    if (index !== -1) {
      reclamos[index] = { ...reclamos[index], ...req.body };
      await writeJsonFile(reclamosPath, reclamos);
      res.json(reclamos[index]);
    } else {
      res.status(404).json({ error: "Reclamo no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el reclamo" });
  }
});

// Actualizar una solicitud
router.put("/solicitudes/:id", async (req, res) => {
  try {
    const solicitudes = await readJsonFile(solicitudesPath);
    const index = solicitudes.findIndex(
      (s) => s.id === parseInt(req.params.id)
    );
    if (index !== -1) {
      solicitudes[index] = { ...solicitudes[index], ...req.body };
      await writeJsonFile(solicitudesPath, solicitudes);
      res.json(solicitudes[index]);
    } else {
      res.status(404).json({ error: "Solicitud no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la solicitud" });
  }
});

module.exports = router;
