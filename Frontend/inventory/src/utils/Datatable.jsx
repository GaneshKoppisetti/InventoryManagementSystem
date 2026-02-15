import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import {ModuleRegistry,AllCommunityModule} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./Datatable.css"

// ✅ Register AG Grid Modules (IMPORTANT)
ModuleRegistry.registerModules([AllCommunityModule]);

const DataTable = ({
  rowData = [],
  columnDefs = [],
  height = "200px",
  pagination = true,
  pageSize = 10,
  loading = false,
}) => {

  const defaultColDef = useMemo(() => ({
  sortable: true,
  filter: "agTextColumnFilter",
  filterParams: {
    maxNumConditions: 1,
    suppressAndOrCondition: true,
  },
  floatingFilter: true,
  resizable: true,
  suppressMenu: true,
  flex: 1,
  minWidth: 120,
}), []);
  return (
    <div
      className="ag-theme-alpine"
      style={{ height: height, width: "100%" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={pagination}
        paginationPageSize={pageSize}
        animateRows={true}
        loading={loading}
      />
    </div>
  );
};

export default DataTable;
