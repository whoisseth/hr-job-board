import React from "react";
import PDFViewer from "./pdf-viewer";

export default function ResumePage() {
  const pdfUrl =
    "https://resumes-pdfs-2025.s3.ap-south-1.amazonaws.com/UtkarshSeth_CV.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIATMZJEH76WGE75YHP%2F20250310%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250310T063942Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjED8aCmFwLXNvdXRoLTEiRzBFAiEAzLW3D8nS2ovfFUTsNZ%2BzGI1KE38jfUpJI005m00NPLwCIGa62OxQTzG40NSNt2eluj6LIq4D3v%2FwSyy7bzMWJXOeKvUCCIj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMjMzNjI1MTA4NDc3Igw8UyxAUKW29PK%2Fa2IqyQIafx3Pp1mvUvj2CBAsFtfJCHS4fDQd3VkKQjsrq5oqQebI8vCJPoTVk8MuI%2FBiflvp%2BrSQPPvonnBcbYtrC8A%2BmaZcPEvSpdl%2B%2BpqhERwsx3L5ZWPmmJS6M%2FAVE4D89jbvHcrJPNuvkt8ZwPB8OyifLvcNoC%2FVeQFoLuUQ8uPMb%2FuCSvG%2FMvFXQJj66OfLCpX1ExyyeUDavDLx6X1tRtNeMqnircBqbHCHVA%2BFZimogQSgb89yHvWPLiHrVLo3blALeujTQM5GpMjSF8O9dmz4jsoWQjIpYS2XvYES7T8Gd5Gyu9WJRrWPS7hsRC%2FcniQ4%2B9aC%2FfqoZhENL1j8lscwV81DMW53EJOgIbAl%2Bn5vBTl0ejvfUOpOcTeQmGKj8yFC5IYkXalm5gAI%2Buwqx8bzdkYkHcnwYJSDgpreZGf%2FR%2BkwsmbJY%2BdYYjCe%2F7m%2BBjqzAlH7wTe553kylrxBr9BZb%2BF6c9gQGljADmGwq09qrdRvuBVe4eA4AhHTtQMpt08SI4byrc5BMvG5ylIqRINB3TFg3Gz4SQnp6fczqbRFatz7AhuQ76bQV9BOusoB6BELJTyuZyfGK%2F4SzRwJnPqvDBeWRMoK%2B4boLcB6%2FOFXkZ4Ut4Jc2iFPOV8e%2BPIxcDxNiM8fog%2F570esbSaC2XlMtxF0URnl9pUF7ZPu1BhLPy7fYl5Q4ZESAXoIIz5L6dLNvPIrRqrfus9DRh7rKae4bQhH2kT%2FWiuSMQP%2FvkHLFwRcMg0hKnesSMuP7HeoDILpIVVjiYgDwP3FVvHeNBNVwHCkYpFRAevAcMTFOJBYAyn22FCzLg%2FkRNilrp41krL%2FpupXmXXYkK%2B0qzJYhABktQ%2BR3HQ%3D&X-Amz-Signature=8dd491d36b17697cc1e449b18e7a4a9613d78b39f46645a4999424aecc4506e6&X-Amz-SignedHeaders=host&response-content-disposition=inline";
  return (
    <div className="mx-auto h-[calc(100vh-10rem)] w-full">
      <PDFViewer pdfUrl={pdfUrl} />
    </div>
  );
}
