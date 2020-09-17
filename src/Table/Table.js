import React, { useRef,useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import format from 'date-fns/format';

import { AutoSizer, Grid, ScrollSync } from 'react-virtualized';
import Draggable from 'react-draggable';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  actionButton: {
    padding: 0
  },
  actionIcon: {
    fontSize: '.875rem',
    width: 'auto'
  },
  actionIconSelected: {
    color: theme.palette.primary.contrastText
  },
  center: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cell: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis', 
    overflow: 'hidden',
    boxSizing: 'border-box',
    padding: '6px 5px 5px 6px',
    userSelect: 'none'
  },
  cellAction: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    boxSizing: 'border-box',
    overflow: 'hidden',
    padding: '6px 5px 5px 6px',
    textAlign: 'center',
    userSelect: 'none'
  },
  cellNumber: {
    textAlign: 'right'
  },
  cellRowNumber: {
    backgroundImage: '-webkit-linear-gradient(top, #fff, #fff 30%, #fff 65%, #f0f0f0)',
    textAlign: 'center'
  },
  checkBox: {
    color: theme.palette.primary.contrastText
  },
  dragHandle: {
    flex: '0 0 16px',
    zIndex: 2,
    cursor: 'col-resize',
    color: '#0085ff',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    }
  },
  dragHandleActive: {
    color: '#0b6fcc',
    zIndex: 3,
    '&:hover': {
      color: '#0b6fcc',
      zIndex: 3
    }
  },
  dragHandleIcon: {
    flex: '0 0 3px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    backgroundImage: '-webkit-linear-gradient(top, #fff, #fff 30%, #fff 65%, #f0f0f0)',
    borderTop: '1px solid rgba(224, 224, 224, 1)',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    overflow: 'hidden !important'
  },
  headerCell: {
    borderBottom: 'none',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    boxSizing: 'border-box',
    padding: '6px 0 6px 6px',
    userSelect: 'none',
    '&:hover': {
      backgroundImage: `-webkit-linear-gradient(top, #fff, #fff 30%, ${theme.palette.primary.light} 65%, ${theme.palette.primary.light})`
    },
    display: 'flex'
  },
  headerContent: {
    flex: 'auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap'
  },
  icon: {
    fontSize: '0.75rem'
  },
  pagination: {
    borderTop: '1px solid rgba(224, 224, 224, 1)'
  },
  paginationActions: {
    flexShrink: 0, 
    marginLeft: '1.25rem', 
    marginRight: '0.5rem'
  },
  paginationCaption: {
    flexShrink: 0
  },
  paginationSelect: {
    flexShrink: 0, 
    marginLeft: '0.5rem', 
    marginRight: '1.25rem'
  },
  rowHover: {
    backgroundColor: theme.palette.primary.light
  },
  rowSelected: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  sortIcon: {
    height: 14,
    width: 14
  },
  spacer: {
    flex: '1 1 100%'
  },
  textNoData: {
    color: "gray", 
    fontSize: '0.75rem', 
    padding: '0.625rem'
  },
  toolbar: {
    alignItems: 'center',
    display: 'flex',
    fontFamily: 'inherit',
    fontSize: '0.75rem',
    minHeight: '2.25rem', 
    position: 'relative'
  }
}));

