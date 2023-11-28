import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "@/redux/actions";
import { Invoice, Product } from "@/types/Product";
import { ImBarcode, ImBin, ImCart } from "react-icons/im";
import { MdPayment, MdClose, MdBarcodeReader } from "react-icons/md";
import QRCode from "qrcode.react";
import generatePayload from "promptpay-qr";
import Image from "next/image";
import Logo from "../public/promptpay.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { io } from "socket.io-client";
import ReactPaginate from "react-paginate";
import {
  getInvoiceLatest,
  getProductCode,
  getProductCount,
  getProductPage,
  postSale,
} from "@/service/serverService";
import { loadEnvConfig } from "@next/env";
import PreviewImage from "@/components/ImagePreview";

type Props = {};

const schema = yup
  .object({
    Invoice_Bank_Account_Name: yup.string().required(),
    Invoice_Payment_Type: yup.number().positive().integer().required(),
    Invoice_Bank_Account_Number: yup.string().required(),
    customerId: yup.string().required(),
  })
  .required();

const Home = (props: Props) => {
  const NEXT_SOCKET_API: any = process.env.NEXT_SOCKET_API;
  const mobileNumber = "064-079-9009";
  const [productData, setDataProduct] = useState<Product[]>();
  const [showCart, setShowCart] = useState<boolean>(true);
  const [showProduct, setShowProduct] = useState<boolean>(false);
  const [lastInvoice, setLastInvoice] = useState<any>();
  const inputRefSearch = useRef<any>("");
  const [barcodeInputValue, updateBarcodeInputValue] = useState("");
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const modalElement = modalRef.current;
  const socket = io(NEXT_SOCKET_API, { transports: ["websocket"] });
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(8);
  const [count, setCount] = useState<number>(0);
  const [showScan, setShowScan] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("ASC");
  const [columnname, setColumnname] = useState<string>("id");
  const [showConfirmBox, setShowConfirmBox] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (invoice: any) => {
    // e.preventDefault();
    const cart: any = [];
    productReducer.cart.map((res: any) => {
      cart.push({
        Sales_Quantity: res.quantity,
        Sales_Unit_Price: res.product.Product_Price,
        Sales_Sub_Total: res.product.Product_Price * res.quantity,
        productId: res.product.id,
        invoiceId: null,
        userId: 1,
      });
    });

    await postSale(cart, invoice).then((data) => {
      setShowProduct(true);
      if (data) {
        dispatch<any>(actions.removeBuyAllProduct());
        fetchData();
        modalElement?.close();
      }
    });
    modalElement?.close();
  };

  function barcodeAutoFocus() {
    document.getElementById("barcode")?.focus();
  }

  function onChangeBarcode(event: any) {
    updateBarcodeInputValue(event.target.value);
  }

  async function onKeyDown(event: any) {
    if (event.keyCode === 13) {
      try {
        await getProductCode(event.target.value)
          .then((data) => {
            // console.log(data[0]);
            if (data[0]) {
              dispatch<any>(actions.buyProduct(data[0]));
              updateBarcodeInputValue("");
              inputRefSearch.current = "";
            } else {
              alert("ไม่มีสินค้า");
              updateBarcodeInputValue("");
              inputRefSearch.current = "";
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, [showCart, page, limit]);

  const fetchData = async () => {
    await getProductCount()
      .then((data) => {
        setCount(data.count);
      })
      .catch((e) => {
        console.log(e);
      });

    await getProductPage(page, limit, columnname, sort).then((data) => {
      let product: Product[] = [];
      data.filter((res: any) => {
        if (res.Product_Status === 1) {
          product.push(res);
        }
      });
      setDataProduct(product);
    });

    try {
      await getInvoiceLatest().then((data) => {
        setLastInvoice(data.id);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const dispatch = useDispatch();
  const productReducer = useSelector(({ productReducer }) => productReducer);

  const badges: any[] = [null];
  const totalPrices: any[] = [null];
  const quantity: any[] = [];

  const [amount, setAmont] = useState<number | undefined>(0);
  const payload = generatePayload(mobileNumber, { amount });

  // word == arg
  useEffect(() => {
    socket.emit("qrcode", payload);
    socket.emit("totalPrice", amount);
    socket.emit("cartProduct", productReducer.cart);
  }, [payload, amount, productReducer]);

  productReducer.cart.forEach((cart: any) => {
    quantity.push({ id: cart.product.id, quantity: cart.quantity });
    badges.push(cart.quantity);
    totalPrices.push(cart.product.Product_Price * cart.quantity);
  });
  let badge = badges.reduce((a, b) => {
    return a + b;
  });
  let totalPrice = totalPrices.reduce((a, b) => {
    return a + b;
  });

  useEffect(() => {
    setAmont(totalPrice);
  }, [totalPrice]);

  const handleToggle = () => {
    setShowCart((current) => !current);
  };

  const handleSale = async () => {
    setShowProduct(false);
    fetchData();
  };

  const handleInvoice = () => {
    const modalElement = modalRef.current;
    modalElement?.showModal();
  };

  function handlePageClick(event: any): void {
    setPage(event.selected + 1);
  }

  function handleChangeLimit(e: any) {
    setLimit(e.target.value);
  }

  function handleRemoveAll() {
    setShowConfirmBox(true);
  }

  return (
    <div className="p-4">
      {/* header */}
      {showConfirmBox && (
        <div className="alert mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>คุณแน่ใจจะลบสินค้าในตะกร้าทั้งหมด!!!</span>
          <div>
            <button
              className="btn btn-sm"
              onClick={() => setShowConfirmBox(false)}
            >
              ยกเลิก
            </button>
            <button
              className="btn btn-sm btn-error"
              onClick={() => {
                dispatch<any>(actions.removeBuyAllProduct());
                setShowConfirmBox(false);
              }}
            >
              ยืนยัน
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-row-reverse justify-between">
        <div className="indicator">
          {badge != null && (
            <span className="indicator-item mr-2 badge badge-secondary">
              {badge > 99 ? "99+" : badge}
            </span>
          )}
          <button
            className="btn btn-neutral max-w-xs"
            onClick={() => {
              handleToggle();
            }}
          >
            <ImCart size={25} />
          </button>
        </div>
        <div className="top-4">
          {showScan && (
            <div className="flex btn-group">
              <input
                autoFocus={true}
                name="barcode"
                value={barcodeInputValue}
                ref={inputRefSearch}
                onChange={onChangeBarcode}
                id="barcode"
                placeholder="|||||| scan barcode "
                className="ml-4 input input-bordered input-md w-40 max-w-xs"
                onKeyDown={onKeyDown}
                onBlur={barcodeAutoFocus}
              />
              <button
                className="btn btn-error max-w-xs"
                onClick={() => {
                  setShowScan(false);
                }}
              >
                <MdClose size={25} />
              </button>
            </div>
          )}
          {!showScan && (
            <button
              className="btn btn-success max-w-xs"
              onClick={() => {
                setShowScan(true);
              }}
            >
              <MdBarcodeReader size={25} />
            </button>
          )}
        </div>
      </div>

      {/* Modal  */}
      <dialog
        ref={modalRef}
        id="modal_payment_details"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box ">
          <div className="modal-action -m-2">
            <form method="dialog">
              <button className="btn btn-sm btn-error btn-outline">
                <MdClose size={20} />
              </button>
            </form>
          </div>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <label>การจ่ายเงิน</label>
            <input
              className="input input-bordered mb-3 w-full"
              {...register("Invoice_Bank_Account_Name")}
            />
            <p>{errors.Invoice_Bank_Account_Name?.message}</p>
            <label>วิธีการจ่ายเงิน</label>
            <input
              className="input input-bordered w-full"
              {...register("Invoice_Payment_Type")}
            />
            <p>{errors.Invoice_Payment_Type?.message}</p>
            <label>รหัสสมาชิก</label>
            <input
              className="input input-bordered w-full"
              {...register("customerId")}
            />
            <label>เลขบัญชี</label>
            <input
              className="input input-bordered w-full"
              {...register("Invoice_Bank_Account_Number")}
            />
            <p>{errors.Invoice_Bank_Account_Number?.message}</p>
            <input
              className="btn w-full mt-2 btn-success btn-outline"
              type="submit"
              value="ยืนยันการชำระเงิน"
            />
          </form>
        </div>
      </dialog>

      {/* Product details and Cart */}
      <div className="flex lg:flex-row">
        {/* Product */}
        <div className="w-3/4">
          <h3 className="text-2xl text-center font-bold">รายการสินค้า</h3>
          <div className="flex flex-col overflow-y-scroll p-0 mx-4 mt-5 h-150 justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {productData?.map((product: Product) => {
                let dataCart: any = [];
                quantity.filter((q) => {
                  if (q.id == product.id) {
                    dataCart = { ...product, quantityCart: q.quantity };
                  }
                });
                return (
                  <>
                    {" "}
                    <div className="flex" key={product.id}>
                      <div className="card w-80 bg-base-100 shadow-xl">
                        <div className="card-body">
                          {dataCart.quantityCart && (
                            <span className="badge absolute top-0 right-2 rounded-b-lg rounded-none h-9  badge-secondary text-lg">
                              {dataCart.quantityCart}
                            </span>
                          )}
                          <figure>{PreviewImage(product.Product_Image)}</figure>
                          <h2 className="card-title truncate">
                            {product.Product_Name}
                          </h2>
                          <p>
                            ราคา ฿{" "}
                            {product.Product_Price.toLocaleString("en-EN", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                          <div className="badge badge-outline gap-2">
                            <p className="text-xs">
                              เหลือสินค้า{" "}
                              {dataCart.quantityCart
                                ? (
                                    product.Product_Stock -
                                    dataCart.quantityCart
                                  ).toLocaleString("en-EN", {
                                    minimumFractionDigits: 0,
                                  })
                                : product.Product_Stock.toLocaleString(
                                    "en-EN",
                                    {
                                      minimumFractionDigits: 0,
                                    }
                                  )}{" "}
                              {product.productunit?.Productunit_Name.toString()}
                            </p>
                          </div>
                          <div className="card-actions justify-end">
                            {!showProduct &&
                              (product.Product_Stock -
                                (dataCart.quantityCart == null
                                  ? 0
                                  : dataCart.quantityCart) >
                              0 ? (
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() =>
                                    dispatch<any>(actions.buyProduct(product))
                                  }
                                >
                                  <ImCart />
                                  เพิ่มลงตะกร้า
                                </button>
                              ) : (
                                ""
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
            <div className="flex lg:flex-row flex-col items-center lg:justify-between w-full">
              <div>
                <label>แสดง </label>
                <select
                  defaultValue={limit}
                  onChange={handleChangeLimit}
                  className="select select-bordered max-w-xs w-2/6"
                >
                  <option disabled selected>
                    แสดงทั้งหมด
                  </option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={16}>16</option>
                </select>
                <label className="-mr-2"> รายการ</label>
              </div>
              <div>
                <ReactPaginate
                  previousLabel="ก่อนหน้า"
                  nextLabel="ถัดไป"
                  breakLabel="..."
                  pageClassName="join-item btn"
                  previousClassName="join-item btn"
                  nextClassName="join-item btn"
                  breakClassName="disabled"
                  containerClassName="join"
                  activeClassName="btn-active"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
                  pageCount={count / limit}
                  renderOnZeroPageCount={null}
                />
              </div>
              <div className="flex flex-row items-center mr-6">
                <label>สินค้าทั้งหมด </label>
                <label className="mx-2">{count}</label>
                <label> รายการ</label>
              </div>
            </div>
          </div>
        </div>
        {/* Cart */}
        <div className="w-1/3">
          {showProduct && (
            <div>
              <button
                className="btn btn-lg btn-success w-full pr-6 mt-4"
                onClick={() => handleSale()}
              >
                {" "}
                ขายสินค้า
              </button>
            </div>
          )}
          {showCart && (
            <div>
              {totalPrice && (
                <div className="flex flex-row justify-between mt-4">
                  <h3 className="lg:text-2xl md:text-xl text-md font-bold">
                    ตะกร้าสินค้า #
                    {Number(lastInvoice == undefined ? 0 : lastInvoice) + 1}
                  </h3>
                  <div>
                    <div className="dropdown dropdown-left dropdown-button">
                      <label
                        tabIndex={0}
                        className="btn mb-2 btn-sm btn-outline w-50 btn-error"
                      >
                        <ImBin size={20} /> ลบทั้งหมด
                      </label>
                      <div
                        tabIndex={0}
                        className="flex flex-row justify-between dropdown-content z-[1] manu  p-1 m shadow bg-base-100 rounded-box w-auto"
                      >
                        <button
                          className="btn btn-xs btn-error btn-outline m-1"
                          onClick={() =>
                            dispatch<any>(actions.removeBuyAllProduct())
                          }
                        >
                          ยืนยัน
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-col mt-2 h-130 md:h-96">
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    {/* head */}
                    <thead className="text-center">
                      <tr>
                        <th>#</th>
                        <th>รายการสินค้า</th>
                        <th>ราคา</th>
                        <th>เพิ่ม/ลด</th>
                        <th>ราคารวม</th>
                        <th>ลบรายการ</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {/* row 1 */}
                      {productReducer.cart.map((cart: any, index: number) => {
                        return (
                          <>
                            <tr>
                              <th>{index + 1}</th>
                              <td> {cart.product.Product_Name}</td>
                              <td>
                                ฿{" "}
                                {cart.product.Product_Price?.toLocaleString(
                                  "en-US",
                                  { minimumFractionDigits: 2 }
                                )}
                              </td>
                              <td>
                                <input
                                  className="input input-bordered input-primary w-16 m-2 input-sm max-w-xs"
                                  type="number"
                                  defaultValue={cart.quantity|0}
                                  value={cart.quantity|0}
                                  max={cart.product.Product_Stock}
                                  onKeyUp={(e) => {
                                    if (
                                      e.currentTarget.value >
                                      cart.product?.Product_Stock
                                    )
                                      return alert("มีสินค้าไม่เพียงพอ");
                                  }}
                                  onChange={(e) =>
                                    dispatch<any>(
                                      actions.updateQuantity(
                                        cart.product.id,
                                        parseInt(e.target.value, 10)
                                      )
                                    )
                                  }
                                />
                              </td>
                              <td>
                                ฿{" "}
                                {(
                                  cart.quantity * cart.product.Product_Price
                                ).toLocaleString("en-EN", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-error btn-outline"
                                  onClick={() => {
                                    dispatch<any>(
                                      actions.removeBuyProduct(cart.product.id)
                                    );
                                  }}
                                >
                                  <ImBin />
                                </button>
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {totalPrice && (
                <>
                  <div className="flex flex-col  w-full items-center mt-2 text-center">
                    <Image width={200} height={80} alt="LOGO" src={Logo} />
                    <div>เลขบัญชีพร้อมเพย์ 0640799009</div>
                    <QRCode className="m-4" size={200} value={payload} />
                    <h3 className="text-lg md:text-2xl lg:text-3xl text-center mb-2">
                      ราคารวม ฿{" "}
                      {totalPrice.toLocaleString("en-EN", {
                        minimumFractionDigits: 2,
                      })}
                    </h3>
                  </div>
                  <button
                    className="btn btn-lg  w-full btn-success "
                    onClick={() => {
                      handleInvoice();
                    }}
                  >
                    <MdPayment size={35} /> ชำระเงิน
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
