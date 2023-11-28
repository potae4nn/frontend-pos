import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InventoryIcon from "@mui/icons-material/Inventory";
import { blue } from "@mui/material/colors";
import { ListItem, Stack } from "@mui/material";
import Link from "next/link";
import { BarChart, Dashboard, DashboardCustomizeOutlined, Person } from "@mui/icons-material";
import { useRouter } from "next/router";
import TuneIcon from "@mui/icons-material/Tune";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

type MenuProp = {
  open: boolean;
  onDrawerClose: () => void;
};

export default function Menu({ open, onDrawerClose }: MenuProp) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ backgroundColor: blue }}
        >
          <IconButton onClick={onDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </Stack>
      </DrawerHeader>
      <Divider />

      <Divider />
      <List>
        {/* dashboard */}
        <Link href="/staff/dashboard" passHref>
          <ListItem
            button
            className={
              router.pathname === "/staff/dashboard" ? "Mui-selected" : ""
            }
          >
            <ListItemIcon>
              <DashboardCustomizeOutlined />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </Link>

        {/* home */}
        <Link href="/staff/product" passHref>
          <ListItem
            button
            className={
              router.pathname === "/staff/product" ? "Mui-selected" : ""
            }
          >
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="จัดการสินค้า" />
          </ListItem>
        </Link>

        {/* Report */}
        <Link href="/report" passHref>
          <ListItem
            button
            className={router.pathname === "/report" ? "Mui-selected" : ""}
          >
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText primary="รายงาน" />
          </ListItem>
        </Link>

        {/* Aboutus */}
        <Link href="/subdivition" passHref>
          <ListItem
            button
            className={router.pathname === "/subdivition" ? "Mui-selected" : ""}
          >
            <ListItemIcon>
              <TuneIcon />
            </ListItemIcon>
            <ListItemText primary="จัดการหน่วยงาน" />
          </ListItem>
        </Link>

        {/* Staff Register */}
        <Link href="/managestaff" passHref>
          <ListItem
            button
            className={router.pathname === "/managestaff" ? "Mui-selected" : ""}
          >
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="จัดการรายชื่อพนักงาน" />
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
}
