import { omit } from "lodash";

export const createFileUploadPayload = (files) => {
  const formData = new FormData();

  /**
payload: {
  uploadFiles: [
    325c2e45-b58c-4e79-ab7b-0ffc6fb5e71b: (binary),
    325c2e45-b58c-4e79-ab7b-0ffc6fb5e71b: (binary)
  ]
} 
  
  */
  // formData.append("uploadFiles", []);
  //  formData.append("uploadMetadata", JSON.stringify(files));
  // let uploadFilesList = [];
  // for (const file of files) {
  //   //Each files gets turned into the following
  //   // 325c2e45-b58c-4e79-ab7b-0ffc6fb5e71b: (binary)
  //   // formData.append(file?.id, file);
  //   // let newObj = {};
  //   // newObj[file?.id] = file;
  //   formData.append("uploadFiles", file, file?._id);
  //   uploadFilesList.push(file);
  // }

  files.forEach((fileObject, index) => {
    formData.append(`uploadFiles`, fileObject, fileObject?.id);
  });

  // formData.append("uploadFilesList", uploadFilesList);

  formData.append("uploadMetadata", JSON.stringify(files));
  return formData;
};
// const d = [
//   { path: "800KB.pdf", id: "aa5525cd-16a9-4339-beff-868737e48f29" },
//   { path: "Free_Test_Data_117KB_JPG.jpg", id: "75015dc2-9305-42f1-aa69-18da37d64e32" },
// ];
// filename="aa5525cd-16a9-4339-beff-868737e48f29"

export const mapObjectFormData = (data) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  return formData;
};

export const mapNestedObjectFormData = (data) => {
  const formData = new FormData();
  const obj = {};
  for (const [key, value] of Object.entries(data)) {
    obj[key] = value;
  }
  if (data.hasOwnProperty("documents")) {
    for (const value of data.documents) {
      formData.append(value.id, value.file);
    }
  }
  formData.append("data", JSON.stringify(obj));

  return formData;
};
