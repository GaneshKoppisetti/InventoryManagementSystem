import { AgGridReact } from "ag-grid-react";
import { useMemo, useState } from "react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { Plus } from "lucide-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
import "./Datatable.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const DataTable = ({ rowData = [], columnDefs = [], height = "500px", pagination = true, pageSize = 10, pageSizeOptions = [10, 20, 50, 100],onAdd=()=>{}}) => {
  const [quickFilterText, setQuickFilterText] = useState("");

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: "agTextColumnFilter",

    // ✅ single condition only
    filterParams: {
      maxNumConditions: 1,
      suppressAndOrCondition: true,
      placeholder: "Search...",
    },

    resizable: true,
    suppressMenu: false, // allow filter icon in header
    flex: 1,
    minWidth: 140,
  }), []);


  return (
    <div className="view-container">
      <div className="add-button-container">
        <button
          type="button"
          className="add-button"
          onClick={() => onAdd()}
        >
          <Plus size={18} className="btn-icon" />
          <span>New</span>
        </button>
      </div>
      <div className="custom-grid-wrapper">

        {/* Toolbar OUTSIDE grid theme */}
        <div className="global-search-container">
          <input
            type="text"
            placeholder="Search..."
            value={quickFilterText}
            onChange={(e) => setQuickFilterText(e.target.value)}
            className="global-search"
          />
        </div>

        {/* Grid container */}
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
            paginationPageSizeSelector={pageSizeOptions}
            quickFilterText={quickFilterText}
            animateRows={true}
            rowSelection="multiple"
          />
        </div>
      </div>
    </div>
  );
};

export default DataTable;
