import * as React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Select from "@mui/material/Select";
import router from "next/router";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteProduct,
  getProductCount,
  getProductPage,
  getProductSearch,
} from "@/service/serverService";
import { Add } from "@mui/icons-material";
import PreviewImage from "@/components/ImagePreview";

export default function DataTable() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [count, setCount] = useState<number>(0);
  const [data, setData] = useState<Product[]>([]);
  const [sort, setSort] = useState<string>("ASC");
  const [columnname, setColumnname] = useState<string>("id");
  const [search, setSearch] = useState<string>("");
  const [searchSelect, setSearchSelect] = useState<string>("");
  const [confirmBox, setConfirmBox] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product>();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "Product_Image",
      headerName: "รูปภาพ",
      width: 130,
      renderCell: (params) => PreviewImage(params.value),
    },
    { field: "Product_Name", headerName: "ชื่อสินค้า", width: 130 },
    { field: "Product_Code", headerName: "รหัสบาร์โค้ด", width: 130 },
    {
      field: "Product_Stock",
      headerName: "จำนวนสินค้าคงเหลือ",
      type: "number",
      width: 130,
      renderCell: (params) => params.value.toLocaleString("en-EN"),
    },
    {
      field: "productunit",
      headerName: "ลักษณะนาม",
      sortable: false,
      width: 100,
      renderCell: (params) => 
        params.value?.Productunit_Name
    },
    {
      field: "Product_Price",
      headerName: "ราคาสินค้า",
      sortable: false,
      width: 90,
      renderCell: (params) => params.value.toLocaleString("en-EN"),
    },
    {
      field: "Product_Description",
      headerName: "รายละเอียดสินค้า",
      sortable: false,
      width: 200,
    },
  
    {
      field: "Product_Status",
      headerName: "สถานะสินค้า",
      sortable: false,
      width: 100,
      renderCell: (params) =>
        params.value === 1 ? "แสดงสินค้า" : "ไม่แสดงสินค้า",
    },
    {
      headerName: "",
      field: ".",
      sortable: false,
      width: 180,
      type: "string",
      renderCell: ({ row }: GridRenderCellParams<any>) => (
        <Stack direction="row">
          <IconButton
            aria-label="edit"
            size="large"
            onClick={() => router.push("/staff/product/edit/" + row.id)}
          >
            <ModeEditIcon color="warning" fontSize="inherit" />
          </IconButton>
          <IconButton
            aria-label="delete"
            size="large"
            onClick={() => {
              handleClickOpen();
              setSelectedProduct(row);
            }}
          >
            <DeleteIcon color="error" fontSize="inherit" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [page, limit, sort, columnname]);

  async function fetchData() {
    await getProductCount()
      .then((data) => {
        setCount(data.count);
      })
      .catch((e) => {
        console.log(e);
      });

    await getProductPage(page, limit, columnname, sort)
      .then((data) => {
        setData(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const handlePagination = (e: any) => {
    setPage(e.page + 1);
    setLimit(e.pageSize);
  };

  const handleSort = (e: any) => {
    // {field: 'Product_Image', sort: 'asc'}
    if (e[0] == undefined) return fetchData();
    setColumnname(e[0].field);
    setSort(e[0].sort);
  };

  const handleSearch = (e: any) => {
    if (e.target.value === "") return fetchData();
    setSearch(e.target.value);
  };

  const onSearch = async () => {
    await getProductSearch(search, searchSelect)
      .then((data) => {
        if (data[0]) setData(data);
        else fetchData();
      })
      .catch((e) => {
        fetchData();
      });
  };

  const handleSearchSelect = async (e: any) => {
    setSearchSelect(e.target.value);
  };

  const handleClickOpen = () => {
    setConfirmBox(true);
  };

  const handleClose = () => {
    setConfirmBox(false);
  };

  return (
    <Layout>
      {/* confirm delete product */}
      <Dialog
        open={confirmBox}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`ยืนยันที่จะลบ "${selectedProduct?.Product_Name}" ใช่หรือไม่`}
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ยกเลิก</Button>
          <Button
            onClick={() => {
              deleteProduct(Number(selectedProduct?.id)).then((data) => {
                if (data) {
                  handleClose();
                  fetchData();
                }
              });
            }}
            color={"warning"}
            autoFocus
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
      <div style={{ height: 600, width: "80%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Typography variant="h6">รายการสินค้า</Typography>
            <Button
              sx={{ ml: 1 }}
              variant="contained"
              onClick={() => router.push("/staff/product/add")}
            >
              <Add /> เพิ่มสินค้า
            </Button>
          </Box>
          <Box>
            <FormControl sx={{ mb: 1 }}>
              <Typography variant="body2">เลือกค้นหา</Typography>
              <Select
                sx={{
                  alignItems: "center",
                  width: 150,
                }}
                size="small"
                value={searchSelect}
                onChange={handleSearchSelect}
              >
                <MenuItem value={"Product_Name"}>ชื่อสินค้า</MenuItem>
                <MenuItem value={"Product_Code"}>รหัสบาร์โค้ด</MenuItem>
                <MenuItem value={"Product_Stock"}>จำนวนสินค้าคงเหลือ</MenuItem>
                <MenuItem value={"Product_Price"}>ราคาสินค้า</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ mb: 1, ml: 1 }}>
              <Typography variant="body2">ค้นหา</Typography>
              <OutlinedInput
                sx={{
                  alignItems: "center",
                  width: 200,
                }}
                size="small"
                id="outlined-basic"
                onChange={handleSearch}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={onSearch}
                      // onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
        </Box>
        <DataGrid
          rows={data}
          componentsProps={{
            pagination: {
              labelRowsPerPage: "แสดงรายการ",
            },
          }}
          getRowHeight={() => 100}
          columns={columns}
          rowCount={count}
          initialState={{
            pagination: {
              paginationModel: { page: page - 1, pageSize: limit },
            },
          }}
          pageSizeOptions={[1, 5, 15, 20, 50, 100]}
          paginationMode="server"
          onSortModelChange={handleSort}
          onPaginationModelChange={handlePagination}
        />
      </div>
    </Layout>
  );
}
