import { getSessionCache } from "@klaudsol/commons/lib/Session";

import { useFormikContext, Form } from "formik";
import { AUTO_PASSWORD, CUSTOM_PASSWORD, writeUsers } from "lib/Constants";
import AdminRenderer from "@/components/renderers/admin/AdminRenderer";
import { useContext, useEffect } from "react";
import { generateRandVals } from "@klaudsol/commons/lib/Math";
import CacheContext from "../contexts/CacheContext";
import { FaRandom } from "react-icons/fa";

export default function PasswordForm({ passwordMode, setPasswordMode, changePass }) {
    const { setFieldValue, setTouched, values, errors, touched } = useFormikContext();
    const { capabilities } = useContext(CacheContext);

    const setRandomPassword = async () => {
        const randVal = await generateRandVals(5);

        setFieldValue('password', randVal);
        setFieldValue('confirmPassword', randVal);
        setFieldValue('forcePasswordChange', true);
    }

    useEffect(() => {
        const isEmptyPassword = !values.password && !values.changePassword;
        if (passwordMode === AUTO_PASSWORD && isEmptyPassword) setRandomPassword();
    }, [passwordMode]);

    const handlePasswordMode = async (e) => {
        const mode = e.target.value;

        if (mode === AUTO_PASSWORD) {
            const unTouched = {
                password: false,
                confirmPassword: false
            }

            setTouched(unTouched);
            await setRandomPassword();
        } else {
            setFieldValue('password', '');
            setFieldValue('confirmPassword', '');
            setFieldValue('forcePasswordChange', false);
        }

        setPasswordMode(e.target.value);
    }

    return (
        <>
            <h4>Password</h4>
            <div className="mb-4">
                <AdminRenderer
                    title="Autogenerated password"
                    errors={errors}
                    touched={touched}
                    type="radio"
                    name="passwordMode"
                    value={AUTO_PASSWORD}
                    checked={passwordMode === AUTO_PASSWORD}
                    onChange={handlePasswordMode}
                    disabled={!capabilities.includes(writeUsers)}
                />
                <AdminRenderer
                    title="Custom password"
                    errors={errors}
                    touched={touched}
                    type="radio"
                    name="passwordMode"
                    value={CUSTOM_PASSWORD}
                    checked={passwordMode === CUSTOM_PASSWORD}
                    onChange={handlePasswordMode}
                    disabled={!capabilities.includes(writeUsers)}
                />
            </div>
            {changePass &&
                <div>
                    <p className="general-input-title"> Old Password </p>
                    <AdminRenderer
                        errors={errors}
                        touched={touched}
                        type="password"
                        name="oldPassword"
                        disabled={!capabilities.includes(writeUsers)}
                    />
                </div>
            }
            {(passwordMode === AUTO_PASSWORD) &&
                <div>
                    <p className="general-input-title"> Autogenerated Password </p>
                    <AdminRenderer
                        errors={errors}
                        touched={touched}
                        type="password"
                        name="password"
                        readOnly={true}
                    />
                </div>
            }
            {(passwordMode === CUSTOM_PASSWORD) &&
                <>
                    <div className={!changePass ? "mt-4" : ""}>
                        <p className="general-input-title"> Password </p>
                        <AdminRenderer
                            errors={errors}
                            touched={touched}
                            type="password"
                            name="password"
                            disabled={!capabilities.includes(writeUsers) || passwordMode === AUTO_PASSWORD}
                        />
                    </div>
                    <div>
                        <p className="general-input-title"> Confirm Password </p>
                        <AdminRenderer
                            errors={errors}
                            touched={touched}
                            type="password"
                            name="confirmPassword"
                            disabled={!capabilities.includes(writeUsers) || passwordMode === AUTO_PASSWORD}
                        />
                    </div>
                </>
            }
            <div>
                <AdminRenderer
                    title="Force password change"
                    errors={errors}
                    touched={touched}
                    type="checkbox"
                    name="forcePasswordChange"
                    checked={values.forcePasswordChange}
                    disabled={!capabilities.includes(writeUsers)}
                />
            </div>
        </>
    );
}

export const getServerSideProps = getSessionCache();
