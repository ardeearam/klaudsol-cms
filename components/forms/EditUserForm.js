import { getSessionCache } from "@klaudsol/commons/lib/Session";

import { useFormikContext, Form } from "formik";
import { AUTO_PASSWORD, CUSTOM_PASSWORD, writeUsers } from "lib/Constants";
import AdminRenderer from "@/components/renderers/admin/AdminRenderer";
import { useContext, useEffect } from "react";
import { generateRandVals } from "@klaudsol/commons/lib/Math";
import CacheContext from "../contexts/CacheContext";
import { FaRandom } from "react-icons/fa";

export default function EditUserForm() {
    const { errors, touched } = useFormikContext();
    const { capabilities } = useContext(CacheContext);

    return (
        <div className="mb-4">
            <h4>General info</h4>
            <div className="d-flex align-items-center gap-2">
                <div className="col">
                    <p className="general-input-title"> First Name </p>
                    <AdminRenderer
                        errors={errors}
                        touched={touched}
                        type="text"
                        name='firstName'
                        disabled={!capabilities.includes(writeUsers)}
                    />
                </div>
                <div className="col">
                    <p className="general-input-title"> Last Name </p>
                    <AdminRenderer
                        errors={errors}
                        touched={touched}
                        type="text"
                        name='lastName'
                        disabled={!capabilities.includes(writeUsers)}
                    />
                </div>
            </div>
            <div>
                <p className="general-input-title"> Email </p>
                <AdminRenderer
                    errors={errors}
                    touched={touched}
                    type="text"
                    name='email'
                    disabled={!capabilities.includes(writeUsers)}
                />
            </div>
            <div>
                <AdminRenderer
                    title="Force password change"
                    errors={errors}
                    touched={touched}
                    type="checkbox"
                    name='forcePasswordChange'
                    disabled={!capabilities.includes(writeUsers)}
                />
            </div>
            <div>
                <AdminRenderer
                    title="Login enabled"
                    errors={errors}
                    touched={touched}
                    type="checkbox"
                    name='loginEnabled'
                    disabled={!capabilities.includes(writeUsers)}
                />
            </div>
        </div>
    );
}

export const getServerSideProps = getSessionCache();
