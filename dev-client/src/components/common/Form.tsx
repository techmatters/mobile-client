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

import CheckBox from '@react-native-community/checkbox';
import {ErrorMessage as FormikErrorMessage, useFormikContext} from 'formik';
import {
  FormControl,
  Input,
  Radio,
  Popover,
  Switch,
  Row,
  Text,
  TextArea,
} from 'native-base';
import {
  createContext,
  memo,
  useContext,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import {TextInput} from 'react-native';
import {IconButton} from 'terraso-mobile-client/components/common/Icons';

type FieldContextType<Name extends string = string, T = string> = {
  name?: Name;
  value?: T;
  onChange?: (_: T) => void;
  onBlur?: () => void;
};
const FieldContext = createContext<FieldContextType | undefined>(undefined);

export const useFieldContext = <
  Value = string,
  Name extends string = string,
  FormValues extends Record<Name, any> = Record<Name, any>,
>(
  name?: Name,
): FieldContextType<Name, Value> => {
  const fieldContext = useContext(FieldContext) as
    | FieldContextType<Name, Value>
    | undefined;
  const formikContext = useFormikContext<FormValues>();

  const onChange = useCallback(
    (value: Value) => {
      if (name !== undefined) {
        formikContext.setFieldValue(name, value);
      }
    },
    [formikContext.values, name],
  );

  return name === undefined
    ? fieldContext!
    : formikContext === undefined
    ? {}
    : {
        name,
        value: formikContext.values[name] as Value,
        onChange,
        onBlur: formikContext.handleBlur(name) as unknown as () => void,
      };
};

type FormFieldProps<Name extends string> = React.PropsWithChildren<{
  name: Name;
}>;
export const FormField = memo(
  <Name extends string>({name, children}: FormFieldProps<Name>) => (
    <FieldContext.Provider value={useFieldContext(name)}>
      <FormControl>{children}</FormControl>
    </FieldContext.Provider>
  ),
);

type WrapperProps = {
  name?: string;
  label?: string;
  errorMessage?: React.ReactNode;
  helpText?: string;
};
export const FormFieldWrapper = memo(
  ({
    name,
    label,
    errorMessage = <FormErrorMessage />,
    helpText,
    children,
  }: React.PropsWithChildren<WrapperProps>) => {
    const wrappedChildren = (
      <>
        {label && <FormLabel>{label}</FormLabel>}
        {children}
        {helpText && <FormHelperText>{helpText}</FormHelperText>}
        {errorMessage}
      </>
    );
    return name !== undefined ? (
      <FormField name={name}>{wrappedChildren}</FormField>
    ) : (
      wrappedChildren
    );
  },
);

type InputProps = WrapperProps & React.ComponentProps<typeof Input>;
export const FormInput = memo(
  forwardRef((props: InputProps, ref) => {
    const {value, onChange, onBlur} = useFieldContext(props.name);
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
    }));

    return (
      <FormFieldWrapper {...props}>
        <Input
          ref={inputRef}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          {...props}
        />
      </FormFieldWrapper>
    );
  }),
);

type TextAreaProps = WrapperProps & React.ComponentProps<typeof TextArea>;
export const FormTextArea = memo((props: TextAreaProps) => {
  const {value, onChange, onBlur} = useFieldContext(props.name);
  return (
    <FormFieldWrapper {...props}>
      <TextArea
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        {...props}
      />
    </FormFieldWrapper>
  );
});

type SwitchProps = WrapperProps &
  Omit<React.ComponentProps<typeof Switch>, 'onChange' | 'onValueChange'> & {
    onChange?: (_: boolean) => void;
  };
export const FormSwitch = memo(
  ({onChange: onValueChange, label, ...props}: SwitchProps) => {
    const {value, onChange} = useFieldContext<boolean>(props.name);
    return (
      <FormFieldWrapper errorMessage={null} {...props}>
        <Row justifyContent="flex-start">
          <Switch
            value={value}
            onValueChange={onValueChange ?? onChange}
            {...props}
          />
          <Text>{label}</Text>
        </Row>
      </FormFieldWrapper>
    );
  },
);

type CheckboxProps = WrapperProps &
  Omit<React.ComponentProps<typeof Checkbox>, 'value'> & {value?: boolean};
export const FormCheckbox = memo(
  ({value: isChecked, ...props}: CheckboxProps) => {
    const {value, onChange} = useFieldContext<boolean>(props.name);
    return (
      <FormFieldWrapper errorMessage={null} {...props}>
        <CheckBox
          value={isChecked ?? value}
          onValueChange={value => {
            if (onChange) {
              onChange(value);
            }
          }}
          {...props}
        />
      </FormFieldWrapper>
    );
  },
);

export const FormLabel = memo(
  (props: React.ComponentProps<typeof FormControl.Label>) => (
    <FormControl.Label {...props} />
  ),
);

export const FormErrorMessage = memo(
  (props: React.ComponentProps<typeof FormControl.ErrorMessage>) => (
    <FormikErrorMessage name={useFieldContext().name!}>
      {msg => (
        <FormControl.ErrorMessage isInvalid {...props}>
          {msg}
        </FormControl.ErrorMessage>
      )}
    </FormikErrorMessage>
  ),
);

export const FormHelperText = memo(
  (props: React.ComponentProps<typeof FormControl.HelperText>) =>
    useFieldContext().name! in useFormikContext().errors ? undefined : (
      <FormControl.HelperText {...props} />
    ),
);

type RadioGroupProps<T> = {
  values: T[];
  renderRadio: (value: T) => React.ReactNode;
} & WrapperProps &
  Omit<React.ComponentProps<typeof Radio.Group>, 'name'>;
export const FormRadioGroup = memo(
  <T extends string>({values, renderRadio, ...props}: RadioGroupProps<T>) => (
    <FormFieldWrapper {...props}>
      <Radio.Group
        name={props.name!}
        {...useFieldContext(props.name)}
        {...props}>
        {values.map(renderRadio)}
      </Radio.Group>
    </FormFieldWrapper>
  ),
);

export const FormRadio = memo((props: React.ComponentProps<typeof Radio>) => (
  <Radio key={props.value} {...props} />
));

type TooltipProps = React.PropsWithChildren<{
  icon: string;
}>;
export const FormTooltip = memo(({icon, children}: TooltipProps) => {
  return (
    <Popover
      trigger={props => (
        <IconButton
          {...props}
          ml="8px"
          _icon={{color: 'action.active_subtle'}}
          size="xs"
          name={icon}
        />
      )}>
      <Popover.Content bg="grey.800" p="0px" shadow="0">
        <Popover.Arrow bg="grey.800" shadow="0" />
        <Popover.Body
          bg="grey.800"
          px="8px"
          py="4px"
          shadow="0"
          _text={{color: 'primary.contrast', fontSize: '16px'}}>
          {children}
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
});
