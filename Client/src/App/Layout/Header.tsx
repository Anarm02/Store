import { ShoppingCart } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
const midlinks = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];
const rightlinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];
const navStyles = {
  color: "inherit",
  typography: "h6",
  textDecoration: "none",
  "&:hover": { color: "grey.500" },
  "&.active": { color: "text.secondary" },
};
interface Props {
  isDark: boolean;
  switchMode: () => void;
}
export default function Header({ isDark, switchMode }: Props) {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" component={NavLink} sx={navStyles} to="/">
            ReStore
          </Typography>
          <Switch checked={isDark} onChange={switchMode} />
        </Box>
        <Box>
          <List sx={{ display: "flex" }}>
            {midlinks.map(({ title, path }) => (
              <ListItem component={NavLink} key={path} to={path} sx={navStyles}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton size="large" color="inherit" edge="start" sx={{ mr: 2 }}>
            <Badge badgeContent="4" color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          <List sx={{ display: "flex" }}>
            {rightlinks.map(({ title, path }) => (
              <ListItem component={NavLink} key={path} to={path} sx={navStyles}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
