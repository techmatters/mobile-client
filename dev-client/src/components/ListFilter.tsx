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
import {
  Button,
  FormControl,
  HStack,
  Input,
  Radio,
  Select,
  VStack,
} from 'native-base';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import BadgedIcon from 'terraso-mobile-client/components/BadgedIcon';
import {Icon, IconButton} from 'terraso-mobile-client/components/Icons';
import {useTranslation} from 'react-i18next';
import {Modal, ModalHandle} from 'terraso-mobile-client/components/Modal';
import {sortCompare} from 'terraso-mobile-client/util';
import {NullableSelect} from 'terraso-mobile-client/components/NullableSelect';

type Lookup<Item, RecordValue = string> = {
  record?: Record<string, RecordValue | undefined>;
  key: keyof Item | string[];
};

export type SortingOption<Item> = {
  order: 'ascending' | 'descending';
} & Lookup<Item, number | string>;

type FilterFn<Item> =
  | {
      kind: 'filter';
      f: (val: string) => (comp: string | undefined) => boolean;
      preprocess?: (val: string) => string;
      lookup: Lookup<Item>;
      hide?: true;
    }
  | {
      kind: 'sorting';
      options: Record<string, SortingOption<Item>>;
    };

export type ListFilterState<Item, FilterNames extends string> = {
  filteredItems: Item[];
  values: Record<string, string | undefined>;
  setValue: (key: FilterNames) => (newValue: string | undefined) => void;
  applyFilters: () => void;
  clearUnapplied: () => void;
  numFilters: number;
};

const ListFilterContext = createContext<ListFilterState<any, any>>({
  filteredItems: [],
  values: {},
  setValue: () => () => {},
  applyFilters: () => {},
  clearUnapplied: () => {},
  numFilters: 0,
});

type ContextHook<Item, Name> = Name extends string
  ? {
      setValue: (newValue: string | undefined) => void;
      value: string | undefined;
      applyFilters: () => void;
      numFilters: number;
    }
  : {
      applyFilters: () => void;
      clearUnapplied: () => void;
      numFilters: number;
      filteredItems: Item[];
    };

type ProviderProps<Item, Filters extends string> = {
  items: Item[];
  filters: {[Property in Filters]: FilterFn<Item>};
} & React.PropsWithChildren;

export const ListFilterProvider = <
  Item extends object,
  Filters extends string,
