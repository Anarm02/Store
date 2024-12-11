import { AppBar, Switch, Toolbar, Typography } from "@mui/material";
interface Props {
  isDark: boolean;
  switchMode: () => void;
}
export default function Header({ isDark, switchMode }: Props) {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h5">ReStore</Typography>
        <Switch checked={isDark} onChange={switchMode} />
      </Toolbar>
    </AppBar>
  );
}
