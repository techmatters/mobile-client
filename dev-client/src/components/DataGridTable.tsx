import {Box, Row, Text} from 'native-base';

type Props = {
  headers: string[];
  rows: (string | React.ReactElement)[][];
} & React.ComponentProps<typeof Box>;

export const DataGridTable = ({rows, headers, ...containerProps}: Props) => {
  const displayCol = (col: string | React.ReactElement, index: number) => {
    if (typeof col === 'string') {
      return (
        <Text flex={1} key={index}>
          {col}
        </Text>
      );
    }
    return (
      <Box flex={1} key={index}>
        {col}
      </Box>
    );
  };

  return (
    <Box {...containerProps}>
      <Row justifyContent="left" variant="tablerow">
        {headers.map((header: (typeof headers)[number], i: number) => (
          <Text variant="table-header" key={i} flex={1}>
            {header}
          </Text>
        ))}
      </Row>
      {rows.map((row: (typeof rows)[number], i: number) => (
        <Row justifyContent="left" key={i} variant="tablerow">
          {row.map(displayCol)}
        </Row>
      ))}
    </Box>
  );
};
