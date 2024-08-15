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

import {ModalTrigger} from 'terraso-mobile-client/components/modals/Modal';
import {Heading} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {OverlaySheet} from 'terraso-mobile-client/components/sheets/OverlaySheet';

type InfoSheetProps = React.PropsWithChildren<{
  Header?: React.ReactNode;
  trigger?: ModalTrigger;
}>;

export const InfoSheet = ({Header, trigger, children}: InfoSheetProps) => (
  <OverlaySheet
    fullHeight
    trigger={trigger}
    Header={<Heading variant="h4">{Header}</Heading>}>
    {children}
  </OverlaySheet>
);