>({
  items,
  filters,
  children,
}: ProviderProps<Item, Filters>) => {
  const [values, setValues] = useState<Record<string, string | undefined>>({});
  const [appliedValues, setAppliedValues] = useState<
    Record<string, string | undefined>
  >({});
  const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);

  const setValue = (name: string) => (newValue: string | undefined) =>
    setValues(state => ({...state, [name]: newValue}));

  const numFilters = useMemo(
    () =>
      Object.entries<FilterFn<Item>>(filters)
        .filter(([, f]) => f.kind === 'filter' && !('hide' in f && f.hide))
        .map(([name]) => appliedValues[name])
        .filter(val => val !== undefined).length,
    [appliedValues, filters],
  );

  const applyFilters = useCallback(
    () => setNeedsUpdate(true),
    [setNeedsUpdate],
  );

  const getNestedObjectValues = (item: any, keyPath: string): string[] => {
    const keys = keyPath.split('.');
    let targetProperty = keys.pop();

    if (typeof targetProperty !== 'string' || keys.length === 0) {
      return [];
    }

    let currentObject = item;
    for (const key of keys) {
      if (currentObject && typeof currentObject === 'object') {
        currentObject = currentObject[key];
      } else {
        return [];
      }
    }

    if (typeof currentObject !== 'object' || currentObject === null) {
      return [];
    }

    return Object.values(currentObject as Record<string, any>)
      .filter(subItem => subItem && typeof subItem === 'object')
      .map(subItem => {
        return subItem[targetProperty as keyof typeof subItem];
      })
      .filter(value => value != null);
  };

  const itemsWithFiltersApplied = useMemo(() => {
    const res: Item[] = Object.entries<FilterFn<Item>>(filters).reduce(
      (x, [name, fn]) => {
        const currentVal = values[name];
        if (currentVal === undefined) {
          return x;
        }
        switch (fn.kind) {
          case 'filter':
            let processed = currentVal;
            if (fn.preprocess) {
              processed = fn.preprocess(processed);
            }
            let getFilterVal: (val: Item) => string | undefined;
            if (fn.lookup.record !== undefined) {
              getFilterVal = (val: Item) =>
                fn.lookup.record![String(val[fn.lookup.key as keyof Item])];
            } else {
              getFilterVal = (val: Item) => {
                const keys = Array.isArray(fn.lookup.key)
                  ? fn.lookup.key
                  : [fn.lookup.key];
                return keys
                  .map(key => {
                    if (typeof key === 'string' && key.includes('.')) {
                      const itemVal = getNestedObjectValues(val, key);
                      return String(itemVal);
                    } else {
                      let itemVal = val[key as keyof Item];
                      return String(itemVal);
                    }
                  })
                  .join(' ');
              };
            }
            return x.filter(item => fn.f(processed)(getFilterVal(item)));

          case 'sorting':
            const selectedVal = values[name];
            if (selectedVal === undefined) {
              return x;
            }
            const options = fn.options[selectedVal];
            if (options === undefined) {
              console.warn(
                'Trying to sort with an undefined sorting configuration; ignoring',
                selectedVal,
              );
              return x;
            }
            const {key, record: lookupRecord, order} = options;
            const getValue = (a: Item): string | number | undefined => {
              let val;
              if (typeof key === 'string' && key in a) {
                if (lookupRecord === undefined) {
                  val = a[key as keyof Item];
                } else {
                  val = lookupRecord[String(a[key as keyof Item])];
                }
              }

              if (
                val === undefined ||
                typeof val === 'string' ||
                typeof val === 'number'
              ) {
                return val as undefined | number | string;
              }
              return String(val);
            };
            // make a copy of x, because sort modifies in place
            return [...x].sort((a, b) => {
              const valA = getValue(a);
              const valB = getValue(b);
              return sortCompare(valA, valB, order);
            });
        }
      },
      items,
    );
    return res;
  }, [items, values, filters]);

  const clearUnapplied = useCallback(() => {
    setValues(appliedValues);
  }, [setValues, appliedValues]);

  useEffect(() => {
    if (needsUpdate) {
      setFilteredItems(itemsWithFiltersApplied);
      setAppliedValues(values);
      setNeedsUpdate(false);
    }
  }, [itemsWithFiltersApplied, needsUpdate, setNeedsUpdate, values]);

  // reload filtered items if items changes
  useEffect(() => {
    setNeedsUpdate(true);
  }, [items]);

  const value: ListFilterState<Item, Filters> = {
    values,
    filteredItems,
    setValue,
    applyFilters,
    clearUnapplied,
    numFilters,
  };

  return (
    <ListFilterContext.Provider value={value}>
      {children}
    </ListFilterContext.Provider>
  );
};

export const FilterForwarder = <Item, Filters extends string>({
  value,
  children,
}: {
  value: ListFilterState<Item, Filters>;
} & React.PropsWithChildren) => {
  return (
    <ListFilterContext.Provider value={value}>
      {children}
    </ListFilterContext.Provider>
  );
};

export function useListFilter<Item>(): ContextHook<Item, undefined>;
export function useListFilter<Item>(name: string): ContextHook<Item, string>;
export function useListFilter<Item>(
  name?: string,
): ContextHook<Item, typeof name> {
  const {values, setValue, ...common} = useContext(ListFilterContext);
  if (name === undefined) {
    return common;
  }
  return {
    value: values[name],
    setValue: setValue(name),
    ...common,
  };
}

type OptionFilterProps<FilterNames extends string> = {
  label: string;
  options: Record<string, string>;
  name: FilterNames;
};

export const SelectFilter = <FilterNames extends string>({
  name,
  options,
  label,
  ...selectProps
}: OptionFilterProps<FilterNames> &
  Omit<
    React.ComponentProps<typeof NullableSelect>,
    'selectedValue' | 'onValueChange'
  >) => {
  const {setValue, value} = useListFilter<any>(name);

  const onValueChange = useCallback(
    (newValue: string | undefined) => {
      return setValue(newValue);
    },
    [setValue],
  );

  return (
    <FormControl>
      <FormControl.Label>{label}</FormControl.Label>
      <NullableSelect
        {...selectProps}
        selectedValue={value}
        onValueChange={onValueChange}>
        {Object.entries(options).map(([optionKey, itemLabel]) => (
          <Select.Item value={optionKey} key={optionKey} label={itemLabel} />
        ))}
      </NullableSelect>
    </FormControl>
  );
};

