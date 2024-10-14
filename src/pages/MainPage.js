import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import TabPanel from "../components/TabPanel";
import ReclamoForm from "../components/ReclamoForm";
import SolicitudForm from "../components/SolicitudForm";
import ListadoTab from "../components/ListadoTab";

function MainPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="Pestañas de formularios"
      >
        <Tab label="Reclamos" />
        <Tab label="Solicitud Email" />
        <Tab label="Listado" />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <ReclamoForm />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <SolicitudForm />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <ListadoTab />
      </TabPanel>
    </Box>
  );
}

export default MainPage;
