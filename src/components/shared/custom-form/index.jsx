import { Form, Formik } from 'formik';

import styles from './styles.module.css';

const CustomFormComponent = ({
  initialValues,
  validationSchema,
  children,
  onSubmit = () => {},
}) => {
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={() => onSubmit()}
    >
      {(form) => <Form className={styles.form}>{children}</Form>}
    </Formik>
  );
};

export default CustomFormComponent;