type TextInputProps = {
  placeholder: string;
  label: string;
  name: string;
};

export const TextInputFilter = ({placeholder, label, name}: TextInputProps) => {
  const {t} = useTranslation();
  const {value, setValue, applyFilters} = useListFilter<any>(name);

  const onChangeText = useCallback(
    (newText: string) => {
      setValue(newText);
      applyFilters();
    },
    [setValue, applyFilters],
  );

  const clearText = useCallback(() => onChangeText(''), [onChangeText]);

  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      accessibilityLabel={label}
      flex={1}
      bg="background.default"
      pl="8px"
      py="6px"
      InputLeftElement={<Icon ml="16px" name="search" />}
      InputRightElement={
        value !== undefined && value.length ? (
          <IconButton
            name="close"
            onPress={clearText}
            accessibilityLabel={t('listfilter.clear_search_label')}
            _icon={{
              color: 'action.active',
            }}
          />
        ) : undefined
      }
    />
  );
};

export const RadioFilter = <FilterNames extends string>({
  label,
  options,
  name,
}: Omit<OptionFilterProps<FilterNames>, 'placeholder'>) => {
  const {setValue, value} = useListFilter<any>(name);

  return (
    <FormControl>
      <FormControl.Label>{label}</FormControl.Label>
      <Radio.Group name={name} value={value} onChange={setValue}>
        {Object.entries(options).map(([optionName, optionLabel]) => (
          <Radio value={optionName} key={optionName} size="sm">
            {optionLabel}
          </Radio>
        ))}
      </Radio.Group>
    </FormControl>
  );
};

type FilterModalBodyProps = {onClose?: () => void} & React.PropsWithChildren;

export const FilterModalBody = ({onClose, children}: FilterModalBodyProps) => {
  const {t} = useTranslation();
  const {applyFilters} = useListFilter<any>();

  const onPress = useCallback(() => {
    applyFilters();
    if (onClose) {
      onClose();
    }
  }, [applyFilters, onClose]);

  return (
    <VStack space="25px" my="25px" testID="MODAL">
      {children}
      <Button onPress={onPress}>{t('general.apply')}</Button>
    </VStack>
  );
};

type FilterModalTriggerProps = {
  onOpen: () => void;
} & React.PropsWithChildren;

export const FilterModalTrigger = ({
  onOpen,
  children,
}: FilterModalTriggerProps) => {
  const {t} = useTranslation();
  const {numFilters} = useListFilter<any>();

  return (
    <HStack space="20px" mb="15px">
      <BadgedIcon
        iconName="filter-list"
        onPress={onOpen}
        badgeNum={numFilters}
        accessibilityLabel={t('listfilter.open_modal_label')}
        _badge={{
          accessibilityLabel: t('listfilter.num_filters_label'),
        }}
        _iconButton={{
          variant: 'filterIcon',
        }}
      />
      {children}
    </HStack>
  );
};

type ModalProps = {searchInput: React.ReactNode} & React.PropsWithChildren;

export const ListFilterModal = ({searchInput, children}: ModalProps) => {
  // exceptionally do not use hook here; need to pass the context value to the modal as prop
  // this is because NativeBase Modals are rerendered in the element tree
  // and do not receive context from providers not defined above NativeBaseProvider
  // see https://nativebase.hashnode.dev/how-the-overlay-component-works-in-nativebase#heading-portalprovider
  const value = useContext(ListFilterContext);
  const modalRef = useRef<ModalHandle>(null);
  const onClose = useCallback(() => {
    if (modalRef.current !== null) {
      modalRef.current.onClose();
    }
  }, [modalRef]);

  return (
    <Modal
      ref={modalRef}
      closeHook={value.clearUnapplied}
      trigger={onOpen => (
        <FilterModalTrigger onOpen={onOpen}>{searchInput}</FilterModalTrigger>
      )}>
      <FilterForwarder value={value}>
        <FilterModalBody onClose={onClose}>{children}</FilterModalBody>
      </FilterForwarder>
    </Modal>
  );
};
