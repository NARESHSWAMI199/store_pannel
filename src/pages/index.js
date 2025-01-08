import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import {OverviewBox } from 'src/sections/overview/overview-users';
import { OverviewLatestItems } from 'src/sections/overview/overview-latest-items';
import { OverviewItems } from 'src/sections/overview/overview-sales';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';
import { host, suId } from 'src/utils/util';
import { useRouter } from 'next/router';
import { StockTraffic } from 'src/sections/overview/stock-traffic';
import Link from 'next/link';





const now = new Date();

const Page = (props) =>  {

const [currentYearDataMonths, setCurrentYearDataMonths] = useState([])
const [lastYearDataMonths, setLastYearDataMonths] = useState([])
  const [years,setYears] = useState([])
const [dashboardData,setDashboardData] = useState({
  items : {},
  newItems : {},
  oldItems : {},
  inStock : {},
  outStock : {}
})    
const [items,setItems] = useState([])
const currentYear = new Date().getFullYear();
const auth = useAuth()
const user = auth.user
const router = useRouter();

useEffect(()=>{
  axios.defaults.headers = {
    Authorization : auth.token
  }
  axios.get(host+"/wholesale/plan/is-active")
  .then(res => {
    let planIsActive = res.data.planIsActive;
    if(planIsActive){
      console.log(planIsActive)
    }else{
        router.push("/plans")
    }
  }).catch(err=>{
    console.log(err)
  })

},[])




// Getting All Stores 
useEffect( ()=>{
    const getData = async () => {
      axios.defaults.headers = {
        Authorization : auth.token
      }
      await axios.post(host+"/wholesale/item/all",{storeId : auth.store?.id})
      .then(res => {
          const data = res.data.content;
          setItems(data);
      })
      .catch(err => {
        console.log(err)
      } )
    }
    if(!!auth.store){
      getData();
    }


  },[])

  // Get current year store count
  useEffect(() => {
      axios.defaults.headers = {
        Authorization: auth.token
      }
        axios.post(host + "/wholesale/dashboard/graph/months/", {
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
    axios.post(host + "/wholesale/dashboard/graph/months/", {
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
      await axios.get(host +"/wholesale/dashboard/counts")
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
            lg={ 4}
          >
           <Link 
            href={{
                pathname : "/items"
              }} 
              style={{textDecoration:'none'}} >
            <OverviewBox
              title="ITEMS"
              sx={{ height: '100%' }}
              value={dashboardData.items}
            /> </Link>
          </Grid>


          <Grid
            xs={12}
            sm={6}
            lg={ 4}
          >
          <Link style={{
            textDecoration:'none'
           }}
            href={{
              pathname : "/items/label/N"
            }} > 
          <OverviewBox
               title="NEW ITEMS"
              sx={{ height: '100%' }}
              value={dashboardData.newItems}
            /> </Link>
          </Grid>


          <Grid
              xs={12}
              sm={6}
              lg={4}
            >
            <Link style={{
              textDecoration:'none'
            }}
            href={{
              pathname : "/items/label/O"
            }}>  
            <OverviewBox
                title="OLD ITEMS"
                sx={{ height: '100%' }}
                value={dashboardData.oldItems}
              /> </Link>
            </Grid>

          <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <OverviewTraffic
              chartSeries={[
                getPercentage(dashboardData.newItems.all, dashboardData.items.all), 
                getPercentage(dashboardData.oldItems.all, dashboardData.items.all), 
              ]}
              title = "Items Labels Detail"
              labels={['New Items', 'Old Items']}
              sx={{ height: '100%' }}
            />
          </Grid>

          <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <StockTraffic
              chartSeries={[
                getPercentage(dashboardData.inStock.all, dashboardData.items.all), 
                getPercentage(dashboardData.outStock.all, dashboardData.items.all), 
              ]}
              title = "Items Stock Detail"
              labels={['In stock', 'Out of stock']}
              sx={{ height: '100%' }}
            />
          </Grid>



          
          <Grid
            xs={12}
            lg={8}
          >
            <OverviewItems
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
       


      





   {/*     <Grid
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
            md={6}
            lg={4}
          >
         <OverviewLatestItems
              products = {items }
              sx={{ height: '100%' }}
            />
          </Grid>
          {/* <Grid
            xs={12}
            md={12}
            lg={8}
          >
            <OverviewLatestUsers
              users={users}
              sx={{ height: '100%' }}
            />
          </Grid> */}
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
