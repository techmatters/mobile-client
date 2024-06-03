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

import {Box, Text} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {formatPercent} from 'terraso-mobile-client/util';

type ScoreTileProps = {
  score: number;
};

export function ScoreTile({score}: ScoreTileProps) {
  return (
    <Box
      width="94px"
      height="54px"
      borderRadius="4px"
      backgroundColor="background.secondary"
      justifyContent="center"
      alignItems="center">
      <Text variant="score-tile" color="primary.lighter">
        {formatPercent(score)}
      </Text>
    </Box>
  );
}
