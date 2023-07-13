import {
  Icon as NativeIcon,
  IconButton as NativeIconButton,
  Center,
  Text,
  Box,
} from 'native-base';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
export {default as MaterialCommunityIcons} from 'react-native-vector-icons/MaterialCommunityIcons';

export type IconProps = React.ComponentProps<typeof NativeIcon>;
export const Icon = ({as, ...props}: IconProps) => (
  <NativeIcon as={as ?? MaterialIcons} {...props} />
);

export type IconButtonProps = React.ComponentProps<typeof NativeIconButton> & {
  as?: any;
  name: string;
  label?: string;
};
export const IconButton = React.forwardRef(
  (
    {as, name, label, ...props}: IconButtonProps,
    ref: React.Ref<typeof NativeIconButton>,
  ) => {
    const icon = (
      <NativeIconButton
        ref={ref}
        icon={<Icon as={as} name={name} />}
        {...props}
      />
    );
    if (label === undefined) {
      return icon;
    }
    return (
      <Box p="1">
        {icon}
        <Center>
          <Text color="primary.contrast" fontSize="xs">
            {label}
          </Text>
        </Center>
      </Box>
    );
  },
);
