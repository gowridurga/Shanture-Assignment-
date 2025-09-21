import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Checkbox,
  TableSortLabel,
  Box
} from '@mui/material';

const DataTable = ({
  columns,
  data,
  loading = false,
  selectable = false,
  sortable = false,
  pagination = true,
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
  onSelectionChange,
  selectedRows = [],
  onSort,
  sortBy = '',
  sortDirection = 'asc'
}) => {
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((row, index) => index);
      onSelectionChange?.(newSelected);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleRowSelect = (index) => {
    const selectedIndex = selectedRows.indexOf(index);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedRows, index];
    } else {
      newSelected = selectedRows.filter((item) => item !== index);
    }

    onSelectionChange?.(newSelected);
  };

  const isSelected = (index) => selectedRows.indexOf(index) !== -1;

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                    checked={data.length > 0 && selectedRows.length === data.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                >
                  {sortable && column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortDirection : 'asc'}
                      onClick={() => onSort?.(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)}>
                  <Box display="flex" justifyContent="center" p={2}>
                    Loading...
                  </Box>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)}>
                  <Box display="flex" justifyContent="center" p={2}>
                    No data available
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const isItemSelected = isSelected(index);
                return (
                  <TableRow
                    hover
                    key={row.id || index}
                    selected={isItemSelected}
                    onClick={selectable ? () => handleRowSelect(index) : undefined}
                    style={{ cursor: selectable ? 'pointer' : 'default' }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align || 'left'}>
                        {column.format ? column.format(row[column.id], row) : row[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </Paper>
  );
};

export default DataTable;