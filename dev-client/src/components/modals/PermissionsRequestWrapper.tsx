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

import {useCallback, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Linking} from 'react-native';

import {createPermissionHook} from 'expo-modules-core';

import {ConfirmModal} from 'terraso-mobile-client/components/modals/ConfirmModal';
import {ModalHandle} from 'terraso-mobile-client/components/modals/Modal';

type PermissionHook = ReturnType<typeof createPermissionHook>;

type Props = {
  requestModalTitle: string;
  requestModalBody: string;
  permissionHook: PermissionHook;
  permissionedAction?: () => void;
  children: (onOpen: () => void) => React.ReactNode;
};

// FYI if a calling component uses the permission hook and needs to
// update when permissions are granted, it can set permissionedAction
// to the GetPermissionMethod returned by the hook
export const PermissionsRequestWrapper = ({
  requestModalTitle,
  requestModalBody,
  permissionHook: usePermissions,
  permissionedAction,
  children,
}: Props) => {
  const {t} = useTranslation();
  const ref = useRef<ModalHandle>(null);
  // Issue #1808: These permissions could be outdated if
  // a) nobody has done a "get" or "request" on them since they changed, or
  // b) a descendant component did the "get" or "request", so there is no reason for the given component to re-render
  const [potentiallyOutdatedPermissions, requestPermissions] = usePermissions();

  const onRequestAction = useCallback(async () => {
    if (potentiallyOutdatedPermissions === null) {
      return;
    }

    if (potentiallyOutdatedPermissions.granted) {
      if (permissionedAction !== undefined) {
        permissionedAction();
      }
    } else if (potentiallyOutdatedPermissions.canAskAgain) {
      const result = await requestPermissions();
      if (result.granted && permissionedAction !== undefined) {
        permissionedAction();
      }
    } else {
      ref.current?.onOpen();
    }
  }, [permissionedAction, potentiallyOutdatedPermissions, requestPermissions]);

  return (
    <>
      <ConfirmModal
        ref={ref}
        isConfirmError={false}
        actionName={t('general.open_settings')}
        title={requestModalTitle}
        body={requestModalBody}
        handleConfirm={Linking.openSettings}
      />
      {children(onRequestAction)}
    </>
  );
};