const Table = props => {
  const classes = useStyles();
  const [rowHoverIndex, setRowHoverIndex] = useState(-1);
  const headerEl = useRef(null);
  const bodyEl = useRef(null);
  const { actions, columns, count, enableColumnResize, loading, multiSelect, page, paginate, rowCount, rowHeight, rowNumber, rowsPerPage, selected, sortableColumns, sortBy, sortDirection } = props;
  const { editor, onChangePage, onChangeRowsPerPage, onRowClick, onRowDoubleClick, onSort, onUpdateColumn, rowGetter } = props;

  const handleSelectAllClick = event => {
    if (event.target.checked) {
        const newSelecteds = [];

        for (let index = 0; index < rowCount; index++) {
          newSelecteds.push(rowGetter(index));
        }

        onRowClick(newSelecteds);
        return;
      }
      onRowClick([]);
};
  
  const handleSelectedRow = (item) => {
    let selectedIndex = selected.indexOf(item);

    if(multiSelect) {
      if(selectedIndex === -1) {
        onRowClick([...selected, item]);
      }
      else {
        onRowClick(selected.filter(i => i !== item));
      }
    }
    else {
      if(selectedIndex === -1) {
        onRowClick([item]);
      }
    }
  };

  const resizeColumn = ({ column, deltaX }) => {
    if(column.width + deltaX <= 25) {
      return;
    }

    column.width += deltaX;
    onUpdateColumn(column);
    headerEl.current.recomputeGridSize();
    if(bodyEl.current) {
      bodyEl.current.recomputeGridSize();
    }
  }

  const renderHeaderCell = ({ columnIndex, key, rowIndex, style }) => {
    if(rowNumber && columnIndex === 0) {
      return (
        <div className={clsx(classes.headerCell, classes.cellRowNumber)} key={key} style={style}/>
      );
    }

    if((!rowNumber && multiSelect && columnIndex === 0) || (rowNumber && multiSelect && columnIndex === 1)) {
      return (
        <div className={classes.headerCell} key={key} style={style}>
          <Checkbox
            indeterminate={selected.length > 0 && selected.length < rowCount}
            checked={selected.length === rowCount}
            color="default"
            onChange={handleSelectAllClick}
            style={{ padding: 0 }}
          />
        </div>
      );
    }

    if((rowNumber ? 1 : 0) + (multiSelect ? 1 : 0) + actions.length > columnIndex)
    {
      return (
        <div className={clsx(classes.headerCell, classes.cellRowNumber)} key={key} style={style}/>
      );
    }

    columnIndex = columnIndex - (rowNumber ? 1 : 0) - (multiSelect ? 1 : 0) - actions.length;

    return (
      <div className={classes.headerCell} key={key} style={style}>
        {sortableColumns && (<TableSortLabel
          className={classes.headerContent}
          classes={{ icon: classes.sortIcon }}
          active={sortBy === columns[columnIndex].dataKey}
          direction={sortDirection}
          onClick={() => onSort(columns[columnIndex].dataKey)}
        >
          {columns[columnIndex].label}
        </TableSortLabel>)}
        {!sortableColumns && (<div className={classes.headerContent}>
          {columns[columnIndex].label}
        </div>)}
        {enableColumnResize && (<Draggable
          axis="x"
          defaultClassName={classes.dragHandle}
          defaultClassNameDragging={classes.dragHandleActive}
          onDrag={(event, { deltaX }) =>
            resizeColumn({
              column: {...columns[columnIndex]},
              deltaX
            })
          }
          position={{ x: 0 }}
          zIndex={999}
        >
          <span className={classes.dragHandleIcon}></span>
        </Draggable>)}
      </div>
    );
  }

  const renderRowCell = ({ columnIndex, key, rowIndex, style }) => {
    if(rowNumber && columnIndex === 0) {
      return (
        <div className={clsx(classes.cell, classes.cellRowNumber)} key={key} style={style} onClick={() => handleSelectedRow(rowGetter(rowIndex))}>
          {paginate ? page*rowsPerPage + rowIndex + 1 : rowIndex + 1}
        </div>
      );
    }

    if((!rowNumber && multiSelect && columnIndex === 0) || (rowNumber && multiSelect && columnIndex === 1)) {
      return (
        <div
          className={clsx(classes.cell, {
            [classes.rowSelected]: selected.indexOf(rowGetter(rowIndex)) !== -1,
            [classes.rowHover]: rowIndex === rowHoverIndex
          })}
          key={key}
          style={style}
          onClick={() => handleSelectedRow(rowGetter(rowIndex))}
          onMouseEnter={() => setRowHoverIndex(rowIndex)}
          onMouseLeave={() => setRowHoverIndex(-1)}
        >
          <Checkbox
              className={selected.indexOf(rowGetter(rowIndex)) !== -1 ? classes.checkBox : null}
              checked={selected.indexOf(rowGetter(rowIndex)) !== -1}
              color="default"
              style={{ padding: 0 }}
          />
        </div>
      );
    }

    if((rowNumber ? 1 : 0) + (multiSelect ? 1 : 0) + actions.length > columnIndex)
    {
      let i = columnIndex - (rowNumber ? 1 : 0) - (multiSelect ? 1 : 0);

      return (
        <div
          className={clsx(classes.cellAction, {
            [classes.rowSelected]: selected.indexOf(rowGetter(rowIndex)) !== -1,
            [classes.rowHover]: rowIndex === rowHoverIndex
          })}
          key={key}
          style={style}
          onMouseEnter={() => setRowHoverIndex(rowIndex)}
          onMouseLeave={() => setRowHoverIndex(-1)}
        >
          {actions[i].tooltip && (<Tooltip title={actions[i].tooltip} arrow>
            <IconButton className={classes.actionButton} onClick={() => actions[i].onClick(rowGetter(rowIndex))}>
              <Icon className={clsx(classes.actionIcon, actions[i].iconCls, { [classes.actionIconSelected]: selected.indexOf(rowGetter(rowIndex)) !== -1 })}/>
            </IconButton>
          </Tooltip>)}
          {!actions[i].tooltip && (<IconButton className={classes.actionButton} onClick={() => actions[i].onClick(rowGetter(rowIndex))}>
              <Icon className={clsx(classes.actionIcon,actions[i].iconCls, { [classes.actionIconSelected]: selected.indexOf(rowGetter(rowIndex)) !== -1 })}/>
          </IconButton>)}
        </div>
      )
    }

    columnIndex = columnIndex - (rowNumber ? 1 : 0) - (multiSelect ? 1 : 0) - actions.length

    let type = columns[columnIndex].type;
    let value = null;

    switch (type) {
      case 'boolean':
        value = rowGetter(rowIndex)[columns[columnIndex].dataKey] ? columns[columnIndex].trueText || 'Si' : columns[columnIndex].trueText || 'No';
        break;
      case 'datetime':
        value = rowGetter(rowIndex)[columns[columnIndex].dataKey] ? format(new Date(rowGetter(rowIndex)[columns[columnIndex].dataKey]),  columns[columnIndex].format || 'dd/MM/yyyy') : ''
        break;
      case 'number':
        value = new Intl.NumberFormat('en-US', { minimumFractionDigits: columns[columnIndex].decimalPrecision || 2, maximumFractionDigits: columns[columnIndex].decimalPrecision || 2 }).format(rowGetter(rowIndex)[columns[columnIndex].dataKey]);
        break;
      default:
        value = rowGetter(rowIndex)[columns[columnIndex].dataKey];
        break;
    }
    
    return (
      <div
        className={clsx(classes.cell, {
          [classes.rowSelected]: selected.indexOf(rowGetter(rowIndex)) !== -1,
          [classes.rowHover]: rowIndex === rowHoverIndex,
          [classes.cellNumber]: type === 'number'
        })}
        key={key}
        style={style}
        onClick={() => handleSelectedRow(rowGetter(rowIndex))}
        onDoubleClick={() => onRowDoubleClick(rowGetter(rowIndex))}
        onMouseEnter={() => setRowHoverIndex(rowIndex)}
        onMouseLeave={() => setRowHoverIndex(-1)}
      >
        {editor ? editor(columnIndex, rowGetter(rowIndex), columns[columnIndex].dataKey) || value : value}
      </div>
    );
  }

  return (
    <ScrollSync>
      {({ onScroll, scrollLeft }) => (
        <AutoSizer >
          {({ height, width }) => (
            <div>
              <Grid
                cellRenderer={renderHeaderCell}
                className={classes.header}
                columnCount={columns.length + (rowNumber ? 1 : 0) + (multiSelect ? 1 : 0) + actions.length}
                columnWidth={({ index }) => {
                  if(rowNumber && index === 0) {
                    return 35;
                  }
                  if(!rowNumber && multiSelect && index === 0 ) {
                    return 32;
                  }
                  if(rowNumber && multiSelect && index === 1) {
                    return 32;
                  }
                  if((rowNumber ? 1 : 0) + (multiSelect ? 1 : 0) + actions.length > index) {
                    return 32;
                  }
                  return columns[index - (rowNumber ? 1 : 0) - (multiSelect ? 1 : 0) - actions.length].width;
                }}
                height={26}
                ref={headerEl}
                rowCount={1}
                rowHeight={rowHeight}
                scrollLeft={scrollLeft}
                style={{ outline: 'none', fontSize: '0.6875rem' }}
                width={width}
              />
              {rowCount > 0 && !loading && (<Grid
                cellRenderer={renderRowCell}
                columnCount={columns.length + (rowNumber ? 1 : 0) + (multiSelect ? 1 : 0) + actions.length}
                columnWidth={({ index }) => {
                  if(rowNumber && index === 0) {
                    return 35;
                  }
                  if(!rowNumber && multiSelect && index === 0 ) {
                    return 32;
                  }
                  if(rowNumber && multiSelect && index === 1) {
                    return 32;
                  }
                  if((rowNumber ? 1 : 0) + (multiSelect ? 1 : 0) + actions.length > index) {
                    return 32;
                  }
                  return columns[index - (rowNumber ? 1 : 0) - (multiSelect ? 1 : 0) - actions.length].width;
                }}
                height={height - rowHeight - (paginate ? 36 : 0)}
                onScroll={onScroll}
                ref={bodyEl}
                rowCount={rowCount}
                rowHeight={rowHeight}
                style={{ outline: 'none', fontSize: '0.6875rem', fontWeight: 400, lineHeight: 1.43, borderBottom: '1px solid rgba(224, 224, 224, 1)', letterSpacing: '0.01071em' }}
                width={width}
              />)}
              {(rowCount === 0 || loading) && (<div style={{ height: height - 62, width: width }}>
                {loading && <div className={classes.center}>
                    <CircularProgress color="primary"/>
                </div>}
                {!loading && <div className={classes.textNoData}>
                    No se encontraron registros
                </div>}
              </div>)}
              {paginate && (<div style={{ height: 36, width: width }}>
                <div className={classes.pagination}>
                  <div className={classes.toolbar}>
                    <div className={classes.spacer} />
                    <p className={classes.paginationCaption}>Filas por página</p>
                    <Select className={classes.paginationSelect} onChange={onChangeRowsPerPage} value={rowsPerPage} variant="outlined">
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      <MenuItem value={200}>200</MenuItem>
                    </Select>
                    <p className={classes.paginationCaption}>{count === 0 ? 0 : page*rowsPerPage + 1}-{count === 0 ? 0 : (count > (page + 1)*rowsPerPage ? (page + 1)*rowsPerPage : count)} de {count}</p>
                    <div className={classes.paginationActions}>
                      <IconButton disabled={page===0} disableRipple onClick={() => onChangePage(page - 1)}>
                          <Icon className={clsx("fas fa-chevron-left", classes.icon)} />
                      </IconButton>
                      <IconButton disabled={page === parseInt(count/rowsPerPage)} disableRipple onClick={() => onChangePage(page + 1)}>
                          <Icon className={clsx("fas fa-chevron-right", classes.icon)} />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>)}
            </div>
          )}
        </AutoSizer>
      )}
    </ScrollSync>
  );
}

Table.defaultProps = {
  actions: [],
  enableColumnResize: true,
  loading: false,
  multiSelect: false,
  paginate: false,
  rowHeight: 26,
  rowNumber: true,
  sortableColumns: true
};

Table.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      iconCls: PropTypes.string,
      tooltip: PropTypes.string,
      onClick: PropTypes.func
    })
  ),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      decimalPrecision: PropTypes.number,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      width: PropTypes.number,
    })
  ).isRequired,
  count: PropTypes.number,
  editor: PropTypes.func,
  enableColumnResize: PropTypes.bool,
  loading: PropTypes.bool,
  multiSelect: PropTypes.bool,
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  onRowClick: PropTypes.func,
  onRowDoubleClick: PropTypes.func,
  onSort: PropTypes.func,
  onUpdateColumn: PropTypes.func,
  page: PropTypes.number,
  paginate: PropTypes.bool,
  rowCount: PropTypes.number.isRequired,
  rowGetter: PropTypes.func.isRequired,
  rowHeight: PropTypes.number.isRequired,
  rowNumber: PropTypes.bool,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
  sortableColumns: PropTypes.bool,
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string
};

export default Table;