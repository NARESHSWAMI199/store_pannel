import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import bg from 'public/assets/bg2.png';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import HomeNavbar from 'src/sections/top-nav';

const steps = ['Register', 'Create Your Own Store', 'Payment'];

export default function HorizontalLinearStepper(props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const router = useRouter()
  const { register, store } = props;
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step) => {
    return step === steps.length -1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if(activeStep === 0 ){
        userRegister();
        return false
    }
    else if(activeStep === steps.length - 1){
        router.push("/pricing")
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if(activeStep === steps.length - 1){
        router.push("/")
    }
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const appBarRef = useRef(null);
  const [appBarHeight, setAppBarHeight] = useState(0);

  useEffect(() => {
    const getAppBarHeight = () => {
      if (appBarRef.current) {
        setAppBarHeight(appBarRef.current.clientHeight);
      }
    };

    getAppBarHeight(); 

    const resizeObserver = new ResizeObserver(getAppBarHeight);
    if (appBarRef.current) {
      resizeObserver.observe(appBarRef.current);
    }

    return () => {
      if (appBarRef.current) {
        resizeObserver.unobserve(appBarRef.current);
      }
    };
  }, []);


    const userRegister  = () => {
        let form = document.getElementById("register");
        console.log(form)
        form?.submit();
    }

  return (
    <Box
    sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw', 
        height: '100vh',
        backgroundImage:`url(${bg.src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        overflowX: 'hidden', /* Hide horizontal scrollbar */
        scrollbarWidth: 'none',
        p : 1 
    }}
 >
    <HomeNavbar navRef = {appBarRef} />

    <Grid container 
        sx={{
            display : 'flex',
            justifyContent : 'center',
            alignItems : 'center',
            minHeight : 'calc(100% - '+(appBarHeight+10)+'px)'
        }}>

        <Grid md={5} xs={12} 
            sx={{
                background : 'white',
                marginTop : (appBarHeight+10)+'px',
                borderRadius : 2,
                px : 5,
                py : 3
            }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepOptional(index)) {
                    labelProps.optional = (
                    <Typography variant="caption">Optional</Typography>
                    );
                }
                if (isStepSkipped(index)) {
                    stepProps.completed = false;
                }
                return (
                    <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                );
                })}
            </Stepper>

            <React.Fragment>
                {activeStep === 0 ? register : store}
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    >
                    Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {isStepOptional(activeStep) && (
                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                        Skip
                    </Button>
                    )}
                    {activeStep !== steps.length &&
                        <Button onClick={handleNext} >
                        {activeStep === steps.length -1  ? 'Go for payment' : 'Save & Next'}
                        </Button>
                    }
                </Box>
            </React.Fragment>
                
        </Grid>
    </Grid>
    </Box>
  );
}
