/* eslint-disable react/destructuring-assignment,jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

// import './App.css';
import { plateAdd, plateRemove } from './actions/plateStoreActions';
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
    numeric: false,
    disablePadding: false,
    label: 'Plate',
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
    plateToAdd: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(socketConnect());
  }

  handleChange = (event) => {
    this.setState({
      plateToAdd: event.target.value,
    });
  };

  handlePlateAdd = (event) => {
    if (this.state.plateToAdd === '') {
      event.preventDefault();
      return;
    }

    const { dispatch } = this.props;

    dispatch(plateAdd(this.state.plateToAdd));

    this.setState({
      plateToAdd: '',
    });
    event.preventDefault();
  };

  handlePlateRemove = (plate) => {
    const { dispatch } = this.props;

    dispatch(plateRemove(plate));
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
          paddingLeft: '10px',
          paddingRight: '10px',
          paddingBottom: '25px',
          paddingTop: '25px',
        }}
      >
        <div
          style={{
            flex: 1,
          }}
        >
          <h1>INSEAD ALPR</h1>
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
            style={{ minWidth: '10px', width: '20px' }}
          />
          <div
            style={{
              flex: 1,
              flexDirection: 'column',
              display: 'flex',
            }}
          >
            <EnhancedTable
              rows={plateStoreRows}
              data={plateStore.map(d => (
                {
                  ...d,
                  plate: <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {d.plate}
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
                  </div>,
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
                label="Add plate"
                style={{
                  margin: '5px',
                  width: '120px',
                }}
                type="text"
                value={this.state.plateToAdd}
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
      .map(d => ({ ...d, id: d.uuid, highlight: d.inWhitelist === 'Y' })),
    plateStore: plateStore
      .map(d => ({ id: d.plate, ...d })),
  };
};

export default connect(mapStateToProps)(withStyles(styles)(App));
