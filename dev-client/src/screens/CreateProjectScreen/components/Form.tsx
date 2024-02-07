/*
 * Copyright © 2023 Technology Matters
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see https://www.gnu.org/licenses/.
 */

import {Fab, Input, Radio, TextArea} from 'native-base';
import {Formik, FormikProps} from 'formik';
import {RadioBlock} from 'terraso-mobile-client/components/RadioBlock';
import {IconButton} from 'terraso-mobile-client/components/Icons';
import {useTranslation} from 'react-i18next';
import ErrorMessage from 'terraso-mobile-client/screens/CreateProjectScreen/components/ErrorMessage';
import * as yup from 'yup';
import {
  MEASUREMENT_UNITS,
  PROJECT_DESCRIPTION_MAX_LENGTH,
  PROJECT_NAME_MAX_LENGTH,
  PROJECT_NAME_MIN_LENGTH,
} from 'terraso-mobile-client/constants';
import {TFunction} from 'i18next';
import {FormLabel} from 'terraso-mobile-client/components/form/FormLabel';
import {FormRadioGroup} from 'terraso-mobile-client/components/form/FormRadioGroup';
import {FormTextArea} from 'terraso-mobile-client/components/form/FormTextArea';
import {FormInput} from 'terraso-mobile-client/components/form/FormInput';
import {ProjectUpdateMutationInput} from 'terraso-client-shared/graphqlSchema/graphql';
import {
  HStack,
  VStack,
  Heading,
} from 'terraso-mobile-client/components/NativeBaseAdapters';

export const projectValidationFields = (t: TFunction) => ({
  name: yup
    .string()
    .min(
      PROJECT_NAME_MIN_LENGTH,
      t('projects.form.name_min_length_error', {
        min: PROJECT_NAME_MIN_LENGTH,
      }),
    )
    .max(
      PROJECT_NAME_MAX_LENGTH,
      t('projects.form.name_max_length_error', {
        max: PROJECT_NAME_MAX_LENGTH,
      }),
    )
    .required(
      t('projects.form.name_min_length_error', {
        min: PROJECT_NAME_MIN_LENGTH,
      }),
    ),
  description: yup.string().max(
    PROJECT_DESCRIPTION_MAX_LENGTH,
    t('projects.form.description_max_length_error', {
      max: PROJECT_DESCRIPTION_MAX_LENGTH,
    }),
  ),
  privacy: yup.string().oneOf(['PRIVATE', 'PUBLIC']).required(),
});

export const projectValidationSchema = (t: TFunction) =>
  yup.object().shape(projectValidationFields(t));

export const editProjectValidationSchema = (t: TFunction) => {
  const fullSchema = projectValidationSchema(t);
  return fullSchema.pick(['name', 'description']).concat(
    yup.object().shape({
      measurementUnits: yup.string().oneOf(MEASUREMENT_UNITS),
    }),
  );
};

export type ProjectFormValues = {
  name: string;
  description: string;
  privacy: 'PUBLIC' | 'PRIVATE';
};

type Props = {
  editForm?: boolean;
  onInfoPress: () => void;
};

const SharedFormComponents = (showPlaceholders: boolean, t: TFunction) => {
  return [
    <FormInput
      key="name"
      name="name"
      placeholder={showPlaceholders ? t('projects.add.name') : undefined}
      variant="outline"
      id="project-form-name"
      label={t('projects.add.name')}
    />,
    <FormTextArea
      key="description"
      name="description"
      placeholder={showPlaceholders ? t('projects.add.description') : undefined}
      variant="outline"
      numberOfLines={3}
      autoCompleteType="off"
      label={t('projects.add.description')}
    />,
  ];
};

type FormProps = Omit<ProjectUpdateMutationInput, 'id'> & {
  onSubmit: (values: Omit<ProjectUpdateMutationInput, 'id'>) => void;
  submitProps?: Omit<React.ComponentProps<typeof Fab>, 'onPress'>;
};

export const EditForm = ({
  onSubmit,
  name,
  description,
  measurementUnits,
  submitProps,
}: Omit<FormProps, 'privacy'>) => {
  const {t} = useTranslation();

  return (
    <Formik<Omit<ProjectUpdateMutationInput, 'id'>>
      validationSchema={editProjectValidationSchema(t)}
      initialValues={{name, description, measurementUnits}}
      onSubmit={onSubmit}>
      {({handleSubmit, isValid, isSubmitting}) => (
        <>
          {SharedFormComponents(false, t)}
          <FormRadioGroup
            label={t('projects.settings.measurement_units')}
            name="measurementUnits"
            values={MEASUREMENT_UNITS}
            renderRadio={value => (
              <Radio value={value} key={value}>
                {t('general.measurement_units.' + value)}
              </Radio>
            )}
          />
          <Fab
            onPress={() => handleSubmit()}
            disabled={!isValid || isSubmitting}
            label={t('general.submit')}
            _text={{
              textTransform: 'uppercase',
            }}
            {...submitProps}
          />
        </>
      )}
    </Formik>
  );
};

export default function Form({
  editForm = false,
  onInfoPress,
  handleChange,
  handleBlur,
  privacy,
}: Props &
  Pick<FormikProps<ProjectFormValues>, 'handleChange' | 'handleBlur'> &
  Pick<ProjectFormValues, 'privacy'>) {
  const {t} = useTranslation();

  const inputParams = (field: keyof ProjectFormValues) => ({
    onChangeText: handleChange(field),
    onBlur: handleBlur(field),
  });

  const EditHeader = editForm ? (
    <Heading size="sm">{t('projects.edit.inputHeader')}</Heading>
  ) : (
    <></>
  );

  return (
    <VStack space={3}>
      {EditHeader}
      <FormLabel>{t('projects.create.name_label')}</FormLabel>
      <Input
        placeholder={t('projects.add.name')}
        defaultValue=""
        autoCorrect={false}
        scrollEnabled={false}
        {...inputParams('name')}
      />
      <ErrorMessage fieldName="name" />

      <FormLabel>{t('projects.create.description_label')}</FormLabel>
      <TextArea
        placeholder={t('projects.add.description')}
        numberOfLines={3}
        fontSize={16}
        autoCompleteType="off"
        autoCorrect={false}
        {...inputParams('description')}
      />
      <ErrorMessage fieldName="description" />
      <RadioBlock
        label={
          <HStack alignItems="center">
            <Heading size="sm">{t('projects.create.privacy_label')}</Heading>
            <IconButton
              name="info"
              onPress={onInfoPress}
              _icon={{color: 'action.active'}}
            />
          </HStack>
        }
        options={{
          PUBLIC: {text: t('projects.create.public')},
          PRIVATE: {text: t('projects.create.private')},
        }}
        groupProps={{
          value: privacy,
          variant: 'oneLine',
          onChange: handleChange('privacy'),
          name: 'data-privacy',
        }}
      />
      <ErrorMessage fieldName="privacy" />
    </VStack>
  );
}
