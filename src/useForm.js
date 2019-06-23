import React, { useState } from "react";

function useForm(initialState) {
  const [values, setValues] = useState(initialState);
  const [isEditing, setEditing] = useState(false);

  const handleChange = event => {
    setValues({ [event.target.name]: event.target.value });
  };

  const handleBlur = event => {
    event.preventDefault();
    console.log({ values });
    setValues(initialState);
    setEditing(false);
  };

  return { handleChange, handleBlur, values, isEditing, setEditing };
}

export default useForm;
