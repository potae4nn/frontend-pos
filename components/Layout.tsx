import React, { ReactNode } from "react";
import MiniDrawer from "./Header";
import { Box } from "@mui/material";
import Header, { DrawerHeader } from "./Header";
import Footer from "./Footer";

type Props = {
  children?: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
