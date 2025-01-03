import React from 'react'
import HorizontalLinearStepper from 'src/sections/horizontal-stepper';
import Register from 'src/sections/register'
import CreateStore from 'src/sections/createstore'
const Page = () => {
  return (
    <>
        <HorizontalLinearStepper register={<Register/>} store={<CreateStore/>}  />
    </>
  )
}

export default Page
