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

import {BulletList} from 'terraso-mobile-client/components/BulletList';
import {TranslatedBody} from 'terraso-mobile-client/components/content/text/TranslatedBody';
import {Column} from 'terraso-mobile-client/components/NativeBaseAdapters';

export function SoilPropertiesScoreInfoContent() {
  return (
    <Column space={3}>
      <TranslatedBody i18nKey="site.soil_id.soil_properties_score_info.p1" />
      <TranslatedBody i18nKey="site.soil_id.soil_properties_score_info.p2" />
      <TranslatedBody i18nKey="site.soil_id.soil_properties_score_info.p3" />
      <TranslatedBody i18nKey="site.soil_id.soil_properties_score_info.p4" />
      <BulletList
        data={[1, 2, 3, 4, 5]}
        renderItem={i => (
          <TranslatedBody
            i18nKey={`site.soil_id.soil_properties_score_info.bullets.${i}`}
          />
        )}
      />
    </Column>
  );
}
