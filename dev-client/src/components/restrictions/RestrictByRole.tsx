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
import {useMemo} from 'react';

import {ProjectRole} from 'terraso-client-shared/project/projectTypes';

import {useProjectRoleContext} from 'terraso-mobile-client/context/ProjectRoleContext';
import {useSiteRoleContext} from 'terraso-mobile-client/context/SiteRoleContext';
import {SiteUserRole} from 'terraso-mobile-client/store/selectors';

type RestrictProps<RoleType> = {
  role: RoleType | RoleType[];
} & React.PropsWithChildren;

type GenericProps<RoleType> = {
  userRole: RoleType | null;
  cmp: (a: RoleType, b: RoleType) => boolean;
  allowedRole: RoleType | RoleType[];
} & React.PropsWithChildren;

const RestrictByRole = <RoleType,>({
  userRole,
  cmp,
  allowedRole,
  children,
}: GenericProps<RoleType>) => {
  const display = useMemo(() => {
    if (userRole === null) {
      return false;
    }
    if (allowedRole instanceof Array) {
      return allowedRole.filter(a => cmp(userRole, a)).length > 0;
    }
    return cmp(userRole, allowedRole);
  }, [userRole, allowedRole, cmp]);

  return display ? <>{children}</> : <></>;
};

export const projectRolesEqual = (a: ProjectRole, b: ProjectRole) => {
  return a === b;
};

export const siteRolesEqual = (a: SiteUserRole, b: SiteUserRole) => {
  return a.kind === b.kind && a.role === b.role;
};

export const RestrictByProjectRole = ({
  role,
  children,
}: RestrictProps<ProjectRole>) => {
  const userRole = useProjectRoleContext();
  return (
    <RestrictByRole
      userRole={userRole}
      cmp={projectRolesEqual}
      allowedRole={role}>
      {children}
    </RestrictByRole>
  );
};

export const RestrictBySiteRole = ({
  role,
  children,
}: RestrictProps<SiteUserRole>) => {
  const siteRole = useSiteRoleContext();

  return (
    <RestrictByRole userRole={siteRole} cmp={siteRolesEqual} allowedRole={role}>
      {children}
    </RestrictByRole>
  );
};
