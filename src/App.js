/* eslint-disable react/destructuring-assignment,jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import DoneIcon from '@material-ui/icons/Done';

// import './App.css';
import { plateAdd, plateRemove, plateSave } from './actions/plateStoreActions';
import { plateLogDownload } from './actions/plateLogActions';
import { socketConnect } from './actions/socketActions';
import EnhancedTable from './components/EnhancedTable';

const plateLogRows = [
  {
    id: 'uuid',
    numeric: false,
    disablePadding: true,
    label: 'UUID',
  },
  {
    id: 'plate',
    numeric: true,
    disablePadding: false,
    label: 'Plate',
  },
  {
    id: 'confidence',
    numeric: true,
    disablePadding: false,
    label: 'Confidence',
  },
  {
    id: 'timestamp',
    numeric: true,
    disablePadding: false,
    label: 'Timestamp',
  },
  {
    id: 'processingTime',
    numeric: true,
    disablePadding: false,
    label: 'Processing time',
  },
  {
    id: 'inWhitelist',
    numeric: true,
    disablePadding: false,
    label: 'Whitelisted?',
  },
];
const plateStoreRows = [
  {
    id: 'addedOn',
    numeric: false,
    disablePadding: true,
    label: 'Added on',
  },
  {
    id: 'plate',
    numeric: true,
    disablePadding: false,
    label: 'Plate',
  },
  {
    id: 'owner',
    numeric: true,
    disablePadding: false,
    label: 'Owner',
  },
  {
    id: 'department',
    numeric: false,
    disablePadding: false,
    label: 'Department',
  },
];

const styles = theme => ({
  root: {
    minWidth: '80%',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
});

class App extends Component {
  state = {
    editing: '',
    editOwner: '',
    editDepartment: '',
    owner: '',
    department: '',
    plateToAdd: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(socketConnect());
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handlePlateAdd = (event) => {
    if (this.state.plateToAdd === '') {
      event.preventDefault();
      return;
    }

    const { dispatch } = this.props;

    dispatch(plateAdd({
      owner: this.state.owner || '-',
      department: this.state.department || '-',
      plateToAdd: this.state.plateToAdd,
    }));

    this.setState({
      owner: '',
      department: '',
      plateToAdd: '',
    });
    event.preventDefault();
  };

  handlePlateRemove = (plate) => {
    const { dispatch } = this.props;

    dispatch(plateRemove(plate));
  };

  handlePlateEdit = (plate, owner, department) => {
    this.setState({
      editing: plate,
      editOwner: owner,
      editDepartment: department,
    });
  };

  handlePlateEditDone = (plate) => {
    const { dispatch } = this.props;
    dispatch(plateSave({
      plate,
      owner: this.state.editOwner,
      department: this.state.editDepartment,
    }));
    this.setState({
      editing: '',
    });
  };

  handlePlateLogDownload = () => {
    const { dispatch } = this.props;
    dispatch(plateLogDownload());
  };

  render() {
    const { plateStore, plateLog, classes } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingLeft: '50px',
          paddingRight: '50px',
          paddingBottom: '25px',
          paddingTop: '15px',
        }}
      >
        <div
          style={{
            flex: 1,
          }}
        >
          <h1 style={{ marginBottom: 10, }}>INSEAD LPR Dashboard</h1>
        </div>
        <div
          className={classes.root}
          style={{
            flex: 1,
            display: 'flex',
          }}
        >
          <div
            style={{
              flex: 4,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <EnhancedTable
              rows={plateLogRows}
              data={plateLog}
              orderBy="timestamp"
              rowsPerPageOptions={[5, 10, 15]}
              tableHeading="Detection log"
            />
            <Button
              style={{
                marginTop: '21px',
                alignSelf: 'flex-end',
              }}
              variant="contained"
              color="primary"
              type="submit"
              onClick={() => this.handlePlateLogDownload()}
            >
              Export to CSV
            </Button>
          </div>
          <div
            style={{ flex: 0.2 }}
          />
          <div
            style={{
              flex: 2.5,
              flexDirection: 'column',
              display: 'flex',
            }}
          >
            <EnhancedTable
              rows={plateStoreRows}
              data={plateStore.map(d => (
                {
                  ...d,
                  owner: this.state.editing === d.plate
                    ? (
                      <Input
                        label="Owner"
                        style={{
                          fontSize: '14px',
                          width: '100px',
                        }}
                        type="text"
                        value={this.state.editOwner}
                        name="editOwner"
                        onChange={this.handleChange}
                      />
                    )
                    : (
                      <div
                        style={{
                          minWidth: '100px',
                        }}
                      >
                        {d.owner || '-'}
                      </div>
                    ),
                  department: this.state.editing === d.plate
                    ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Input
                          label="Department"
                          style={{
                            fontSize: '14px',
                            width: '150px',
                          }}
                          type="text"
                          value={this.state.editDepartment}
                          name="editDepartment"
                          onChange={this.handleChange}
                        />
                        <Button
                          style={{
                            padding: 5, minHeight: 0, minWidth: 0,
                          }}
                          onClick={() => this.handlePlateEditDone(d.plate)}
                        >
                          <Tooltip
                            title="Done"
                            placement="right"
                            enterDelay={300}
                          >
                            <DoneIcon style={{ height: '18px' }} />
                          </Tooltip>
                        </Button>
                      </div>
                    )
                    : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div
                          style={{
                            minWidth: '150px',
                            textAlign: 'left',
                          }}
                        >
                          {d.department || '-'}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                          }}
                        >
                          <Button
                            style={{
                              padding: 5, paddingRight: 0, minHeight: 0, minWidth: 0,
                            }}
                            onClick={() => this.handlePlateEdit(d.plate, d.owner, d.department)}
                          >
                            <Tooltip
                              title="Edit"
                              placement="right"
                              enterDelay={300}
                            >
                              <EditIcon style={{ height: '18px' }} />
                            </Tooltip>
                          </Button>
                          <Button
                            style={{ padding: 5, minHeight: 0, minWidth: 0 }}
                            onClick={() => this.handlePlateRemove(d.plate)}
                          >
                            <Tooltip
                              title="Remove plate"
                              placement="right"
                              enterDelay={300}
                            >
                              <DeleteIcon style={{ height: '18px' }} />
                            </Tooltip>
                          </Button>
                        </div>
                      </div>
                    ),
                }
              ))}
              orderBy="addedOn"
              rowsPerPageOptions={[5, 10, 15]}
              tableHeading="Plate whitelist"
            />
            <form
              style={{
                alignSelf: 'flex-end',
              }}
              onSubmit={this.handlePlateAdd}
            >
              <TextField
                label="Owner"
                style={{
                  margin: '5px',
                  width: '120px',
                }}
                type="text"
                value={this.state.owner}
                name="owner"
                onChange={this.handleChange}
              />
              <TextField
                label="Department"
                style={{
                  margin: '5px',
                  width: '120px',
                }}
                type="text"
                value={this.state.department}
                name="department"
                onChange={this.handleChange}
              />
              <TextField
                label="Plate number"
                style={{
                  margin: '5px',
                  width: '120px',
                }}
                type="text"
                value={this.state.plateToAdd}
                name="plateToAdd"
                onChange={this.handleChange}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
              >
                Add
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    plateLog: { plateLog },
    plateStore: { plateStore },
  } = state;

  return {
    plateLog: plateLog
      .map(d => ({
        ...d, id: d.uuid + d.plate, highlight: d.inWhitelist === 'Y', sortKey: d.uuid,
      })),
    plateStore: plateStore
      .map(d => ({
        id: d.plate, ...d, sortKey: d.uuid,
      })),
  };
};

export default connect(mapStateToProps)(withStyles(styles)(App));
