import QRCode from "qrcode.react";
import React, { useState } from "react";
import { io } from "socket.io-client";
import Image from "next/image";
import Logo from "../../public/promptpay.png";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

type Props = {};

const Index = (props: Props) => {
  const [value, setValue] = useState<number>(0);
  const [qrcode, setQrcode] = useState<string>("");
  const [cart, setCart] = useState<any>([]);
  const socket = io("http://localhost:3200", { transports: ["websocket"] });
  React.useEffect(() => {
    const data$ = new Subject();
    const dataqrcode$ = new Subject();
    const datacart$ = new Subject();

    // Subscribe to the Socket.io event
    socket.on("totalPrice", (receivedData) => {
      data$.next(receivedData);
    });

    socket.on("qrcode", (receivedData) => {
      dataqrcode$.next(receivedData);
    });

    socket.on("cartProduct", (receivedData) => {
      datacart$.next(receivedData);
    });

    // Subscribe to the RxJS Observable and update state when data arrives
    data$.pipe(debounceTime(500)).subscribe((data: number | any) => {
      setValue(data);
    });

    dataqrcode$.pipe(debounceTime(500)).subscribe((data: string | any) => {
      setQrcode(data);
    });

    datacart$.pipe(debounceTime(500)).subscribe((data: any) => {
      setCart(data);
    });

    // Cleanup the subscriptions on component unmount
    return () => {
      data$.next;
      data$.complete();
      dataqrcode$.next;
      dataqrcode$.complete();
      datacart$.next;
      datacart$.complete();
    };
  }, [value]);

  return (
    <div className="flex flex-row">
      <div className="w-3/4">
        <Image
          width={1000}
          height={800}
          src={
            "https://wallpapers.com/images/featured/grocery-store-c41zd4y08ityrnw1.jpg"
          }
          alt={"cover"}
        />
      </div>
      <div className="w-1/2">
        <h3 className="text-2xl m-4 text-center">รายการสินค้าที่ซื้อ</h3>
        <div className="flex flex-col h-130 md:h-96">
          <div className="overflow-x-auto">
            <table className="table ">
              {/* head */}
              <thead className="text-center">
                <tr>
                  <th>#</th>
                  <th>รายการสินค้า</th>
                  <th>ราคา</th>
                  <th>จำนวน</th>
                  <th>ราคารวม</th>
                </tr>
              </thead>

              <tbody className="text-center">
                {cart.map((cart: any, index: number) => {
                  return (
                    <>
                      <tr>
                        <th>{index + 1}</th>
                        <td> {cart.product.Product_Name}</td>
                        <td>
                          ฿{" "}
                          {cart.product.Product_Price?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td>{cart.quantity}</td>
                        <td>
                          ฿{" "}
                          {(
                            cart.quantity * cart.product.Product_Price
                          ).toLocaleString("en-EN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {cart[0] && (
          <div className="flex flex-col items-center text-center mt-6">
            <Image width={250} height={80} alt="LOGO" src={Logo} />
            <div>เลขบัญชีพร้อมเพย์ 0640799009</div>
            <QRCode className="m-4 " size={250} value={qrcode} />
            {value && (
              <div>
                <h2 className="text-3xl">
                  รวม{" "}
                  {value?.toLocaleString("en-EN", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  บาท
                </h2>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
