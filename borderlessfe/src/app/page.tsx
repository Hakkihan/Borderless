"use client";

import React, { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";

const uploadFiles = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file); // Match the field name 'file' as in your curl command
  const response = await fetch('http://localhost:3000/api/passport/extractPassportData', {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to upload files");
  }
  return response.json();
}

const DragAndDropUpload: React.FC = () => {
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: uploadFiles,
    onSuccess: (data) => {
      alert('File uploaded successfully!');
      setApiResponse(data.response.content);
    },
    onError: (err: Error) => {
      alert(`File upload unsuccessful: ${err}`);
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      mutation.mutate(acceptedFiles[0]); // Send the first file, as only one file is allowed
    } else {
      alert("No files selected.");
    }
  }, [mutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <div className="p-6 rounded-md w-96 text-blue-600 font-semibold text-center">
        Borderless passport upload
      </div>

      <div className="flex items-center justify-center h-screen flex-col">
        <div
          {...getRootProps()}
          className={`p-6 border-2 rounded-md w-96 text-blue-600 font-semibold text-center ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>Drag & drop some files here, or click to select files</p>
          )}

          {mutation.isPending && <p>Uploading files...</p>}
        </div>
        {apiResponse && (
          <div
            className="mt-3 p-4 border rounded-md w-96 bg-gray-100 text-center"
            key={apiResponse}
          >
            Response: {apiResponse}
          </div>
        )}
      </div>
    </div>
  );
}

export default DragAndDropUpload;
