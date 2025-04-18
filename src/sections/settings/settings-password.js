import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';


export const SettingsPassword = (props) => {
  const [values, setValues] = useState({
    password: '',
    confirm: ''
  });

  const auth = useAuth()
  const user = auth.user;
  const [error, setError] = useState('')



  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e) => {
      event.preventDefault();
      const form = e.target;
      const formData = new FormData(form)
      let password = formData.get("password");
      let confirm = formData.get("confirm");

      if (password !== confirm) {
        setError("Confirm password doesn't watch.")
        return false;
      }

      let success = props.handleSubmit(user.slug,password)

      if(success) {
        form.reset()
        setValues({})
      } 

    },[])


  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
          <Stack
            spacing={3}
            sx={{ maxWidth: 400 }}
          >
            <TextField
              fullWidth
              label="Password"
              name="password"
              onClick={(e) => setError('')}
              onChange={handleChange}
              type="password"
              value={values.password}
              required
            />
            <TextField
              fullWidth
              label="Password (Confirm)"
              name="confirm"
              onClick={(e) =>setError('')}
              onChange={handleChange}
              type="password"
              value={values.confirm}
              required
            />
          </Stack>
          <span style={{ color: 'red' }}>{error}</span> 
        </CardContent>
        <Divider />
        
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button 
            type='submit' 
            variant="contained"
          >
            Update
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
