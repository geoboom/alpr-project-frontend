/* eslint-disable react/destructuring-assignment,jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import DoneIcon from '@material-ui/icons/Done';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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

const DialogPlateCapture = ({
  open, onClose, uuid, plate,
}) => {
  const name = `${uuid}-${plate}`;
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        Plate Capture:
        {' '}
        {uuid}
      </DialogTitle>
      <DialogContent>
        <img
          style={{
            width: '500px',
          }}
          src={`static/plateImages/${name}.jpg`}
          alt={`Plate capture: ${plate}`}
        />
        {plate}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DialogPlateRemove = ({
  open, onClose, onRemove, whitelistInfo,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
  >
    <DialogTitle>Confirm Remove</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you wish to remove this plate whitelist?
      </DialogContentText>
      <div
        style={{
          marginTop: '10px',
        }}
      >
        <span style={{ fontWeight: 700 }}>Added on:</span>
        {' '}
        {whitelistInfo.addedOn}
        <br />
        <span style={{ fontWeight: 700 }}>Plate:</span>
        {' '}
        {whitelistInfo.plate}
        <br />
        <span style={{ fontWeight: 700 }}>Owner:</span>
        {' '}
        {whitelistInfo.owner || '-'}
        <br />
        <span style={{ fontWeight: 700 }}>Department:</span>
        {' '}
        {whitelistInfo.department || '-'}
        <br />
      </div>
    </DialogContent>
    <DialogActions>
      <Button onClick={onRemove}>
        Yes
      </Button>
      <Button onClick={onClose}>
        No
      </Button>
    </DialogActions>
  </Dialog>
);

class App extends Component {
  state = {
    dialogPlateCapturePlate: '',
    dialogPlateCaptureUUID: '',
    dialogPlateCapture: false,
    removeWhitelistInfo: {},
    dialogPlateRemove: false,
    filterWhitelist: false,
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

  handleFilterWhitelist = () => {
    this.setState(prevState => ({
      filterWhitelist: !prevState.filterWhitelist,
    }));
  };

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

  handlePlateRemove = ({
    addedOn, plate, owner, department,
  }) => {
    this.setState({
      removeWhitelistInfo: {
        addedOn, plate, owner, department,
      },
      dialogPlateRemove: true,
    });
  };

  handlePlateRemoveConfirm = () => {
    const { dispatch } = this.props;

    dispatch(plateRemove(this.state.removeWhitelistInfo.plate));
    this.setState({
      dialogPlateRemove: false,
      removeWhitelistInfo: {},
    });
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
        <DialogPlateCapture
          open={this.state.dialogPlateCapture}
          onClose={() => {
            this.setState({
              dialogPlateCapture: false,
              dialogPlateCaptureUUID: '',
              dialogPlateCapturePlate: '',
            });
          }}
          uuid={this.state.dialogPlateCaptureUUID}
          plate={this.state.dialogPlateCapturePlate}
        />
        <DialogPlateRemove
          open={this.state.dialogPlateRemove}
          onClose={() => { this.setState({ dialogPlateRemove: false, removeWhitelistInfo: {} }); }}
          onRemove={this.handlePlateRemoveConfirm}
          whitelistInfo={this.state.removeWhitelistInfo}
        />
        <div
          style={{
            flex: 1,
          }}
        >
          <h1 style={{ marginBottom: 10 }}>INSEAD LPR Dashboard</h1>
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
              data={
                (this.state.filterWhitelist
                  ? plateLog.filter(({ inWhitelist }) => inWhitelist === 'Y')
                  : plateLog).map(
                  record => ({
                    ...record,
                    uuid:
                      <a
                        onClick={() => {
                          this.setState({
                            dialogPlateCapturePlate: record.plate,
                            dialogPlateCaptureUUID: record.uuid,
                            dialogPlateCapture: true,
                          });
                        }}
                        href="javascript:void(0);"
                      >
                        {record.uuid}
                      </a>,
                  }),
                )
              }
              orderBy="timestamp"
              rowsPerPageOptions={[5, 10, 15]}
              tableHeading={(
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Typography variant="title">
                      Detection log
                    </Typography>
                  </div>
                  <div style={{ flex: 1, justifyContent: 'flex-end', display: 'flex' }}>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={this.state.filterWhitelist}
                          onChange={this.handleFilterWhitelist}
                          value="filterWhitelist"
                        />
)}
                      label="Show whitelisted only"
                    />
                  </div>
                </div>
)}
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
                        autoFocus
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
                        <form
                          onSubmit={() => this.handlePlateEditDone(d.plate)}
                        >
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
                            type="submit"
                          >
                            <Tooltip
                              title="Done"
                              placement="right"
                              enterDelay={300}
                            >
                              <DoneIcon style={{ height: '18px' }} />
                            </Tooltip>
                          </Button>
                        </form>
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
                            onClick={() => this.handlePlateRemove(d)}
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
              tableHeading={(
                <Typography variant="title">
                  Plate whitelist
                </Typography>
)}
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
                  marginRight: '10px',
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
