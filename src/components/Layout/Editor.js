import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
/* import { SourceEditing } from "@ckeditor/ckeditor5-source-editing"; */
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

//const API_URL = "https://77em4-8080.sse.codesandbox.io";
//const UPLOAD_ENDPOINT = "upload_files";

export default function MyEditor({ handleChange, ...props }) {
  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          //  const body = new FormData();
          loader.file.then((file) => {
            console.log(file, "filefile");
            /* body.append("files", file);
            // let headers = new Headers();
            // headers.append("Origin", "http://localhost:3000");
            fetch(`${API_URL}/${UPLOAD_ENDPOINT}`, {
              method: "post",
              body: body,
              // mode: "no-cors"
            })
              .then((res) => res.json())
              .then((res) => {
                resolve({
                  default: `${API_URL}/${res.filename}`,
                });
              })
              .catch((err) => {
                reject(err);
              }); */
          });
        });
      },
    };
  }
  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }
  return (
    <div className="App">
      <CKEditor
        config={{
          extraPlugins: [uploadPlugin],
        }}
        data={props.data !== "" && props.data !== null ? props.data : ""}
        editor={ClassicEditor}
        onChange={(event, editor) => {
          props.setContent(editor.getData());
        }}
        {...props}
      />
    </div>
  );
}
