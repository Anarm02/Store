import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  Container,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import agent from "../../App/Api/agent";
import { useState } from "react";

export default function AboutPage() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  function getValidationError() {
    agent.TestErrors.getValidationError()
      .then(() => console.log("Can't see this"))
      .catch((err) => setValidationErrors(err));
  }
  return (
    <Container>
      <Typography variant="h2">Errors for testing purpose</Typography>
      <ButtonGroup fullWidth>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get400error().catch((err) => console.log(err))
          }
        >
          Test 400
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get401error().catch((err) => console.log(err))
          }
        >
          Test 401
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get404error().catch((err) => console.log(err))
          }
        >
          Test 404
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get500error().catch((err) => console.log(err))
          }
        >
          Test 500
        </Button>
        <Button variant="contained" onClick={getValidationError}>
          Validation Error
        </Button>
      </ButtonGroup>
      {validationErrors.length > 0 && (
        <Alert severity="error">
          <AlertTitle>Validation Errors</AlertTitle>
          <List>
            {validationErrors.map((err) => (
              <ListItem key={err}>{err}</ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Container>
  );
}
