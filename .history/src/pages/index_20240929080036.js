import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Unstable_Grid2 as Grid, Link } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import {OverviewUsers } from 'src/sections/overview/overview-users';
import { OverviewLatestUsers } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewStores } from 'src/sections/overview/overview-sales';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';
import { host } from 'src/utils/util';
import { useRouter } from 'next/navigation';





const now = new Date();

const Page = (props) =>  {
const [wholesales,setWholesales] = useState([])
const [users,setAllUsers] = useState([])
const [currentYearDataMonths, setCurrentYearDataMonths] = useState([])
const [lastYearDataMonths, setLastYearDataMonths] = useState([])
  const [years,setYears] = useState([])
const [dashboardData,setDashboardData] = useState({
  users : {},
  retailers : {},
  wholesalers : {},
  staffs : {}
})    
const currentYear = new Date().getFullYear();
const auth = useAuth()
const router = useRouter();


// Getting All Stores 
useEffect( ()=>{
    const getData = async () => {
      axios.defaults.headers = {
        Authorization : auth.token
      }
      await axios.post(host+"/admin/store/all",{})
      .then(res => {
          const data = res.data.content;
          setWholesales(data);
      })
      .catch(err => {
        console.log(err)
      } )
    }
    getData();

  },[])

  // Get current year store count
  useEffect(() => {
      axios.defaults.headers = {
        Authorization: auth.token
      }
        axios.post(host + "/admin/dashboard/graph/months/", {
          "year": currentYear
        })
        .then(res => {
          const months = res.data.res;
          let counts = []
          Object.keys(months).map(month => {
            counts.push(months[month])
          })
          setYears(Object.keys(months))
          setCurrentYearDataMonths(counts);
        })
        .catch(err => {
          console.log(err)
          let status = (!!err.response ? err.response.status : 0);
          if (status == 401) {
            auth.signOut();
            router.push("/auth/login")
          }
        })
    }, [])

  // Get store count of last year
  useEffect(() => {
    axios.defaults.headers = {
      Authorization: auth.token
    }
    axios.post(host + "/admin/dashboard/graph/months/", {
      "year": currentYear-1
    })
      .then(res => {
        const months = res.data.res;
        let counts = []
        Object.keys(months).map(month => {
          counts.push(months[month])
        })
        setLastYearDataMonths(counts);
      })
      .catch(err => {
        console.log(err)
      })
  }, [])


// Get all basics counts 
  useEffect( ()=>{
    const getData = async () => {
      axios.defaults.headers = {
        Authorization : auth.token
      }
      await axios.get(host+"/admin/dashboard/")
      .then(res => {
          const data = res.data;
          setDashboardData(data)
      })
      .catch(err => {
        console.log(err)
      } )
    }
    getData();

  },[])


// All users 


// Getting All Stores 
useEffect( ()=>{
  const getData = async () => {
    axios.defaults.headers = {
      Authorization : auth.token
    }
    await axios.post(host+"/admin/auth/all",{})
    .then(res => {
        const data = res.data.content;
        setAllUsers(data);
    })
    .catch(err => {
      console.log(err)
    } )
  }
  getData();

},[])



  const getPercentage = useCallback((currentCount,totalCount) =>{
    return Math.round((currentCount/totalCount) * 100);
  },[])
  return ( <>
    <Head>
      <title>
        Overview | Swami sales
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
           <Link href="/users" sx={{textDecoration:'none'}} > <OverviewUsers
              title="USERS"
              sx={{ height: '100%' }}
              value={dashboardData.users}
            /> </Link>
          </Grid>


          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
          <Link sx={{
            textDecoration:'none'
           }} href="/customers" > <OverviewUsers
               title="RETAILERS"
              sx={{ height: '100%' }}
              value={dashboardData.retailers}
            /> </Link>
          </Grid>



          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
          <Link sx={{
            textDecoration:'none'
           }} href="/wholesalers" >  <OverviewUsers
              title="WHOLESALERS"
              sx={{ height: '100%' }}
              value={dashboardData.wholesalers}
            /> </Link>
          </Grid>



          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
          <Link sx={{
            textDecoration:'none'
           }} href="/staffs" >  <OverviewUsers
              title='STAFFS'
              sx={{ height: '100%' }}
              value={dashboardData.staffs}
            /> </Link>
          </Grid>

 {/*          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalCustomers
              difference={16}
              positive={false}
              sx={{ height: '100%' }}
              value="1.6k"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTasksProgress
              sx={{ height: '100%' }}
              value={75.5}
            />
          </Grid> 
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalProfit
              sx={{ height: '100%' }}
              value="$15k"
            />
          </Grid>*/}
          <Grid
            xs={12}
            lg={8}
          >
            <OverviewStores
              chartSeries={[
                {
                  name: 'This year',
                  data: currentYearDataMonths
                },
                {
                  name: 'Last year',
                  data: lastYearDataMonths
                }
              ]}
              categories={years}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <OverviewTraffic
              chartSeries={[
                getPercentage(dashboardData.wholesalers.all, dashboardData.users.all), 
                getPercentage(dashboardData.staffs.all, dashboardData.users.all), 
                getPercentage(dashboardData.retailers.all, dashboardData.users.all), 
              ]}
              labels={['Wholesalers', 'Staffs', 'Retailers']}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
          >
         <OverviewLatestProducts
              products = {wholesales }
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={12}
            lg={8}
          >
            <OverviewLatestUsers
              users={users}
              sx={{ height: '100%' }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
  
  );
 }

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
