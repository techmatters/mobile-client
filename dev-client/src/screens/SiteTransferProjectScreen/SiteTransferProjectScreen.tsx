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

import {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native';

import {Fab} from 'native-base';

import {Accordion} from 'terraso-mobile-client/components/Accordion';
import {useNavToBottomTabsAndShowSyncError} from 'terraso-mobile-client/components/dataRequirements/handleMissingData';
import {
  ScreenDataRequirements,
  useMemoizedRequirements,
} from 'terraso-mobile-client/components/dataRequirements/ScreenDataRequirements';
import {ConfirmModal} from 'terraso-mobile-client/components/modals/ConfirmModal';
import {Box, Text} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {useTextSearch} from 'terraso-mobile-client/hooks/useTextSearch';
import {transferSites} from 'terraso-mobile-client/model/site/siteGlobalReducer';
import {AppBar} from 'terraso-mobile-client/navigation/components/AppBar';
import {useNavigation} from 'terraso-mobile-client/navigation/hooks/useNavigation';
import {ScreenScaffold} from 'terraso-mobile-client/screens/ScreenScaffold';
import {CheckboxGroup} from 'terraso-mobile-client/screens/SiteTransferProjectScreen/components/CheckboxGroup';
import {ListHeader} from 'terraso-mobile-client/screens/SiteTransferProjectScreen/components/ListHeader';
import {useDispatch, useSelector} from 'terraso-mobile-client/store';
import {selectProjectsWithTransferrableSites} from 'terraso-mobile-client/store/selectors';
import {removeKeys} from 'terraso-mobile-client/util';

const UNAFFILIATED = {
  projectId: Symbol('unaffiliated'),
  projectName: '',
};

type Props = {projectId: string};

export const SiteTransferProjectScreen = ({projectId}: Props) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  UNAFFILIATED.projectName = t('projects.transfer_sites.unaffiliated');

  const hasUnaffiliatedProject = (o: object) =>
    Object.getOwnPropertySymbols(o).find(
      symb => symb === UNAFFILIATED.projectId,
    ) !== undefined;

  const project = useSelector(state => state.project.projects[projectId]);
  const {projects, sites, unaffiliatedSites} = useSelector(state =>
    selectProjectsWithTransferrableSites(state, 'MANAGER'),
  );
  const sitesExcludingCurrent = useMemo(() => {
    const prospectiveSites = sites.filter(site => site.projectId !== projectId);
    const unaffiliated = unaffiliatedSites.map(site => ({
      ...site,
      projectId: UNAFFILIATED.projectId,
      projectName: UNAFFILIATED.projectName,
    }));
    return [...prospectiveSites, ...unaffiliated];
  }, [sites, projectId, unaffiliatedSites]);

  const projectsExcludingCurrent: Record<
    string | symbol,
    {projectId: string | symbol; projectName: string}
  > = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let {[projectId]: _, ...rest} = projects;
    return {...rest, [UNAFFILIATED.projectId]: UNAFFILIATED};
  }, [projects, projectId]);

  const {
    results: searchedSites,
    query,
    setQuery,
  } = useTextSearch({data: sitesExcludingCurrent, keys: ['siteName']});

  const displayedProjects = useMemo(() => {
    const displayed: Record<
      string | symbol,
      {
        projectName: string;
        projId: string | symbol;
        sites: typeof searchedSites;
      }
    > = {};
    for (let site of searchedSites) {
      if (!(site.projectId in displayed)) {
        displayed[site.projectId] = {
          projectName: site.projectName,
          projId: site.projectId,
          sites: [],
        };
      }
      displayed[site.projectId].sites.push(site);
    }
    if (!query) {
      // want to display empty projects if not query!
      for (const {projectId: projId, projectName} of Object.values(
        projectsExcludingCurrent,
      )) {
        if (!(projId in displayed)) {
          displayed[projId] = {projectName, projId, sites: []};
        }
      }
    }
    return displayed;
  }, [projectsExcludingCurrent, searchedSites, query]);

  const listData = useMemo(() => {
    let pool: [string | symbol, (typeof displayedProjects)[string]][] =
      Object.entries(displayedProjects);
    if (hasUnaffiliatedProject(displayedProjects)) {
      pool.push([
        UNAFFILIATED.projectId,
        displayedProjects[UNAFFILIATED.projectId],
      ]);
    }
    const sortedProjects = pool.sort((a, b) => {
      if (a[1].projId === UNAFFILIATED.projectId) {
        return -1;
      }
      return a[1].projectName.localeCompare(b[1].projectName);
    });
    return sortedProjects;
  }, [displayedProjects]);

  const projectRecord = useMemo(() => {
    const record: Record<string | symbol, Record<string, boolean>> = {};
    for (const site of sitesExcludingCurrent) {
      if (
        !(site.projectId in record) ||
        (site.projectId === UNAFFILIATED.projectId &&
          !hasUnaffiliatedProject(record))
      ) {
        record[site.projectId] = {};
      }
      record[site.projectId][site.siteId] = false;
    }
    return record;
  }, [sitesExcludingCurrent]);

  const [projState, setProjState] = useState<typeof projectRecord>({});

  useEffect(() => {
    setProjState(latestState => {
      const newState = Object.assign({...latestState}, projectRecord);
      removeKeys(newState, projectRecord);
      return newState;
    });
  }, [projectRecord, setProjState]);

  const onCheckboxChange = useCallback(
    (groupId: string | symbol, checkboxId: string) => (checked: boolean) => {
      setProjState(currState => {
        const newState = {...currState};
        newState[groupId][checkboxId] = checked;
        return newState;
      });
    },
    [setProjState],
  );

  const checkedSites = useMemo(() => {
    const pool = Object.values(projState);
    if (hasUnaffiliatedProject(projState)) {
      pool.push(projState[UNAFFILIATED.projectId]);
    }
    return pool.flatMap(projSites =>
      Object.entries(projSites)
        .filter(([_, checked]) => checked)
        .map(([siteId, _]) => siteId),
    );
  }, [projState]);

  const disabled = useMemo(() => checkedSites.length === 0, [checkedSites]);

  const onSubmit = useCallback(async () => {
    const payload = {projectId, siteIds: checkedSites};
    await dispatch(transferSites(payload));
    return navigation.pop();
  }, [dispatch, navigation, projectId, checkedSites]);

  const handleMissingProject = useNavToBottomTabsAndShowSyncError();
  const requirements = useMemoizedRequirements([
    {data: project, doIfMissing: handleMissingProject},
  ]);

  return (
    <ScreenDataRequirements requirements={requirements}>
      {() => (
        <ScreenScaffold
          BottomNavigation={null}
          AppBar={<AppBar title={project.name} />}>
          <ScrollView>
            <ListHeader query={query} setQuery={setQuery} />
            {listData.map(item => {
              const [projId, {projectName, sites: projectSites}] = item;

              return (
                <Accordion
                  key={projId.toString()}
                  Head={
                    <Text
                      variant="body1"
                      fontWeight={700}
                      color="primary.contrast"
                      py="14px">
                      {projectName} ({projectSites.length})
                    </Text>
                  }
                  boxProps={{
                    mb: '2px',
                  }}
                  initiallyOpen={projectSites.length > 0}
                  disableOpen={projectSites.length === 0}>
                  {projectSites.length > 0 ? (
                    <Box px="15px" my="15px">
                      <CheckboxGroup
                        groupName={projectName}
                        groupId={projId}
                        checkboxes={projectSites
                          .map(({siteId, siteName}) => ({
                            label: siteName,
                            id: siteId,
                            checked:
                              projState && projState[projId]
                                ? projState[projId][siteId]
                                : false,
                          }))
                          .sort((a, b) => a.label.localeCompare(b.label))}
                        onChangeValue={onCheckboxChange}
                      />
                    </Box>
                  ) : undefined}
                </Accordion>
              );
            })}
            <ConfirmModal
              trigger={onOpen => (
                <Fab
                  label={t('projects.sites.transfer')}
                  onPress={onOpen}
                  isDisabled={disabled}
                  _disabled={{
                    shadow: 0,
                  }}
                />
              )}
              title={t('projects.sites.transfer_site_modal.title')}
              body={t('projects.sites.transfer_site_modal.body')}
              actionName={t('projects.sites.transfer_site_modal.action_name')}
              handleConfirm={onSubmit}
            />
          </ScrollView>
        </ScreenScaffold>
      )}
    </ScreenDataRequirements>
  );
};
