import {
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import ProjectInputTab from './ProjectInputTab';
import {useTheme} from 'native-base';
import {RouteProp} from '@react-navigation/native';
import ProjectTeamTab from './ProjectTeamTab';
import {USER_PROFILES, fetchProject} from '../../dataflow';
import {TabRoutes, TabStackParamList} from './constants';
import ProjectSettingsTab from './ProjectSettingsTab';
import ProjectSitesTab from './ProjectSitesTab';
import {Icon} from '../common/Icons';
import {Project} from 'terraso-client-shared/project/projectSlice';
type Props = {project: Project};
const Tab = createMaterialTopTabNavigator<TabStackParamList>();

// TODO: There must be a better way
type TabRouteProp = {
  route: RouteProp<TabStackParamList, keyof TabStackParamList>;
};

export default function ProjectTabs({project}: Props) {
  const {colors} = useTheme(); //TODO: Is it better to use useToken?

  function screenOptions({
    route,
  }: TabRouteProp): MaterialTopTabNavigationOptions {
    // TODO: Use a Record type
    let iconName = 'tune';
    switch (route.name) {
      case TabRoutes.INPUTS:
        iconName = 'tune';
        break;
      case TabRoutes.TEAM:
        iconName = 'people';
        break;
      case TabRoutes.SETTINGS:
        iconName = 'settings';
        break;
      case TabRoutes.SITES:
        iconName = 'location-on';
        break;
    }

    return {
      tabBarScrollEnabled: true,
      tabBarIcon: ({color}) => {
        return <Icon name={iconName} color={color} />;
      },
      tabBarActiveTintColor: colors.primary.contrast,
      tabBarInactiveTintColor: colors.secondary.main,
      tabBarItemStyle: {width: 100, flexDirection: 'row'},
      tabBarStyle: {
        backgroundColor: colors.grey[200],
      },
      tabBarIndicatorStyle: {
        backgroundColor: colors.secondary.main,
        height: '100%',
      },
    };
  }
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name={TabRoutes.INPUTS} component={ProjectInputTab} />
      <Tab.Screen
        name={TabRoutes.TEAM}
        component={ProjectTeamTab}
        initialParams={{users: USER_PROFILES}}
      />
      <Tab.Screen
        name={TabRoutes.SETTINGS}
        component={ProjectSettingsTab}
        initialParams={{
          projectId: project.id,
          name: project.name,
          description: project.description,
          privacy: project.privacy,
          downloadLink: 'https://s3.amazon.com/mydownload',
        }}
      />
      <Tab.Screen
        name={TabRoutes.SITES}
        component={ProjectSitesTab}
        initialParams={{
          projectId: 1,
          sites: fetchProject(1).sites,
          //sites: [],
        }}
      />
    </Tab.Navigator>
  );
}
