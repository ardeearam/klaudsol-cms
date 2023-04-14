import { useState, useRef } from "react";
import { useFormikContext, useField } from "formik";
import Image from "next/image";
import AppButtonLg from "../klaudsolcms/buttons/AppButtonLg";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import { FaTrash } from "react-icons/fa";
import { useEffect } from "react";
import { SET_CHANGED } from "@/lib/actions"

const GalleryField = (props) => {
    const [files, setFiles] = useState([]);
    const { setFieldValue, setTouched, touched } = useFormikContext();
    const [field] = useField(props);

    const { onChange, value, ...formattedField } = field;

    const inputRef = useRef();

    const setFileValue = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const newFiles = [...files, file];
        setFiles(newFiles);
        setFieldValue(field.name, newFiles);
    };

    const openUploadMenu = () => {
        inputRef.current.click();

        const checkIfUnfocused = () => {
            if (!value) setTouched({ ...touched, [field.name]: true });

            document.body.onfocus = null;
        };

        document.body.onfocus = checkIfUnfocused;
    };

    return (
        <div>
            <div className="field_base">
                <input
                    accept={props.accept}
                    type="file"
                    onChange={setFileValue}
                    hidden="hidden"
                    ref={inputRef}
                    {...formattedField}
                />
                <div
                    className="card__container"
                    onClick={openUploadMenu}
                >
                    {files.map((image, i) => (
                        <div
                            key={i}
                            className="card__data"
                        >
                            <Image
                                src={image?.link ?? URL.createObjectURL(image)}
                                alt={image?.name}
                                width={800}
                                height={300}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GalleryField;
