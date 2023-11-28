import Layout from "@/components/Layout";
import {
  getCategory,
  getProductunit,
  saveProduct,
} from "@/service/serverService";
import { Category, Product, Productunit } from "@/types/Product";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Photo, SaveAsOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import PreviewImage from "@/components/ImagePreview";

type Props = {
  product: Product;
};

const schema = yup
  .object({
    Product_Name: yup.string().required(),
    Product_Code: yup.string().required(),
    Product_Stock: yup
      .number()
      .positive("ต้องเป็นตัวเลขเท่านั้น")
      .integer()
      .required(),
    Product_Status: yup.number().required(),
    Product_Price: yup
      .number()
      .positive("ต้องเป็นตัวเลขเท่านั้น")
      .integer()
      .required(),
    Product_Description: yup.string().required(),
    Product_Image: yup.mixed().required(),
    categoryId: yup.number().required(),
    productunitId: yup.number().required(),
    PreviewImage: yup.string(),
  })
  .required();

const Add = ({}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    setFocus,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      Product_Name: '',
      Product_Code: '',
      Product_Stock: 0,
      Product_Price: 0,
      Product_Status: 0,
      Product_Description: '',
      Product_Image: '',
      PreviewImage: '',
      categoryId: 0,
      productunitId:0
    },
  });
  const router = useRouter();
  const [category, setCategory] = useState<Category[]>([]);
  const [Productunit, setProductunit] = useState<Productunit[]>([]);

  useEffect(() => {
    fetch();
  }, []);

  async function fetch() {
    await getCategory().then((data) => {
      setCategory(data);
    });
    await getProductunit().then((data) => {
      setProductunit(data);
    });
  }

  const onSubmit: SubmitHandler<any> = async (values: Product, e) => {
    e?.preventDefault();
    await saveProduct(values)
      .then((data) => {
        if (data) return router.push("/staff/product");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const TextBoxWidth = { m: 1, width: "80ch" };
  const textError = { color: "red" };

  const generateOptionsCategory = () => {
    return category.map((option: Category) => {
      return (
        <MenuItem key={option.id} value={option.id}>
          {option.Category_Name}
        </MenuItem>
      );
    });
  };

  const generateOptionsProductunit = () => {
    return Productunit.map((option: Productunit) => {
      return (
        <MenuItem key={option.id} value={option.id}>
          {option.Productunit_Name}
        </MenuItem>
      );
    });
  };

  return (
    <Layout>
      <Typography variant="h6">เพิ่มสินค้า </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup>
          <FormControl sx={TextBoxWidth} variant="outlined">
            <TextField
              id="outlined-basic"
              label="ชื่อสินค้า"
              {...register("Product_Name")}
              variant="outlined"
            />{" "}
            <Typography sx={textError} variant="caption">
              {errors.Product_Name?.message}
            </Typography>
          </FormControl>
          <FormControl sx={TextBoxWidth} variant="outlined">
            <TextField
              id="outlined-basic"
              label="บาร์โค้ด"
              {...register("Product_Code")}
              variant="outlined"
            />
            <Typography sx={textError} variant="caption">
              {errors.Product_Code?.message}
            </Typography>
          </FormControl>
          <FormControl sx={TextBoxWidth} variant="outlined">
            <TextField
              id="outlined-basic"
              label="จำนวนสินค้าคงเหลือ"
              {...register("Product_Stock")}
              variant="outlined"
              type="number"
            />
            <Typography sx={textError} variant="caption">
              {errors.Product_Stock?.message}
            </Typography>
          </FormControl>
          <FormControl sx={TextBoxWidth} variant="outlined">
            <TextField
              id="outlined-basic"
              label="ราคาสินค้า"
              {...register("Product_Price")}
              variant="outlined"
              type="number"
            />
            <Typography sx={textError} variant="caption">
              {errors.Product_Price?.message}
            </Typography>
          </FormControl>
          <FormControl sx={TextBoxWidth} variant="outlined">
            <TextField
              label="รายละเอียดสินค้า"
              {...register("Product_Description")}
              variant="outlined"
            />{" "}
            <Typography sx={textError} variant="caption">
              {errors.Product_Description?.message}
            </Typography>
          </FormControl>
          <FormControl sx={TextBoxWidth} variant="outlined">
            <InputLabel htmlFor="select-category">Category</InputLabel>
            <Controller
              control={control}
              name="categoryId"
              render={({ field: { onChange, value } }) => (
                <Select id="select-category" onChange={onChange} value={value}>
                  {generateOptionsCategory()}
                </Select>
              )}
            />
          </FormControl>
          <FormControl sx={TextBoxWidth} variant="outlined">
            <InputLabel htmlFor="select-productunit">ลักษณะนาม</InputLabel>
            <Controller
              control={control}
              name="productunitId"
              render={({ field: { onChange, value } }) => (
                <Select id="select-productunit" onChange={onChange} value={value}>
                  {generateOptionsProductunit()}
                </Select>
              )}
            />
          </FormControl>

          <InputLabel sx={{ ml: 2, mb: -1 }}>รูปสินค้า</InputLabel>
          <Box sx={{ display: "flex" ,alignItems:"flex-start",flexDirection:"column",width:"80ch" }}>
            <Controller
              control={control}
              name="PreviewImage"
              render={({ field: { onChange, value } }) => (
                <Box sx={{ my: 1, marginLeft: 1 }}>
                  {PreviewImage(value)}
                </Box>
              )}
            />
            <FormControl
              sx={{ width: "20ch", marginLeft: 1}}
              variant="outlined"
            >
              <Button variant="contained" color="secondary" component="label">
                <Photo /> เลือกรูปสินค้า
                <input
                  type="file"
                  hidden
                  onChange={(e: React.ChangeEvent<any>) => {
                    setValue("Product_Image", e.target.files[0]);
                    setValue(
                      "PreviewImage",
                      URL.createObjectURL(e.target.files[0])
                    );
                  }}
                  accept="image/*"
                />
              </Button>
            </FormControl>
          </Box>
          <FormControl sx={TextBoxWidth} variant="outlined">
            <Button type="submit" size="large" variant="contained">
              <SaveAsOutlined sx={{ mr: 1 }} /> บันทึก
            </Button>
          </FormControl>
        </FormGroup>
      </Box>
    </Layout>
  );
};

export default Add;
