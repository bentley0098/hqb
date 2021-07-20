// Importing dependencies required for React, DataGrid, Bootstrap Stylings etc. 
import React, {  useState, useEffect, useCallback } from 'react';
import './App.css';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise'
import '@inovua/reactdatagrid-enterprise/index.css'
import '@inovua/reactdatagrid-enterprise/theme/default-dark.css'
import '@inovua/reactdatagrid-enterprise/theme/default-light.css'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal'




// Importing getTasks() to fetch data from express.js server
import {getTasks, getHistory} from './returnTasks.js'


// Setting up columns and styling for DataGrid
const columns = [
  {name:'Task', header:'ID', type: 'number', defaultFlex: 1, maxWidth:70},
  {name:'Customer', header:'Customer', defaultFlex: 1, maxWidth: 250},
  {name:'Details', header:'Details', defaultFlex: 1, minWidth: 500},
  {name:'Area', header:'Area', defaultFlex: 1, maxWidth: 90},
  {name:'Application', header:'Section', defaultFlex: 1, maxWidth: 100},
  {name:'Contact', header:'Contact', defaultFlex: 1, maxWidth: 100},
  {name:'Last Comment', header:'Last Comment', defaultFlex: 1},
  {name:'Requested', header:'Requested', defaultFlex: 1, maxWidth: 115, sortable: false},
  {name:'Updated', header:'Updated', defaultFlex: 1, maxWidth: 115, sortable: false},
  {name:'DueDate', header:'Due Date', defaultFlex: 1, maxWidth: 115, sortable: false},
  {name:'P', header:'P', type: 'number', defaultFlex: 1, maxWidth: 60},
  {name:'Owner_Name', header:'Owner', defaultFlex: 1, maxWidth: 100}
]
const gridStyle = {
  minHeight: 800,
  margin: 15
}
const theme = 'default-dark'

const historyColumns = [
  {name: 'Username', header: 'User'},
  {name: 'Datetime', header: 'When'},
  {name: 'Notes', header: 'Notes'}
] 

// --Export DataGrid to Excel-- //
const downloadBlob = (blob, fileName = 'grid-data.csv') => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.position = 'absolute';
  link.style.visibility = 'hidden';

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};

const SEPARATOR = ',';


// Main App Function for loading web page
function App() {
  // Hooks for handling Bootstrap Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  var [taskID, setTaskID] = useState(' ')
  // Hooks for dealing with imported DataGrid data
   const [tasks, setTasks] = useState([])
   const [history, setHistory] = useState([])
  // Use Effect Hook to load data on page load (comparable to componentDidMount())
  useEffect(() => {
   let mounted = true;
   getTasks()
     .then(items => {
       if(mounted) {
         setTasks(items)
       }
     })
   return () => mounted = false;
 }, [])


  // Use Effect Hook to load data on page load (comparable to componentDidMount())
  useEffect(() => {
    let mounted = true;
    getHistory(taskID)
      .then(items => {
        if(mounted) {
          setHistory(items)
        }
      })
    return () => mounted = false;
  }, [taskID])


  // Functions to handle Double Click on any row within the DataGrid
  const onRowDoubleClick = useCallback((rowProps) => {
    //alert('Double-Clicked on row with task ID: ' + rowProps.data.Task)
    handleShow()
    var taskID = rowProps.data.Task;
    setTaskID(taskID)
    
  }, []);

  
  const onRenderRow = useCallback((rowProps) => {
    // save the original handler to be called later
    const { onDoubleClick } = rowProps;
    
    rowProps.onDoubleClick = (event) => {
      onRowDoubleClick(rowProps);
      if (onDoubleClick) {
        onDoubleClick(event);
      }
    };
  }, [onRowDoubleClick])

  // -- Exporting DataGrid to Excel -- //
  const [gridRef, setGridRef] = useState(null);
  const exportCSV = () => {
    const columns = gridRef.current.visibleColumns;
    
    const header = columns.map((c) => c.name).join(SEPARATOR);
    const rows = gridRef.current.data.map((data) => columns.map((c) => data[c.id]).join(SEPARATOR));

    const contents = [header].concat(rows).join('\n');

  console.dir(contents);
    const blob = new Blob([contents], { type: 'text/csv;charset=utf-8;' });

    downloadBlob(blob);
  };
  
  
  // Returning HTML data to user.
  return(
    <div>
      <ReactDataGrid
        handle={setGridRef}
        idProperty="id"
        columns={columns}
        pagination
        dataSource={tasks}
        style={gridStyle}
        theme={theme}
        onRenderRow={onRenderRow}
        
      />
      <Button variant="success" style={{margin:10}} onClick={exportCSV}>
         EXPORT TO EXCEL
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Task: {taskID}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReactDataGrid 
            columns={historyColumns}
            dataSource={history}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default App;
