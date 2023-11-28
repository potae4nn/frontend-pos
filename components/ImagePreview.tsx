import React from 'react'
import Image from 'next/image';
import { productImageURL } from '@/utils/commonUtil';

const PreviewImage = (values: any) => {
    let parser = document.createElement("a");
    parser.href = values;

    if (parser.protocol === "https:" || parser.protocol === "blob:") {
      return <img alt="product image" src={values} width={200} height={200} />;
    } else {
      if (values.file_obj) {
        return (
          <Image
            alt="product image"
            src={values.file_obj}
            width={200}
            height={200}
          />
        );
      } else if (values) {
        return (
          <Image
            objectFit="contain"
            alt="product image"
            src={productImageURL(values)}
            width={200}
            height={200}
          />
        );
      }
    }
  };


export default PreviewImage