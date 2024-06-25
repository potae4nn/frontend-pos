import Layout from "@/components/Layout";
import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { getInvoiceCountDateSum } from "@/service/serverService";
// import { ChartContainer, BarPlot } from '@mui/x-charts';


const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

type Props = {};

type Count = {
  Sum_Invoice_Total_Amount: number;
  Sum_Invoice_Sub_Total: number;
};

const Index = (props: Props) => {
  const [countInvoice, setCountInvoice] = useState<Count>();

  useEffect(() => {
    fetch();
  }, []);
  const fetch = async () => {
    await getInvoiceCountDateSum().then((data) => {
      setCountInvoice(data);
    });
  };
  return (
    <Layout>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Dashboard
      </Typography>
      <Grid container spacing={2} minHeight={160}>
        <CardNumber
          total={Number(countInvoice?.Sum_Invoice_Total_Amount)}
          label="ยอดขายรายวัน"
          bgColor="#14a37f"
          natureCharacter="บาท"
          iconCard={<MonetizationOnIcon fontSize="large" />}
        />
        <CardNumber
          total={Number(countInvoice?.Sum_Invoice_Sub_Total)}
          label="จำนวนทั้งหมดที่ขายได้(รายวัน)"
          bgColor="#1769aa"
          natureCharacter="รายการ"
          iconCard={<ReceiptLongIcon fontSize="large" />}
        />
      </Grid>
      {/* <TinyBarChart/> */}
    </Layout>
  );
};

type Card = {
  total: number;
  label: string;
  bgColor: string;
  natureCharacter: string;
  iconCard: any;
};

// function TinyBarChart() {
//     return (
//       <ChartContainer
//         width={500}
//         height={300}
//         series={[{ data: uData, label: 'uv', type: 'bar' }]}
//         xAxis={[{ scaleType: 'band', data: xLabels }]}
//       >
//         <BarPlot />
//       </ChartContainer>
//     );
//   }

const CardNumber = ({
  total,
  label,
  bgColor,
  natureCharacter,
  iconCard,
}: Card) => {
  return (
    <Card sx={{ display: "flex", margin: 2 }}>
      <Box sx={{ width: "50%", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h6">
            {label}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          ></Typography>
        </CardContent>
      </Box>
      <Box sx={{ width: "50%", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto", backgroundColor: bgColor }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {iconCard}
            </Box>
            <Typography component="div" variant="h5">
              {total.toLocaleString("en-EN", { minimumFractionDigits: 2 })}
            </Typography>
            <Typography variant="body1" color="text.secondary" component="div">
              {natureCharacter}
            </Typography>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default Index;
