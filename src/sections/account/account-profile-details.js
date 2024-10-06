import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  InputLabel,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
export const AccountProfileDetails = (props) => {

  const [values,setValues] = useState(props.user)
  const {groups} = props
  const [assignedGroup , setAssignedGroup] = useState(props.assignGroup)

  useEffect(()=>{
    setValues(props.user)
    setAssignedGroup(props.assignGroup)
  },[props.user,props.assignGroup])

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = (event) => {
      event.preventDefault();
      let form = event.target
      let formData = new FormData(form)
      const data = {
        username : formData.get("username"),
        email :  formData.get("email"),
        contact : formData.get("contact"),
        groupList : assignedGroup
      }
      props.updateProfile(data)
    }


      

    const handleChangeMultiple = (event) =>{
      const { options } = event.target;
      const value = [];
      for (let i = 0, l = options.length; i < l; i += 1) {
        if (options[i].selected) {
          value.push(options[i].value);
        }
      }
      setAssignedGroup(value);
  }


  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={24}
                md={6}
              >
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="Username"
                  name="username"
                  onChange={handleChange}
                  required
                  value={values.username || ''}
                  InputLabelProps={{shrink:true}}
                />
              </Grid>
       
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  type='email'
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email || ''}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="contact"
                  onChange={handleChange}
                  type="number"
                  value={values.contact || ''}
                />
              </Grid>
         
              <Grid
                xs={12}
                md={6}
              >
              {(props.user.userType =="S" || props.user.userType =="SA" ) ?
             <FormControl sx={{ minWidth: 350, maxWidth: 500 }}>
                      <InputLabel shrink htmlFor="select-multiple-native">
                        Groups
                      </InputLabel>
                      <Select
                        multiple
                        native
                        disabled={props.userType =="Owner"}
                        name="groups"
                        // @ts-ignore Typings are not considering `native`
                        onChange={handleChangeMultiple}
                        label="Native"
                        inputProps={{
                          id: 'select-multiple-native',
                        }}
                      >
                        {groups.map((group) => (
                          <option selected={props.assignGroup.includes(group.id)} key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </Select>
                </FormControl> 
                :
                <TextField
                  fullWidth
                  label="User type"
                  name="userType"
                  value={values.userType == "W" ? "Wholesaler" : "Retailer" }
                  InputLabelProps={{shrink:true}}
                />

              }   
              </Grid> 
              

              

            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
