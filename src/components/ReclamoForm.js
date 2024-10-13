import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";

function ReclamoForm() {
  const [formData, setFormData] = useState({
    empleado: "",
    fecha: new Date().toISOString().split("T")[0],
    numeroCuenta: "",
    email: "",
    telefono: "",
    comentario: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    // Cargar el nombre del empleado desde el almacenamiento local
    const empleadoGuardado = localStorage.getItem("empleado");
    if (empleadoGuardado) {
      setFormData((prevData) => ({ ...prevData, empleado: empleadoGuardado }));
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "empleado") {
      localStorage.setItem("empleado", value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/reclamos",
        formData
      );
      console.log("Reclamo enviado:", response.data);
      setSnackbarMessage("Reclamo enviado con éxito");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      // Limpiar el formulario excepto el empleado
      setFormData((prevData) => ({
        ...prevData,
        fecha: new Date().toISOString().split("T")[0],
        numeroCuenta: "",
        email: "",
        telefono: "",
        comentario: "",
      }));
    } catch (error) {
      console.error("Error al enviar el reclamo:", error);
      setSnackbarMessage("Error al enviar el reclamo");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Empleado"
            name="empleado"
            value={formData.empleado}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Fecha"
            type="date"
            name="fecha"
            value={formData.fecha}
            InputLabelProps={{ shrink: true }}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Número de Cuenta"
            name="numeroCuenta"
            value={formData.numeroCuenta}
            onChange={handleChange}
            inputProps={{ pattern: "\\d{7}/\\d{3}" }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email de Contacto"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Teléfono de Contacto"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Comentario"
            name="comentario"
            multiline
            rows={4}
            value={formData.comentario}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Guardar Reclamo
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </form>
  );
}

export default ReclamoForm;
