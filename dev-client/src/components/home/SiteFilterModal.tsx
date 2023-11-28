import {Column, FormControl, Select} from 'native-base';
import {Dispatch, SetStateAction} from 'react';
import {useTranslation} from 'react-i18next';
import {SiteFilter} from 'terraso-mobile-client/components/sites/filter.hooks';
import {ProjectSelect} from 'terraso-mobile-client/components/projects/ProjectSelect';
import {USER_ROLES} from 'terraso-mobile-client/constants';

type SiteFilterModalProps = {
  filter: SiteFilter;
  setFilter: Dispatch<SetStateAction<SiteFilter>>;
};
export const SiteFilterModal = ({filter, setFilter}: SiteFilterModalProps) => {
  const {t} = useTranslation();
  return (
    <Column>
      <FormControl>
        <FormControl.Label>
          {t('site.search.filter_projects')}
        </FormControl.Label>
        <ProjectSelect
          projectId={filter.projectId}
          setProjectId={projectId => setFilter(prev => ({...prev, projectId}))}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>{t('site.search.filter_role')}</FormControl.Label>
        <Select
          selectedValue={filter.role}
          onValueChange={role => setFilter(prev => ({...prev, role}) as any)}>
          {USER_ROLES.map(role => (
            <Select.Item
              label={t(`site.role.${role}`)}
              value={role}
              key={role}
            />
          ))}
        </Select>
      </FormControl>
    </Column>
  );
};
