import { useState, useContext, useEffect } from "react";
import { Formik, Form, Field, useFormikContext, useField } from "formik";
import { loadEntityTypes } from "@/components/reducers/actions";
import { slsFetch } from '@klaudsol/commons/lib/Client';
import RootContext from "@/components/contexts/RootContext";
import CacheContext from "@/components/contexts/CacheContext";
import DependentField from "@/components/fields/DependentField";
import { useClientErrorHandler } from "@/components/hooks"

export default function CollectionTypeBody({ formRef }) {
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
  const errorHandler = useClientErrorHandler();
  const { token = null } = useContext(CacheContext);

  const formikParams = {
    initialValues: {},
    innerRef: formRef,
    onSubmit: (values) => {
      (async () => {
        try {
          //refactor to reducers/actions
          await slsFetch(`/api/entity_types`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          errorHandler(error);
        } finally {
          await loadEntityTypes({ rootState, rootDispatch });
        }
      })();
    },
  };

  const dependentFieldFormat = (value) => {
    const valueSplit = value?.split(" ");
    // Prevents extra spaces from becoming '-'
    const filteredSplit = valueSplit?.filter((i) => i !== "");
    const joinedSplit = filteredSplit?.join("-");
    const lowerCasedVal = joinedSplit?.toLowerCase();

    // If the user types in space as the first letter, a '-'
    // will appear, the trim() method below will prevent it
    if (value?.trim() === "") return "";
    if (value?.endsWith(" ")) return `${lowerCasedVal}-`;

    return lowerCasedVal;
  };

  return (
    <>
      <Formik {...formikParams}>
        <Form>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mx-3"> Configurations </h6>
              <div>
                <button className="btn_modal_settings"> Basic settings </button>
              </div>
            </div>
            <div className="block_bar" />
            <div className="row">
              <div className="col">
                <p className="mt-2"> Display Name </p>
                <Field type="text" className="input_text" name="name" />
              </div>
              <div className="col">
                <p className="mt-2"> API ID &#40;Slug&#41; </p>
                <DependentField
                  type="text"
                  className="input_text"
                  name="slug"
                  fieldToMirror="name"
                  format={dependentFieldFormat}
                />
                <p className="mt-1" style={{ fontSize: "10px" }}>
                  The UID is used to generate the API routes and databases
                  tables/collections
                </p>
              </div>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
}
