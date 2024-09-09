/*
 * Copyright © 2024 Technology Matters
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

import {forwardRef} from 'react';
import {Pressable} from 'react-native';

import {
  BottomSheetScrollView,
  BottomSheetModal as GorhomBottomSheetModal,
} from '@gorhom/bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';

import {BackdropComponent} from 'terraso-mobile-client/components/BackdropComponent';
import {BigCloseButton} from 'terraso-mobile-client/components/buttons/icons/common/BigCloseButton';
import {
  ModalContext,
  ModalHandle,
  ModalProps,
} from 'terraso-mobile-client/components/modals/Modal';
import {
  Box,
  Column,
  Row,
} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {useGorhomModalHandleRef} from 'terraso-mobile-client/hooks/gorhomHooks';
import {useHeaderHeight} from 'terraso-mobile-client/hooks/useHeaderHeight';

type Props = ModalProps & {
  fullHeight?: boolean;
  maxHeight?: number;
  scrollable?: boolean;
};

/**
 * To be simplified internally with FormOverlaySheet component work (mobile-client ticket #1774).
 */
export const FormOverlaySheet = forwardRef<
  ModalHandle,
  React.PropsWithChildren<Props>
>(
  (
    {
      Header,
      children,
      trigger,
      Closer,
      fullHeight = false,
      scrollable = true,
      maxHeight,
    },
    ref,
  ) => {
    const {headerHeight} = useHeaderHeight();
    const {modalRef, methods} = useGorhomModalHandleRef(ref);

    const contents =
      Header || Closer ? (
        <Column padding="md">
          <Row alignItems="center" mb="md">
            {Header}
            <Box flex={1} />
            {Closer === undefined ? (
              <BigCloseButton onPress={methods.onClose} />
            ) : (
              Closer
            )}
          </Row>
          {children}
        </Column>
      ) : (
        children
      );

    return (
      <>
        {trigger && (
          <Pressable onPress={methods.onOpen}>
            {trigger(methods.onOpen)}
          </Pressable>
        )}
        <GorhomBottomSheetModal
          ref={modalRef}
          handleComponent={null}
          topInset={headerHeight}
          backdropComponent={BackdropComponent}
          snapPoints={['50%', '100%']}
          enableDynamicSizing={!fullHeight}
          maxDynamicContentSize={fullHeight ? undefined : maxHeight}>
          <ModalContext.Provider value={methods}>
            {scrollable ? (
              <BottomSheetScrollView focusHook={useFocusEffect}>
                {contents}
              </BottomSheetScrollView>
            ) : (
              contents
            )}
          </ModalContext.Provider>
        </GorhomBottomSheetModal>
      </>
    );
  },
);
