import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

function ListadoTab() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/registros");
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Recargar cada 30 segundos
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    let resultado = data;

    if (tipoFiltro !== "todos") {
      resultado = resultado.filter((item) => item.tipo === tipoFiltro);
    }

    if (fechaInicio && fechaFin) {
      resultado = resultado.filter((item) => {
        const fecha = new Date(item.fecha);
        return fecha >= new Date(fechaInicio) && fecha <= new Date(fechaFin);
      });
    }

    if (filter) {
      resultado = resultado.filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    setFilteredData(resultado);
  }, [data, filter, tipoFiltro, fechaInicio, fechaFin]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleTipoFiltroChange = (event) => {
    setTipoFiltro(event.target.value);
  };

  const handleFechaInicioChange = (event) => {
    setFechaInicio(event.target.value);
  };

  const handleFechaFinChange = (event) => {
    setFechaFin(event.target.value);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditItem(null);
  };

  const handleSaveEdit = async () => {
    try {
      const url = `http://localhost:3001/api/${
        editItem.tipo === "Reclamo" ? "reclamos" : "solicitudes"
      }/${editItem.id}`;
      await axios.put(url, editItem);
      fetchData();
      setOpenDialog(false);
      setEditItem(null);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleExport = () => {
    const exportWindow = window.open(
      "",
      "ExportWindow",
      "width=800,height=600"
    );
    exportWindow.document.write(`
      <html>
        <head>
          <title>Listado de Registros</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
          <style>
            body {
              font-family: 'Roboto', sans-serif;
              padding: 20px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
          </style>
        </head>
        <body>
          <h1>Listado de Registros</h1>
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Agente</th>
                <th>Nombre y Apellido</th>
                <th>Calle Nº</th>
                <th>Fecha</th>
                <th>Número de Cuenta</th>
                <th>Email</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData
                .map(
                  (item) => `
                <tr>
                  <td>${item.tipo}</td>
                  <td>${item.empleado}</td>
                  <td>${item.nombreApellido}</td>
                  <td>${item.calle} ${item.numero}</td>
                  <td>${new Date(item.fecha).toLocaleDateString()}</td>
                  <td>${item.numeroCuenta}</td>
                  <td>${item.email}</td>
                  <td>${item.telefono}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);
    exportWindow.document.close();
  };

  return (
    <>
      <Button
        onClick={fetchData}
        variant="contained"
        color="primary"
        style={{ marginBottom: "1rem", marginRight: "1rem" }}
      >
        Recargar datos
      </Button>
      <Button
        onClick={handleExport}
        variant="contained"
        color="secondary"
        style={{ marginBottom: "1rem" }}
      >
        Exportar listado
      </Button>
      <FormControl fullWidth margin="normal">
        <InputLabel>Tipo</InputLabel>
        <Select value={tipoFiltro} onChange={handleTipoFiltroChange}>
          <MenuItem value="todos">Todos</MenuItem>
          <MenuItem value="Reclamo">Reclamos</MenuItem>
          <MenuItem value="Solicitud">Solicitudes</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Filtrar"
        value={filter}
        onChange={handleFilterChange}
        margin="normal"
      />
      <TextField
        type="date"
        label="Fecha Inicio"
        value={fechaInicio}
        onChange={handleFechaInicioChange}
        InputLabelProps={{ shrink: true }}
        margin="normal"
      />
      <TextField
        type="date"
        label="Fecha Fin"
        value={fechaFin}
        onChange={handleFechaFinChange}
        InputLabelProps={{ shrink: true }}
        margin="normal"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Agente</TableCell>
              <TableCell>Nombre y Apellido</TableCell>
              <TableCell>Calle Nº</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Número de Cuenta</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.tipo}</TableCell>
                <TableCell>{item.empleado}</TableCell>
                <TableCell>{item.nombreApellido}</TableCell>
                <TableCell>{`${item.calle} ${item.numero}`}</TableCell>
                <TableCell>
                  {new Date(item.fecha).toLocaleDateString()}
                </TableCell>
                <TableCell>{item.numeroCuenta}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.telefono}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(item)}>Editar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Editar {editItem?.tipo}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Número de Cuenta"
            name="numeroCuenta"
            value={editItem?.numeroCuenta || ""}
            onChange={handleEditChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={editItem?.email || ""}
            onChange={handleEditChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveEdit} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ListadoTab;
